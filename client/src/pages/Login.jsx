import { useState, useId } from 'react'
import { useNavigate } from 'react-router-dom'
import './Login.css';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordRepeat, setPasswordRepeat] = useState('');
    const [isRegisterMode, setIsRegisterMode] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const uid = useId();

    function switchRegisterMode(mode) {
        setIsRegisterMode(mode);
        setError(null);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);

        const headers = { 'Content-Type': 'application/json' };
        const body = JSON.stringify({ email, password });
        const endpoint = isRegisterMode ? 'register' : 'login'

        if (isRegisterMode && password !== passwordRepeat) {
            setError('Passwords don\'t match');
            return;
        }

        let response = await fetch(`/api/${endpoint}`, {
            method: 'POST',
            credentials: 'include',
            headers,
            body
        });

        if (!response.ok) {
            setError(`${endpoint} failed`);
            return;
        }

        if (isRegisterMode) {
            response = await fetch(`/api/login`, {
                method: 'POST',
                credentials: 'include',
                headers,
                body
            });
            if (!response.ok) {
                setError(`login failed`);
                switchRegisterMode(false);
                return;
            }
        }



        const data = await response.json();
        navigate('/');
    }

    return (
        <div className="login-page">
            <div className="login-card">
                <form onSubmit={handleSubmit}>
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
                    {isRegisterMode && <>
                        <label htmlFor={`${uid}-password-repeat`}>Repeat password</label>
                        <input
                            id={`${uid}-password-repeat`}
                            type="password"
                            value={passwordRepeat}
                            onChange={(e) => setPasswordRepeat(e.target.value)}
                            placeholder="Repeat password"
                        />
                    </>}
                    <button type="submit" className="button-primary">{isRegisterMode ? "Register" : "Login"}</button>
                    {error && <p className="text-danger">{error}</p>}
                </form>
                {!isRegisterMode &&
                    <div>
                        <p className="text-muted">Don't have an account?</p>
                        <button type="button" className="button-secondary" onClick={() => { switchRegisterMode(true) }}>Register</button>
                    </div>
                }
                {isRegisterMode &&
                    <div>
                        <button type="button" className="button-secondary" onClick={() => { switchRegisterMode(false) }}>Back to login</button>
                    </div>
                }

            </div>
        </div>
    );

}