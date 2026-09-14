
import { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Loading from './Loading';

export default function RequireAuth() {
    const [status, setStatus] = useState('checking'); // 'checking' | 'authed' | 'anon'

    useEffect(() => {
        fetch('/api/me', { credentials: 'include' })
            .then(res => setStatus(res.ok ? 'authed' : 'anon'))
            .catch(() => setStatus('anon'));
    }, []);

    if (status === 'checking') return <Loading />;
    if (status === 'anon') return <Navigate to="/login" replace />;
    return <Outlet />;
}