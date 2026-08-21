const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const validate = require('../middleware/validate');
const { z } = require('zod');
const { dailySignupsRateLimiter, dailyLoginsRateLimiter } = require('../middleware/rateLimit');

const router = express.Router();

const registerSchema = z.object({
    email: z.email(),
    password: z.string().min(8)
});

const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(1)
});

router.post('/register', dailySignupsRateLimiter, validate(registerSchema), async (req, res) => {
    const { email, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    const result = await pool.query(
        'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email',
        [email, passwordHash]
    );

    res.status(201).json(result.rows[0]);
});

router.post('/login', dailyLoginsRateLimiter, validate(loginSchema), async (req, res) => {
    const { email, password } = req.body;

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token })
});

module.exports = router;