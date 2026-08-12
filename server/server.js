require('dotenv').config();
const express = require('express');
const pool = require('./db');
const app = express();


app.get('/', (req, res) => {
    res.send('hello world')
});

app.get('/health', async (req, res) => {
    const result = await pool.query('SELECT NOW()');
    res.send(result.rows[0]);
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running at http://localhost:${process.env.PORT}`);
});