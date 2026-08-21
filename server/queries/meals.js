async function getMealByIdForUser(client, mealId, userId) {
    const result = await client.query(
        `SELECT * FROM meals WHERE id = $1 AND user_id = $2`,
        [mealId, userId]
    );

    return result.rows[0];
}

async function getItemsByMealIds(client, mealIds) {
    const result = await client.query(
        `SELECT * FROM meal_items WHERE meal_id = ANY($1::int[])`,
        [mealIds]
    );

    const itemsByMeal = {};
    for(const item of result.rows) {
        if (!itemsByMeal[item.meal_id]) {
            itemsByMeal[item.meal_id] = [];
        }
        itemsByMeal[item.meal_id].push(item);
    }

    return itemsByMeal;
}

async function insertMealItem(client, mealId, mealItemObject) {
        const result = await client.query(
                    `INSERT INTO meal_items (meal_id, description, quantity, unit, calories, protein_g, carbs_g, fat_g) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
                    [mealId, mealItemObject.description, mealItemObject.quantity, mealItemObject.unit, mealItemObject.calories, mealItemObject.protein_g, mealItemObject.carbs_g, mealItemObject.fat_g]
                )
        return result.rows[0];
}

async function updateMealItem(client, mealId, mealItemId, mealItemObject) {
    
    const setClauses = [];
    const params = [];
    for(const [key, value] of Object.entries(mealItemObject)) {
        if (value !== undefined) {
            params.push(value);
            setClauses.push(`${key} = $${params.length}`);        
        }        
    }
    params.push(mealId);
    params.push(mealItemId);
    
    if(setClauses.length === 0) {
        return undefined;
    }

    const updateQuery = `UPDATE meal_items
    SET ${setClauses.join(', ')}
    WHERE meal_id = $${params.length - 1} 
    AND id = $${params.length}
    RETURNING *`;

    const result = await client.query(updateQuery, params);
    return result.rows[0] || undefined;
}

module.exports = { getMealByIdForUser, getItemsByMealIds, insertMealItem, updateMealItem};