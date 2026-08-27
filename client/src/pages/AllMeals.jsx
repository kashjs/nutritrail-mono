import { useState, useEffect } from 'react';
import MealCard from '../components/MealCard';

export default function AllMeals() {
    const [meals, setMeals] = useState(null);
    const [error, setError] = useState(null);
    const [loadingMeals, setLoadingMeals] = useState(null);

    useEffect(() => {
        setLoadingMeals(true);
        fetch('http://localhost:3000/meals', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
            .then(response => response.json())
            .then(setMeals)
            .catch(setError)
            .finally(() => {
                setLoadingMeals(false)
            })
    }, []); // empty deps array = run once, on mount 

    function onMealChange(updatedMeal) {
        setMeals(meals => meals.map(meal => meal.id === updatedMeal.id ? updatedMeal : meal));
    }

    function onDeleteMeal(deletedMeal) {
        setMeals(meals => meals.filter(meal => meal.id !== deletedMeal.id));
    }

    return (
        <div className="all-meals-page">
            <h1>All Meals</h1>
            {loadingMeals && <p>Loading...</p>}
            {error && <p>Error loading meals</p>}
            {meals &&
                <ul className="list-unstyled">
                    {
                        meals.map(meal => {
                            return <li key={meal.id}>
                                <MealCard meal={meal} onSave={onMealChange} onDeleteMeal={onDeleteMeal} />
                            </li>
                        })
                    }
                </ul>
            }
        </div>

    );
}