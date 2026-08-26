import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import AllMeals from './pages/AllMeals';
import AddMeal from './pages/AddMeal';
import NavigationBar from './components/NavigationBar'

export default function App() {
    return (
        <BrowserRouter>
            <NavigationBar></NavigationBar>
            <main>
                <Routes>
                    <Route path="/login" element={<Login />}></Route>
                    <Route path="/add-meal" element={<AddMeal />}></Route>
                    <Route path="/" element={<AllMeals />}></Route>
                </Routes>
            </main>
        </BrowserRouter>
    )
}