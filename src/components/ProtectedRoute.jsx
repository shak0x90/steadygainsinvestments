import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export default function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-cream">
                <div className="animate-spin w-8 h-8 border-3 border-emerald-brand border-t-transparent rounded-full" />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/signin" replace />;
    }

    return children;
}
