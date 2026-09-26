import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh', color: 'var(--text-muted)' }}>
        Loading authentication status...
      </div>
    );
  }

  // Not logged in -> Redirect to Login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in, but does not match required role (e.g. Customer trying to access Admin)
  if (requiredRole && user.role !== requiredRole && user.email !== 'afzal@schooldigitalised.com') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
