import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import AllMeals from './pages/AllMeals';
import AddMeal from './pages/AddMeal';
import NavigationBar from './components/NavigationBar'
import './App.css';
import RequireAuth from './components/RequireAuth'

export default function App() {
    return (
        <BrowserRouter>
            <div className="navigation-content">
                <NavigationBar></NavigationBar>
            </div>
            <main className="main-content">
                <Routes>
                    <Route path="/login" element={<Login />}></Route>
                    <Route element={<RequireAuth />}>
                        <Route path="/add-meal" element={<AddMeal />}></Route>
                        <Route path="/" element={<AllMeals />}></Route>
                    </Route>
                    <Route path="*" element={<p>Page not found</p>}></Route>
                </Routes>

            </main>
        </BrowserRouter>
    )
}