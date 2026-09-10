import { Link, useNavigate, useLocation } from 'react-router-dom';
import './NavigationBar.css';

export default function NavigationBar() {
    const navigate = useNavigate();
    const location = useLocation();
    const isLoginPage = location.pathname === '/login';

    const handleLogout = async () => {
        await fetch('http://localhost:3000/logout', {
            method: 'POST',
            credentials: 'include'
        });
        navigate('/login');
    }

    return (
        <nav className="main-navigation-bar">
            {!isLoginPage &&
                <>
                    <Link to="/add-meal">Add Meal</Link>
                    <Link to="/">All Meals</Link>
                    <button type="button" className="button-secondary" onClick={handleLogout}>Log out</button>
                </>
            }
        </nav>
    );
}
