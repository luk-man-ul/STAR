import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole = 'customer',
  redirectTo = '/login'
}) => {
  const { isAuthenticated, userRole } = useAuth();
  const location = useLocation();

  // If not authenticated and requires authentication, redirect to login
  if (!isAuthenticated && requiredRole !== 'public') {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check role-based access
  const hasRequiredRole = () => {
    switch (requiredRole) {
      case 'public':
        return true;
      case 'customer':
        return isAuthenticated && (userRole === 'customer' || userRole === 'admin');
      case 'admin':
        return isAuthenticated && userRole === 'admin';
      default:
        return false;
    }
  };

  if (!hasRequiredRole()) {
    // If authenticated but doesn't have required role, redirect to home
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;