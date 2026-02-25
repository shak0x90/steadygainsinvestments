import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export default function AdminRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-cream">
                <div className="animate-spin w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full" />
            </div>
        );
    }

    if (!user) return <Navigate to="/signin" replace />;
    if (user.role !== 'ADMIN') return <Navigate to="/dashboard" replace />;

    return children;
}
