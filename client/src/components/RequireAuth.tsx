
import { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Loading from './Loading';
import { getMe } from '../api/auth';

export default function RequireAuth() {
    const [status, setStatus] = useState<'checking' | 'authed' | 'anon'>('checking'); // 'checking' | 'authed' | 'anon'
    const [wakingUpServer, setWakingUpServer] = useState(false);

    useEffect(() => {

        const timer = setTimeout(() => {
            setWakingUpServer(true);
        }, 3000);

        getMe()
            .then(() => setStatus('authed'))
            .catch(() => setStatus('anon'))
            .finally(() => {
                clearTimeout(timer);
                setWakingUpServer(false);
            });

        return () => clearTimeout(timer);
    }, []);




    if (status === 'checking' || wakingUpServer) return <Loading loadingText={wakingUpServer && "Starting server. Please wait a few seconds."} />;
    if (status === 'anon') return <Navigate to="/login" replace />;
    return <Outlet />;
}