import React, { useMemo, useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthService from '../services/authService';

const GuardedRoute = () => {
  const authService = useMemo(() => new AuthService(), []);
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const isLoggedIn = await authService.verifyLogin();
      setIsAuthenticated(isLoggedIn);
    };
    checkLoginStatus();
  }, [authService]);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default GuardedRoute;
