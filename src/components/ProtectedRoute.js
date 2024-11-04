import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../lib/context/user';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useUser();

    if (!isAuthenticated) {
        // If not authenticated, redirect to login page
        return <Navigate to="/login" replace />;
    }

    // If authenticated, return the requested component
    return children;
};

export default ProtectedRoute;
