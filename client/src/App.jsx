import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import AllMeals from './pages/AllMeals';
import AddMeal from './pages/AddMeal';
import NavigationBar from './components/NavigationBar'
import './App.css';

export default function App() {
    return (
        <BrowserRouter>
            <div className="navigation-content">
                <NavigationBar></NavigationBar>
            </div>
            <main className="main-content">
                <Routes>
                    <Route path="/login" element={<Login />}></Route>
                    <Route path="/add-meal" element={<AddMeal />}></Route>
                    <Route path="/" element={<AllMeals />}></Route>
                </Routes>
            </main>
        </BrowserRouter>
    )
}