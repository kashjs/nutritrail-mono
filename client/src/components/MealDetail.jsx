const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'];
const MACRO_FIELDS = ['calories', 'protein_g', 'carbs_g', 'fat_g', 'fiber_g'];
import FormField from './FormField'

export default function MealDetail({ meal, onChange, readOnly }) {
    function handleFieldChange(field, value) {
        onChange({ ...meal, [field]: value })
    }

    function itemChange(index, field, value) {
        const newItems = meal.items.map((item, i) =>
            i === index ? { ...item, [field]: value } : item
        );
        onChange({ ...meal, items: newItems });
    }

    return (
        <>
            <FormField readOnly={readOnly} value={meal.description} onChange={value => handleFieldChange('description', value)} /><br />
            <span>meal type: </span><FormField readOnly={readOnly} type='select' options={MEAL_TYPES} value={meal.meal_type} onChange={value => handleFieldChange('meal_type', value)} /><br />
            <span>consumed at: </span><FormField readOnly={readOnly} type='datetime-local' value={meal.consumed_at} onChange={value => handleFieldChange('consumed_at', value)} />
            <p>Macro Fields</p>
            <ul>
                {
                    MACRO_FIELDS.map(macroField => (
                        <li key={macroField}>
                            {macroField}: <FormField readOnly={readOnly} type="number" value={meal[macroField]} onChange={value => handleFieldChange(macroField, value)} />
                        </li>
                    ))
                }
            </ul>
            <h3>Items</h3>
            <ul>
                {
                    meal.items?.map((item, index) => (
                        <li key={index}>
                            <p>Item {index + 1}: </p>
                            <FormField readOnly={readOnly} value={item.description} onChange={value => itemChange(index, 'description', value)} /><br />
                            <span>quantity: </span><FormField readOnly={readOnly} type="number" value={item.quantity} onChange={value => itemChange(index, 'quantity', value)} /><br />
                            <span>unit: </span><FormField readOnly={readOnly} value={item.unit} onChange={value => itemChange(index, 'unit', value)} /><br />
                            <p>Macro Fields</p>
                            <ul>
                                {
                                    MACRO_FIELDS.map(macroField => (
                                        <li key={macroField}>
                                            {macroField}: <FormField readOnly={readOnly} type="number" value={item[macroField]} onChange={value => itemChange(index, macroField, value)} />
                                        </li>
                                    ))
                                }
                            </ul>
                        </li>
                    ))
                }
            </ul>
            <br />
        </>
    )
}