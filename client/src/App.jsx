import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Today from './pages/Today';
import AddMeal from './pages/AddMeal';

export default function App() {
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />}></Route>
                <Route path="/add-meal" element={<AddMeal />}></Route>
                <Route path="/" element={<Today />}></Route>
            </Routes>
        </BrowserRouter>
    )
}