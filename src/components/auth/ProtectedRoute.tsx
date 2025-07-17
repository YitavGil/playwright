import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = () => {
    const token = localStorage.getItem('authToken');
    if (!token) return false;
    
    return true;
  };

  return isAuthenticated() ? <>{children}</> : <Navigate to="/login" replace />;
};