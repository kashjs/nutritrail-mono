require('dotenv').config();
const express = require('express');
const pool = require('./db');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const requireAuth = require('./middleware/auth');

app.use(express.json());

app.get('/', (req, res) => {
    res.send('hello world')
});

app.get('/health', async (req, res) => {
    const result = await pool.query('SELECT NOW()');
    res.send(result.rows[0]);
});

app.post('/register', async (req, res) => {
    const { email, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    const result = await pool.query(
        'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email',
        [email, passwordHash]
    );

    res.status(201).json(result.rows[0]);
});

app.post('/login', async (req, res) => {
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

// =========== Authentication required =========== //
app.use(requireAuth);

app.get('/me', (req, res) => {
    res.json({userId: req.user.userId});
});


app.post('/meals', async (req, res) => {
    const {description, calories, protein_g, carbs_g, fat_g, meal_type, consumed_at, items} = req.body;

    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const mealReault = await client.query(
            `INSERT INTO meals (user_id, description, calories, protein_g, carbs_g, fat_g, meal_type, consumed_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [req.user.userId, description, calories, protein_g, carbs_g, fat_g, meal_type, consumed_at]
        );
        const meal = mealReault.rows[0];

        const savedItems = [];
        if (items && items.length) {
            for (const item of items) {
                const itemResult = await client.query(
                    `INSERT INTO meal_items (meal_id, description, quantity, unit, calories, protein_g, carbs_g, fat_g) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
                    [meal.id, item.description, item.quantity, item.unit, item.calories, item.protein_g, item.carbs_g, item.fat_g]
                );
                savedItems.push(itemResult.rows[0]);
            }
        }

        await client.query('COMMIT');
        res.status(201).json({...meal, items: savedItems});
    } catch (error) {
        await client.query('ROLLBACK');
        res.status(500).json({error: 'Failed to create meal'})
    } finally {
        await client.release();
    }
});

app.get('/meals', async (req, res) => {
    const mealResult = await pool.query(
        'SELECT * FROM meals WHERE user_id = $1 ORDER BY consumed_at DESC',
        [req.user.userId]
    );
    const meals = mealResult.rows;

    if (meals.length === 0) {
        res.json([]);
    }

    const mealIds = meals.map(meal => meal.id);

    const itemResult = await pool.query(
        `SELECT * FROM meal_items WHERE meal_id = ANY($1::int[])`,
        [mealIds]
    ); 

    const itemsByMeal = {}
    for (const item of itemResult.rows) {
        if(!itemsByMeal[item.meal_id]) {
            itemsByMeal[item.meal_id] = [];
        }
        itemsByMeal[item.meal_id].push(item);
    }

    const mealWithItems = meals.map(meal => ({
        ...meal,
        items: itemsByMeal[meal.id] || []
    }));

    res.json(mealWithItems);
});


app.listen(process.env.PORT, () => {
    console.log(`Server is running at http://localhost:${process.env.PORT}`);
});
