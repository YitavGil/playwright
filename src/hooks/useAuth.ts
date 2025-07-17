import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
      // If on login page and authenticated, redirect to manager
      if (window.location.pathname === '/login') {
        navigate('/manager', { replace: true });
      }
    }
    setIsLoading(false);
  }, [navigate]);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (username === '12345' && password === '12345') {
      // Mock token generation
      const mockToken = btoa(`${username}:${Date.now()}`);
      localStorage.setItem('authToken', mockToken);
      setIsAuthenticated(true);
      navigate('/manager', { replace: true });
      setIsLoading(false);
      return true;
    } else {
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    navigate('/login', { replace: true });
  };

  return {
    isAuthenticated,
    isLoading,
    login,
    logout
  };
};
