import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
    permission?: 'inbound' | 'outbound' | 'reports' | 'users';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, permission }) => {
    const { user } = useAuth();
    const location = useLocation();

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (permission && user.role !== 'admin' && !user.permissions[permission]) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
