import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh', color: 'var(--ink-soft)' }}>
        Loading authentication status...
      </div>
    );
  }

  // Not logged in -> Redirect to Admin Login if admin route, else /login
  if (!user) {
    if (requiredRole === 'ADMIN') {
      return <Navigate to="/admin/login" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  // Logged in, but does not match required role (e.g. Customer trying to access Admin)
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
