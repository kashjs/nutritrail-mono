
import { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Loading from './Loading';

export default function RequireAuth() {
    const [status, setStatus] = useState('checking'); // 'checking' | 'authed' | 'anon'
    const [wakingUpServer, setWakingUpServer] = useState(false);

    useEffect(() => {

        const timer = setTimeout(() => {
            setWakingUpServer(true);
        }, 3000);

        fetch('/api/me', { credentials: 'include' })
            .then(res => setStatus(res.ok ? 'authed' : 'anon'))
            .catch(() => setStatus('anon'))
            .finally(() => {
                clearTimeout(timer);
            });

        return () => clearTimeout(timer);
    }, []);




    if (status === 'checking' || wakingUpServer) return <Loading loadingText={wakingUpServer && "Starting server. Please wait a few seconds."} />;
    if (status === 'anon') return <Navigate to="/login" replace />;
    return <Outlet />;
}