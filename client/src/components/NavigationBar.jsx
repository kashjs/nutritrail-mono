import { Link } from 'react-router-dom';

export default function NavigationBar() {
    return (
        <nav>
            <Link to="/add-meal">Add Meal</Link>
            <Link to="/">All Meals</Link> 
        </nav>
    );
}