import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    const location = useLocation();

    // If a user clicks a restricted link, send them to login but remember where they meant to go
    return user ? children : <Navigate to="/login" state={{ from: location }} replace />;
};

export default ProtectedRoute;