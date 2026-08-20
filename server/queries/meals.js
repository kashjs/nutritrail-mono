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

module.exports = { getMealByIdForUser, getItemsByMealIds };