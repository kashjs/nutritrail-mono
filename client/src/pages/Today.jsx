import { useState, useEffect } from 'react';
import MealCard from '../components/MealCard';

export default function Today() {
    const [meals, setMeals] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://localhost:3000/meals', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}`}
        })
            .then(response => response.json())
            .then(setMeals)
            .catch(setError)
    }, []); // empty deps array = run once, on mount 

    if (error) return <p>Error loading meals</p>
    if (!meals) return <p>Loading...</p>

    function onMealChange(updatedMeal) {
        setMeals(meals => meals.map(meal => meal.id === updatedMeal.id ? updatedMeal : meal));
    }

    return (
        <ul>
            {
                meals.map(meal => {
                    return <li key={meal.id}>
                        <MealCard meal={meal} onSave={onMealChange}/>
                    </li>
                })
            }
        </ul>
        
    );
}