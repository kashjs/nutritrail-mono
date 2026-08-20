const express = require('express');
const pool = require('../db');
const { getMealByIdForUser, getItemsByMealIds } = require('../queries/meals');

const router = express.Router();

router.post('/meals', async (req, res) => {
    const {description, calories, protein_g, carbs_g, fat_g, meal_type, consumed_at, items} = req.body;

    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const mealResult = await client.query(
            `INSERT INTO meals (user_id, description, calories, protein_g, carbs_g, fat_g, meal_type, consumed_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [req.user.userId, description, calories, protein_g, carbs_g, fat_g, meal_type, consumed_at]
        );
        const meal = mealResult.rows[0];

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
        throw error;
    } finally {
        client.release();
    }
});

router.get('/meals', async (req, res) => {
    const {date, to, from} = req.query;

    let mealsQuery = `SELECT * FROM meals WHERE user_id = $1`;
    const mealsQueryParams = [req.user.userId];

    if(date) {
        mealsQuery += ' AND consumed_at::date = $2';
        mealsQueryParams.push(date);
    } else if(from && to) {
        mealsQuery += ' AND consumed_at::date BETWEEN $2 AND $3';
        mealsQueryParams.push(from, to);
    }

    mealsQuery += ' ORDER BY consumed_at DESC';
    const mealResult = await pool.query(
        mealsQuery,
        mealsQueryParams
    );
    const meals = mealResult.rows;

    if (meals.length === 0) {
        return res.json([]);
    }

    const mealIds = meals.map(meal => meal.id);

    const itemResult = await getItemsByMealIds(pool, mealIds);

    const mealsWithItems = meals.map(meal => ({
        ...meal,
        items: itemResult[meal.id] || []
    }));

    res.json(mealsWithItems);
});

router.get('/meals/:id', async (req, res) => {
    const meal = await getMealByIdForUser(pool, req.params.id, req.user.userId);
    if(!meal) {
        return res.status(404).json({error: 'No meal found'});
    }
    const itemsByMeal = await getItemsByMealIds(pool, [meal.id]);
    meal.items = itemsByMeal[meal.id] || [];

    res.json(meal);
});

router.patch('/meals/:id', async (req, res) => {
    const mealId = req.params.id;
    const {description, calories, protein_g, carbs_g, fat_g, meal_type, consumed_at} = req.body;
    const fields = {description, calories, protein_g, carbs_g, fat_g, meal_type, consumed_at};

    const setClauses = [];
    const params = [];

    for (const [column, value] of Object.entries(fields)) {
        if (value !== undefined) {
            params.push(value);
            setClauses.push(`${column} = $${params.length}`);
        }
    }

    if (setClauses.length === 0) {
        return res.status(400).json({error: 'No fields to update'});
    }

    params.push(mealId, req.user.userId);
    const updateQuery = `
        UPDATE meals SET ${setClauses.join(', ')}
        WHERE id = $${params.length - 1}
        AND user_id = $${params.length}
        RETURNING *
    `;
    const updateResult = await pool.query(updateQuery, params);

    if (updateResult.rows.length === 0) {
        return res.status(404).json({error: 'No meal found'});
    }
    res.json(updateResult.rows[0]);
});

router.delete('/meals/:id', async (req, res) => {
    const deleteResult = await pool.query(
        `DELETE FROM meals WHERE id = $1 AND user_id = $2`,
        [req.params.id, req.user.userId]
    );

    if (deleteResult.rowCount === 0) {
        return res.status(404).json({error: 'No meal found'});
    }
    res.status(204).send();
});

module.exports = router;