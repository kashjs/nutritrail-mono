import { useState } from "react";
import MealCard from "../components/MealCard";

export default function AddMeal() {
    const [inputText, setInputText] = useState('');
    const [generatingMeal, setGeneratingMeal] = useState(false);
    const [meal, setMeal] = useState(null);
    
    async function generateMeal () {
        setMeal(null);

        setGeneratingMeal(true);
        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
        };

        await fetch('http://localhost:3000/meals/parse', {
            method: 'POST',
            headers,
            body: JSON.stringify({
                text: inputText,
                previous_response_id: meal?.previous_response_id
            })
        })
            .then(response => response.json())
            .then(generatedMeal => {
                setMeal(generatedMeal);
                setInputText('');
            })
            .catch(error => console.log(error));
        
        setGeneratingMeal(false);
    }

    function onMealSave() {
        // TODO
    }

    return (
        <>
            {generatingMeal && <p>Loading...</p>}
            {meal && <MealCard meal={meal} onSave={onMealSave}/>}
            <textarea onChange={e => setInputText(e.target.value)} value={inputText} />
            <button onClick={generateMeal}>Submit</button>
        </>
    )
}