import { MACRO_FIELDS } from '../utils/Constants';
import { sumNutrition } from '../utils/Nutrition';
import './NutritionSummaryCard.css';

const MACRO_LABELS = {
    protein_g: 'Protein',
    carbs_g: 'Carbs',
    fat_g: 'Fat',
    fiber_g: 'Fiber',
};

const GRAM_FIELDS = MACRO_FIELDS.filter(field => field !== 'calories');

function formatCalories(value) {
    return Math.round(value).toLocaleString();
}

function formatGrams(value) {
    return `${Math.round(value * 10) / 10}g`;
}

export default function NutritionSummaryCard({ title, subtitle, meals, averageOverDays }) {
    const totals = sumNutrition(meals);
    const mealCount = meals.length;

    return (
        <article className="summary-card">
            <header className="summary-card-header">
                <h2>{title}</h2>
                {subtitle && <p className="text-muted summary-card-subtitle">{subtitle}</p>}
            </header>

            <p className="summary-card-calories">
                <span className="summary-card-calories-value">{formatCalories(totals.calories)}</span>
                <span className="text-muted summary-card-calories-unit">calories</span>
            </p>

            <dl className="summary-card-macros">
                {GRAM_FIELDS.map(field => (
                    <div key={field}>
                        <dt className="text-muted">{MACRO_LABELS[field]}</dt>
                        <dd>{formatGrams(totals[field])}</dd>
                    </div>
                ))}
            </dl>

            <footer className="summary-card-footer text-muted">
                {mealCount === 0 ? 'No meals logged' : `${mealCount} meal${mealCount === 1 ? '' : 's'}`}
                {mealCount > 0 && averageOverDays > 0 &&
                    ` · ${formatCalories(totals.calories / averageOverDays)} cal/day avg`}
            </footer>
        </article>
    );
}
