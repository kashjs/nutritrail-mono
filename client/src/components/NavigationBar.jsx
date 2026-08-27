import { Link, useNavigate, useLocation } from 'react-router-dom';
import './NavigationBar.css';

export default function NavigationBar() {
    const navigate = useNavigate();
    const location = useLocation();
    const isLoginPage = location.pathname === '/login';

    function logout() {
        localStorage.removeItem('token');
        navigate('/login');
    }

    return (
        <nav className="main-navigation-bar">
            {!isLoginPage &&
                <>
                    <Link to="/add-meal">Add Meal</Link>
                    <Link to="/">All Meals</Link>
                    <button type="button" className="button-secondary" onClick={logout}>Log out</button>
                </>
            }
        </nav>
    );
}
