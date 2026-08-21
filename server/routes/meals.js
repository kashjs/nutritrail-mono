const express = require('express');
const pool = require('../db');
const { getMealByIdForUser, getItemsByMealIds, insertMealItem, updateMealItem } = require('../queries/meals');
const validate = require('../middleware/validate');
const { z } = require('zod');
const { parseMealText } = require('../services/openai');

const router = express.Router();

const macroField = z.number().nonnegative().nullable().optional();

const mealItemSchema = z.object({
    description: z.string().min(1),
    quantity: z.number().positive().optional(),
    unit: z.string().min(1).optional(),
    calories: macroField,
    protein_g: macroField,
    carbs_g: macroField,
    fat_g: macroField,
    fiber_g: macroField,
});

const createMealSchema = z.object({
    description: z.string().min(1),
    calories: macroField,
    protein_g: macroField,
    carbs_g: macroField,
    fat_g: macroField,
    fiber_g: macroField,
    meal_type: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
    consumed_at: z.coerce.date(),
    items: z.array(mealItemSchema).optional(),
});

const updateMealSchema = createMealSchema.omit({items: true}).partial();
const updateMealItemSchema = mealItemSchema.partial();

const parseMealTextSchema = z.object({
    text: z.string().min(2),
    previous_response_id: z.string().optional(),
});

router.post('/meals', validate(createMealSchema), async (req, res) => {
    const {description, calories, protein_g, carbs_g, fat_g, fiber_g, meal_type, consumed_at, items} = req.body;

    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const mealResult = await client.query(
            `INSERT INTO meals (user_id, description, calories, protein_g, carbs_g, fat_g, fiber_g, meal_type, consumed_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [req.user.userId, description, calories, protein_g, carbs_g, fat_g, fiber_g, meal_type, consumed_at]
        );
        const meal = mealResult.rows[0];

        const savedItems = [];
        if (items && items.length) {
            for (const item of items) {
                const itemResult = await insertMealItem(client, meal.id, item);
                savedItems.push(itemResult);
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

router.patch('/meals/:id', validate(updateMealSchema), async (req, res) => {
    const mealId = req.params.id;
    const {description, calories, protein_g, carbs_g, fat_g, fiber_g, meal_type, consumed_at} = req.body;
    const fields = {description, calories, protein_g, carbs_g, fat_g, fiber_g, meal_type, consumed_at};

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

router.post('/meals/:mealId/items', validate(mealItemSchema), async (req, res) => {
    const meal = await getMealByIdForUser(pool, req.params.mealId, req.user.userId);
    if (!meal) {
        return res.status(404).json({error: 'No meal found'});
    }
    const item = await insertMealItem(pool, meal.id, req.body);
    res.status(201).json(item);
});

router.patch('/meals/:mealId/items/:itemId', validate(updateMealItemSchema), async (req, res) => {
    const meal = await getMealByIdForUser(pool, req.params.mealId, req.user.userId);
    if (!meal) {
        return res.status(404).json({error: 'No meal found'});
    }
    const item = await updateMealItem(pool, meal.id, req.params.itemId, req.body);
    if(item) {
        res.json(item);
    } else {
       return res.status(404).json({error: 'No items found'}); 
    }
});

router.delete('/meals/:mealId/items/:itemId', async (req, res) => {
    const meal = await getMealByIdForUser(pool, req.params.mealId, req.user.userId);
    if (!meal) {
        return res.status(404).json({error: 'No meal found'});
    }
    const deleteResult = await pool.query(
        `DELETE FROM meal_items WHERE meal_id = $1 AND id = $2`,
        [req.params.mealId, req.params.itemId]
    );

    if(deleteResult.rowCount === 0) {
        return res.status(404).json({error: 'No meal item found'});
    }

    res.status(204).send();
});

router.post('/meals/parse', validate(parseMealTextSchema), async (req, res) => {
    const {parsedResponse, responseId:previous_response_id} = await parseMealText(req.body.text, req.body.previous_response_id);

    res.json({...parsedResponse, previous_response_id});
});

module.exports = router;