import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../db/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem('career_vault_user');
        const token = localStorage.getItem('career_vault_token');
        if (savedUser && token) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const res = await authApi.login({ email, password });
            const { user: foundUser, token } = res.data;
            setUser(foundUser);
            localStorage.setItem('career_vault_user', JSON.stringify(foundUser));
            localStorage.setItem('career_vault_token', token);
            return { success: true, user: foundUser };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Invalid credentials' };
        }
    };

    const register = async (userData) => {
        try {
            const res = await authApi.register(userData);
            const { user: newUser, token } = res.data;
            setUser(newUser);
            localStorage.setItem('career_vault_user', JSON.stringify(newUser));
            localStorage.setItem('career_vault_token', token);
            return { success: true, user: newUser };
        } catch (error) {
            console.error('Registration error:', error);
            return { success: false, message: error.response?.data?.message || 'Registration failed' };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('career_vault_user');
        localStorage.removeItem('career_vault_token');
    };

    return (
        <AuthContext.Provider value={{ user, setUser, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

