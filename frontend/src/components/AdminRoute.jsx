import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  // if (!user) {
  //   return <Navigate to="/login" state={{ from: location }} replace/>;
  // }

  // if (user.role !== 'admin') {
  //   return <Navigate to="/" replace />; // Redirect simple users to Home instantly instead of 404
  // }

  return children;
};

export default AdminRoute;
