import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types';

interface AuthContextType {
    user: User | null;
    login: (username: string, password: string) => boolean;
    logout: () => void;
    users: User[];
    addUser: (user: Omit<User, 'id'>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(() => {
        const saved = localStorage.getItem('alyosr_current_user');
        return saved ? JSON.parse(saved) : null;
    });

    const [users, setUsers] = useState<User[]>(() => {
        const saved = localStorage.getItem('alyosr_users');
        if (saved) return JSON.parse(saved);

        // Default admin
        const defaultAdmin: User = {
            id: 'admin-id',
            username: 'admin',
            password: '123',
            role: 'admin',
            permissions: { inbound: true, outbound: true, reports: true, users: true }
        };
        localStorage.setItem('alyosr_users', JSON.stringify([defaultAdmin]));
        return [defaultAdmin];
    });

    useEffect(() => {
        localStorage.setItem('alyosr_users', JSON.stringify(users));
    }, [users]);

    const login = (username: string, password: string) => {
        const foundUser = users.find(u => u.username === username && u.password === password);
        if (foundUser) {
            setUser(foundUser);
            localStorage.setItem('alyosr_current_user', JSON.stringify(foundUser));
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('alyosr_current_user');
    };

    const addUser = (newUser: Omit<User, 'id'>) => {
        setUsers([...users, { ...newUser, id: crypto.randomUUID() }]);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, users, addUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};
