require('dotenv').config();
const express = require('express');
const pool = require('./db');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const requireAuth = require('./middleware/auth');


app.get('/', (req, res) => {
    res.send('hello world')
});

app.get('/me', requireAuth, (req, res) => {
    res.json({userId: req.user.userId});
});

app.get('/health', async (req, res) => {
    const result = await pool.query('SELECT NOW()');
    res.send(result.rows[0]);
});

app.post('/register', express.json(), async (req, res) => {
    const { email, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    const result = await pool.query(
        'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email',
        [email, passwordHash]
    );

    res.status(201).json(result.rows[0]);
});

app.post('/login', express.json(), async (req, res) => {
    const {email, password} = req.body;

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    if (!user) {
        return res.status(401).json({error: 'Invalid credentials'});
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
        return res.status(401).json({error: 'Invalid credentials'});
    }

    const token = jwt.sign({userId: user.id}, process.env.JWT_SECRET, {expiresIn: '1h'});

    res.json({token})
});


app.listen(process.env.PORT, () => {
    console.log(`Server is running at http://localhost:${process.env.PORT}`);
});
