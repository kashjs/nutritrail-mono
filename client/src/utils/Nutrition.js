import { MACRO_FIELDS } from './Constants';

// The macro columns are `numeric` in Postgres, which the pg driver hands back as
// strings, and they're nullable — so coerce every value before adding it up.
export function sumNutrition(meals) {
    return MACRO_FIELDS.reduce((totals, field) => {
        totals[field] = meals.reduce((sum, meal) => sum + Number(meal[field] ?? 0), 0);
        return totals;
    }, {});
}
