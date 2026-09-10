import { useState } from 'react';
import MealDetail from './MealDetail';
import MealSummary from './MealSummary';
import './MealCard.css';

export default function MealCard({ meal, onSave, onDeleteMeal }) {
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [draftMeal, setDraftMeal] = useState(meal);

    function startEdit() {
        setDraftMeal(meal);
        setIsEditing(true);
    }

    function cancelEdit() {
        setDraftMeal(meal);
        setIsEditing(false);
    }

    async function deleteMeal() {

        if (draftMeal.id) {
            await fetch(`http://localhost:3000/meals/${meal.id}`, {
                method: 'DELETE',
                credentials: 'include'
            }).catch(error => {
                console.log(error);
            });
        }

        onDeleteMeal(meal);
        setDraftMeal(null);
    }

    async function handleUpdate() {
        setIsSaving(true);
        const headers = { 'Content-Type': 'application/json' };

        let savedMeal = await fetch(`http://localhost:3000/meals${draftMeal.id ? ('/' + draftMeal.id) : ''}`, {
            method: draftMeal.id ? 'PATCH' : 'POST',
            credentials: 'include',
            headers,
            body: JSON.stringify({
                description: draftMeal.description,
                calories: draftMeal.calories,
                protein_g: draftMeal.protein_g,
                carbs_g: draftMeal.carbs_g,
                fat_g: draftMeal.fat_g,
                fiber_g: draftMeal.fiber_g,
                meal_type: draftMeal.meal_type,
                consumed_at: draftMeal.consumed_at,
                items: draftMeal.items
            })
        }).then(response => response.json());

        if (draftMeal.id) {
            await Promise.all(draftMeal.items.map(item => fetch(`http://localhost:3000/meals/${draftMeal.id}/items/${item.id}`, {
                method: 'PATCH',
                credentials: 'include',
                headers,
                body: JSON.stringify({
                    description: item.description,
                    quantity: item.quantity,
                    unit: item.unit,
                    calories: item.calories,
                    protein_g: item.protein_g,
                    carbs_g: item.carbs_g,
                    fat_g: item.fat_g,
                    fiber_g: item.fiber_g,
                })
            })));

            // PATCH /meals/:id doesn't return items, so carry over the
            // already-saved item values from the draft instead.
            savedMeal = { ...savedMeal, items: draftMeal.items };
        }


        onSave(savedMeal);
        setIsEditing(false);
        setIsSaving(false);
    }

    return (
        <article className="meal-card">
            {draftMeal && (isEditing ? <MealDetail meal={draftMeal} onChange={setDraftMeal} /> : <MealSummary meal={draftMeal} />)}
            <div className="button-row">
                {
                    !isEditing && !draftMeal?.id && <button type="button" className="button-primary" onClick={handleUpdate}>{isSaving ? "Saving..." : "Add Meal"}</button>
                }
                {
                    isEditing && <button type="button" className="button-primary" onClick={handleUpdate}>{isSaving ? "Saving..." : (draftMeal.id ? "Update" : "Add Meal")}</button>
                }
                <button type="button" className="button-danger" onClick={deleteMeal}>Delete</button>
                {!isEditing && <button type="button" className="button-secondary" onClick={startEdit}>Edit</button>}
                {isEditing && <button type="button" className="button-secondary" onClick={cancelEdit}>Cancel</button>}
            </div>
        </article>
    );

}