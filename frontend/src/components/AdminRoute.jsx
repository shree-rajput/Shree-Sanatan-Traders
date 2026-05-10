import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  // 🔒 Must be logged in
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 🔒 Must be an admin
  if (user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
