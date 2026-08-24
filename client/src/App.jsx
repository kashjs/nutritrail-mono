import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Today from './pages/Today';

export default function App() {
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />}></Route>
                <Route path="/" element={<Today />}></Route>
            </Routes>
        </BrowserRouter>
    )
}