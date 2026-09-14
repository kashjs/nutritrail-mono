import { useState, useEffect } from 'react';
import MealCard from '../components/MealCard';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';
import './AllMeals.css';

export default function AllMeals() {
    const [meals, setMeals] = useState(null);
    const [error, setError] = useState(null);
    const [loadingMeals, setLoadingMeals] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        setLoadingMeals(true);
        fetch('/api/meals', {
            credentials: 'include'
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
            <div className="heading-bar">
                <h1>All Meals</h1>
                <button className="button-primary" onClick={() => navigate('/add-meal')}>
                    Add Meal
                </button>
            </div>
            {loadingMeals && <Loading />}
            {error && <p>Error loading meals</p>}
            {meals &&
                <ul className="list-unstyled meals-list">
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