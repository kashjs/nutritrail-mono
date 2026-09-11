import { useState } from "react";
import MealCard from "../components/MealCard";
import { getLocalDateTimeString } from '../utils/DateTime';
import { useNavigate } from 'react-router-dom';
import { MEAL_TYPES } from '../utils/Constants';
import './AddMeal.css';

export default function AddMeal() {
    const [inputText, setInputText] = useState('');
    const [generatingMeal, setGeneratingMeal] = useState(false);
    const [meal, setMeal] = useState(null);
    const navigate = useNavigate();

    function onDeleteMeal() {
        setMeal(null);
    }

    function getMealType() {
        const hour = new Date().getHours();
        if (hour <= 10) {
            return MEAL_TYPES[0]
        } else if (hour <= 14) {
            return MEAL_TYPES[1]
        } else if (hour <= 17) {
            return MEAL_TYPES[3]
        } else if (hour <= 21) {
            return MEAL_TYPES[2]
        } else {
            return MEAL_TYPES[3]
        }
    }

    async function generateMeal(e) {
        e.preventDefault();
        setMeal(null);

        setGeneratingMeal(true);

        await fetch('/api/meals/parse', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text: inputText,
                previous_response_id: meal?.previous_response_id
            })
        })
            .then(response => response.json())
            .then(generatedMeal => {
                generatedMeal.consumed_at = generatedMeal.consumed_at || getLocalDateTimeString();
                generatedMeal.meal_type = generatedMeal.meal_type || getMealType();
                setMeal(generatedMeal);
                setInputText('');
            })
            .catch(error => console.log(error));

        setGeneratingMeal(false);
    }

    function onMealSave() {
        navigate('/');
    }

    return (
        <div className="add-meals-page">
            <h1>Add Meals</h1>
            <div className="flex-columns gap-4 mt3">
                {generatingMeal && <p>Loading...</p>}
                {meal && <MealCard meal={meal} onSave={onMealSave} onDeleteMeal={onDeleteMeal} />}
                <form onSubmit={generateMeal}>
                    <input className="add-meal-input" type="text" placeholder={
                        meal
                            ? "Add a correction, for example: \"it was three eggs not two\""
                            : "For example: \"two eggs with white bread\""
                    } onChange={e => setInputText(e.target.value)} value={inputText} />
                    <button className="button-primary">Submit</button>
                </form>
            </div>
        </div>
    )
}