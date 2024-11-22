// src/components/PrivateRoute.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ children, role }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    // User is not authenticated
    return <Navigate to="/login" />;
  }

  if (role && user.user_role !== role) {
    // User does not have the required role
    return <Navigate to="/" />;
  }

  // User is authenticated and has the required role
  return children;
};

export default PrivateRoute;
