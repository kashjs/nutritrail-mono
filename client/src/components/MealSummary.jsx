import { Fragment } from 'react';

export default function MealSummary({ meal }) {
    return (
        <div>
            <p>{meal.description}</p>
            <dl>
                <dt>Meal type</dt>
                <dd>{meal.meal_type}</dd>
                <dt>Consumed at</dt>
                <dd>{meal.consumed_at}</dd>
                <dt>Calories</dt>
                <dd>{meal.calories}</dd>
                <dt>Protein</dt>
                <dd>{meal.protein_g}</dd>
                <dt>Carbs</dt>
                <dd>{meal.carbs_g}</dd>
                <dt>Fat</dt>
                <dd>{meal.fat_g}</dd>
                <dt>Fiber</dt>
                <dd>{meal.fiber_g}</dd>
            </dl>
            {
                meal.items?.map((item, index) => (
                    <Fragment key={item.id ?? index}>
                        <p>{item.description}</p>
                        <dl>
                            <dt>Quantity</dt>
                            <dd>{item.quantity}</dd>
                            <dt>Unit</dt>
                            <dd>{item.unit}</dd>
                            <dt>Calories</dt>
                            <dd>{item.calories}</dd>
                            <dt>Protein</dt>
                            <dd>{item.protein_g}</dd>
                            <dt>Carbs</dt>
                            <dd>{item.carbs_g}</dd>
                            <dt>Fat</dt>
                            <dd>{item.fat_g}</dd>
                            <dt>Fiber</dt>
                            <dd>{item.fiber_g}</dd>
                        </dl>
                    </Fragment>
                ))
            }
        </div>
    );
}