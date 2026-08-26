import { MEAL_TYPES, MACRO_FIELDS } from '../utils/Constants';
import { useId, Fragment } from 'react';
import './MealDetail.css';

import FormField from './FormField'

export default function MealDetail({ meal, onChange }) {
    const uid = useId();
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
        <form onSubmit={e => e.preventDefault()}>
            <label htmlFor={`${uid}-meal-description`}>Meal Description: </label><FormField id={`${uid}-meal-description`} value={meal.description} onChange={value => handleFieldChange('description', value)} />
            <label htmlFor={`${uid}-meal-meal_type`}>meal type: </label><FormField id={`${uid}-meal-meal_type`} type='select' options={MEAL_TYPES} value={meal.meal_type} onChange={value => handleFieldChange('meal_type', value)} />
            <label htmlFor={`${uid}-meal-consumed_at`}>consumed at: </label><FormField id={`${uid}-meal-consumed_at`} type='datetime-local' value={meal.consumed_at} onChange={value => handleFieldChange('consumed_at', value)} />
            {
                MACRO_FIELDS.map((macroField, index) => (
                    <Fragment key={macroField}>
                        <label htmlFor={`${uid}-${index}-${macroField}`}>{macroField}: </label> <FormField id={`${uid}-${index}-${macroField}`} type="number" value={meal[macroField]} onChange={value => handleFieldChange(macroField, value)} />
                    </Fragment>
                ))
            }
            <ul>
                {
                    meal.items?.map((item, index) => (
                        <li key={index}>
                            <fieldset>
                                <legend>Item {index + 1}</legend>
                                <label htmlFor={`${uid}-item-${index}-description`}>Description: </label><FormField id={`${uid}-item-${index}-description`} value={item.description} onChange={value => itemChange(index, 'description', value)} />
                                <label htmlFor={`${uid}-item-${index}-quantity`}>quantity: </label><FormField id={`${uid}-item-${index}-quantity`} type="number" value={item.quantity} onChange={value => itemChange(index, 'quantity', value)} />
                                <label htmlFor={`${uid}-item-${index}-unit`}>unit: </label><FormField id={`${uid}-item-${index}-unit`} value={item.unit} onChange={value => itemChange(index, 'unit', value)} />
                                {
                                    MACRO_FIELDS.map(macroField => (
                                        <Fragment key={macroField} >
                                            <label htmlFor={`${uid}-item-${index}-${macroField}`}>{macroField}: </label><FormField id={`${uid}-item-${index}-${macroField}`} type="number" value={item[macroField]} onChange={value => itemChange(index, macroField, value)} />
                                        </Fragment>
                                    ))
                                }
                            </fieldset>
                        </li>
                    ))
                }
            </ul>


        </form>
    )
}