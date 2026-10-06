import { request } from './client';
import type { Meal, MealItem } from '../types/meal';

export const getMeals = (query: string = '') => request<Meal[]>(`/meals${query}`);

export const parseMeal = (text: string, previous_response_id?: string) => request<Meal & { previous_response_id: string }>('/meals/parse', {
    method: 'POST',
    body: { text, previous_response_id }
});

export const createMeal = (meal: Meal) => request<Meal>(`/meals`, { method: 'POST', body: meal });

export const updateMeal = (id: number, meal: Partial<Meal>) => request<Meal>(`/meals/${id}`, { method: 'PATCH', body: meal });

export const deleteMeal = (id: number) => request<null>(`/meals/${id}`, { method: 'DELETE' });

export const updateMealItem = (mealId: number, itemId: number, item: Partial<MealItem>) => request<MealItem>(`/meals/${mealId}/items/${itemId}`, { method: 'PATCH', body: item });