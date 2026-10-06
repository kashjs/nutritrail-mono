import { MEAL_TYPES } from '../utils/Constants';

export type NutritionMacro = number | null;

export type MealType = typeof MEAL_TYPES[number];

export interface Macros {
    calories?: NutritionMacro;
    protein_g?: NutritionMacro;
    carbs_g?: NutritionMacro;
    fat_g?: NutritionMacro;
    fiber_g?: NutritionMacro;
}

export interface MealItem extends Macros {
    id?: number;
    description: string;
    quantity?: number | null;
    unit?: string | null;
}

export interface Meal extends Macros {
    id?: number;
    description: string;
    meal_type: MealType | null;
    consumed_at: string;
    items?: MealItem[]
}
