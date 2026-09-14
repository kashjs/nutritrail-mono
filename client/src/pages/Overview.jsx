import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MealCard from '../components/MealCard';
import NutritionSummaryCard from '../components/NutritionSummaryCard';
import { getLocalDateString, addDays } from '../utils/DateTime';
import Loading from '../components/Loading';
import './Overview.css';

const WEEK_LENGTH_DAYS = 7;

const dayFormatter = new Intl.DateTimeFormat(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
const shortDayFormatter = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' });

function localDateOf(meal) {
    return getLocalDateString(new Date(meal.consumed_at));
}

export default function Overview() {
    const [meals, setMeals] = useState(null);
    const [error, setError] = useState(null);
    const [loadingMeals, setLoadingMeals] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setLoadingMeals(true);

        // Pad the server-side range by a day on each end: `consumed_at` is a
        // timestamp *without* a time zone, so the server's notion of a day
        // boundary may not match the browser's. The exact bucketing below is
        // done in the browser's local time.
        const from = getLocalDateString(addDays(new Date(), -WEEK_LENGTH_DAYS));
        const to = getLocalDateString(addDays(new Date(), 1));

        fetch(`/api/meals?from=${from}&to=${to}`, {
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

    const now = new Date();
    const yesterdayDate = addDays(now, -1);
    const weekStartDate = addDays(now, -(WEEK_LENGTH_DAYS - 1));

    const today = getLocalDateString(now);
    const yesterday = getLocalDateString(yesterdayDate);
    const weekStart = getLocalDateString(weekStartDate);

    const loadedMeals = Array.isArray(meals) ? meals : [];
    const todayMeals = loadedMeals.filter(meal => localDateOf(meal) === today);
    const yesterdayMeals = loadedMeals.filter(meal => localDateOf(meal) === yesterday);
    const weekMeals = loadedMeals.filter(meal => {
        const date = localDateOf(meal);
        return date >= weekStart && date <= today;
    });

    return (
        <div className="overview-page">
            <div className="heading-bar">
                <h1>Overview</h1>
                <button className="button-primary" onClick={() => navigate('/add-meal')}>
                    Add Meal
                </button>
            </div>

            {loadingMeals && <Loading />}
            {error && <p className="text-danger">Error loading meals</p>}

            {meals &&
                <>
                    <ul className="list-unstyled summary-cards">
                        <li>
                            <NutritionSummaryCard
                                title="Today"
                                subtitle={dayFormatter.format(now)}
                                meals={todayMeals}
                            />
                        </li>
                        <li>
                            <NutritionSummaryCard
                                title="Yesterday"
                                subtitle={dayFormatter.format(yesterdayDate)}
                                meals={yesterdayMeals}
                            />
                        </li>
                        <li>
                            <NutritionSummaryCard
                                title="Last 7 days"
                                subtitle={`${shortDayFormatter.format(weekStartDate)} – ${shortDayFormatter.format(now)}`}
                                meals={weekMeals}
                                averageOverDays={WEEK_LENGTH_DAYS}
                            />
                        </li>
                    </ul>

                    <section className="todays-meals">
                        <div className="heading-bar">
                            <h2>Today's meals</h2>
                        </div>
                        {todayMeals.length === 0
                            ? <p className="text-muted">Nothing logged today yet.</p>
                            : <ul className="list-unstyled meals-list">
                                {todayMeals.map(meal => (
                                    <li key={meal.id}>
                                        <MealCard meal={meal} onSave={onMealChange} onDeleteMeal={onDeleteMeal} />
                                    </li>
                                ))}
                            </ul>
                        }
                    </section>
                </>
            }
        </div>
    );
}
