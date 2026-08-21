const pool = require('../db');

beforeEach(async () => {
  await pool.query('TRUNCATE users, meals, meal_items RESTART IDENTITY CASCADE;');
});

afterAll(async () => {
  await pool.end();
});