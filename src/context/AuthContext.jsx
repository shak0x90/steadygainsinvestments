import { createContext, useContext, useState, useEffect } from 'react';
import api from '@/utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('sg_token');
        if (token) {
            api.getMe()
                .then((userData) => {
                    setUser({
                        ...userData,
                        avatar: userData.name?.split(' ').map(n => n[0]).join('').toUpperCase(),
                    });
                })
                .catch(() => {
                    localStorage.removeItem('sg_token');
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (email, password) => {
        const { user: userData, token } = await api.signin(email, password);
        localStorage.setItem('sg_token', token);
        setUser({
            ...userData,
            avatar: userData.name?.split(' ').map(n => n[0]).join('').toUpperCase(),
        });
        return userData;
    };

    const signup = async (name, email, password) => {
        const { user: userData, token } = await api.signup(name, email, password);
        localStorage.setItem('sg_token', token);
        setUser({
            ...userData,
            avatar: userData.name?.split(' ').map(n => n[0]).join('').toUpperCase(),
        });
        return userData;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('sg_token');
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
}
