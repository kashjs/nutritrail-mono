import { useState, useId } from 'react'
import { useNavigate } from 'react-router-dom'
import './Login.css';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const uid = useId();

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);

        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            setError('Login failed');
            return;
        }

        const data = await response.json();
        localStorage.setItem('token', data.token);
        navigate('/');
    }

    return (
        <div className="login-page">
            <form className="login-card" onSubmit={handleSubmit}>
                <h1>Login</h1>
                <label htmlFor={`${uid}-email`}>Email</label>
                <input
                    id={`${uid}-email`}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email" />

                <label htmlFor={`${uid}-password`}>Password</label>
                <input
                    id={`${uid}-password`}
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                />
                <button type="submit" className="button-primary">Login</button>
                {error && <p>{error}</p>}
            </form>
        </div>
    );

}