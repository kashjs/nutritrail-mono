import { useState } from 'react';
import MealDetail from './MealDetail';

export default function MealCard({meal, onSave, onDeleteMeal}) {
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

        if(draftMeal.id) {
            const headers = {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            };
            
            await fetch(`http://localhost:3000/meals/${meal.id}`, {
                method: 'DELETE',
                headers
            }).catch(error => {
                console.log(error);
            });            
        }

        onDeleteMeal(meal);
        setDraftMeal(null);
    }

    async function handleUpdate() {
        setIsSaving(true);
        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
        };

        let savedMeal = await fetch(`http://localhost:3000/meals${draftMeal.id ? ('/' + draftMeal.id) : ''}`, {
            method: draftMeal.id ? 'PATCH' : 'POST',
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

        if(draftMeal.id) {
            await Promise.all(draftMeal.items.map(item => fetch(`http://localhost:3000/meals/${draftMeal.id}/items/${item.id}`, {
                method: 'PATCH',
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
        <div>
            {draftMeal && <MealDetail meal={draftMeal} onChange={setDraftMeal} readOnly={!isEditing} />}
            {isEditing ? (
                <>
                    <button onClick={handleUpdate}>{isSaving ? "Saving..." : (draftMeal.id ? "Update" : "Add Meal") }</button>
                    <button onClick={cancelEdit}>Cancel</button>
                </>
                ) : (
                    <button onClick={startEdit}>Edit</button>
                )
            }
            {
                draftMeal?.id ? '' : <button onClick={handleUpdate}>{isSaving ? "Saving..." : "Add Meal" }</button>
            }
            <button onClick={deleteMeal}>Delete</button>
        </div>
    );

}