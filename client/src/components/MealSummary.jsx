import { Fragment } from 'react';
import './MealSummary.css';

export default function MealSummary({ meal }) {
    return (
        <div className="meal">
            <p className="meal-description">{meal.description}</p>
            <div>
                <dl>
                    <div>
                        <dt>Consumed at</dt>
                        <dd> - {meal.consumed_at}</dd>
                    </div>
                </dl>
            </div>
            <div className="meal-columns">
                <dl>
                    <div>
                        <dt>Meal type</dt>
                        <dd> - {meal.meal_type}</dd>
                    </div>
                    <div>
                        <dt>Calories</dt>
                        <dd> - {meal.calories}</dd>
                    </div>
                    <div>
                        <dt>Protein</dt>
                        <dd> - {meal.protein_g}g</dd>
                    </div>
                </dl>
                <dl>
                    <div>
                        <dt>Carbs</dt>
                        <dd> - {meal.carbs_g}g</dd>
                    </div>
                    <div>
                        <dt>Fat</dt>
                        <dd> - {meal.fat_g}g</dd>
                    </div>
                    <div>
                        <dt>Fiber</dt>
                        <dd> - {meal.fiber_g}g</dd>
                    </div>

                </dl>
            </div>
            <section className="meal-items">
                {
                    meal.items?.map((item, index) => (
                        <div className="meal-item" key={item.id ?? index}>
                            <p className="meal-item-description">{item.description}</p>
                            <dl>
                                <div>
                                    <dt>Quantity</dt>
                                    <dd> - {item.quantity}</dd>
                                </div>
                                <div>
                                    <dt>Unit</dt>
                                    <dd> - {item.unit}</dd>
                                </div>

                                <div>
                                    <dt>Calories</dt>
                                    <dd> - {item.calories}</dd>
                                </div>
                                <div>
                                    <dt>Protein</dt>
                                    <dd> - {item.protein_g}g</dd>
                                </div>
                                <div>
                                    <dt>Carbs</dt>
                                    <dd> - {item.carbs_g}g</dd>
                                </div>
                                <div>
                                    <dt>Fat</dt>
                                    <dd> - {item.fat_g}g</dd>
                                </div>
                                <div>
                                    <dt>Fiber</dt>
                                    <dd> - {item.fiber_g}g</dd>
                                </div>
                            </dl>
                        </div>
                    ))
                }
            </section>
        </div>
    );
}