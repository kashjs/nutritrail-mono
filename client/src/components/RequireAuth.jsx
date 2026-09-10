
import { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export default function RequireAuth() {
    const [status, setStatus] = useState('checking'); // 'checking' | 'authed' | 'anon'

    useEffect(() => {
        fetch('http://localhost:3000/me', { credentials: 'include' })
            .then(res => setStatus(res.ok ? 'authed' : 'anon'))
            .catch(() => setStatus('anon'));
    }, []);

    if (status === 'checking') return <p>Loading...</p>;
    if (status === 'anon') return <Navigate to="/login" replace />;
    return <Outlet />;
}