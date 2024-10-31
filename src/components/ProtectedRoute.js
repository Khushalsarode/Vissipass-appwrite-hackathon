// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../lib/context/user';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useUser();

    return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
