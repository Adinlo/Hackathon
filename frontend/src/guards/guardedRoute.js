import React, { useMemo, useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthService from '../services/authService';
import RingLoader from "react-spinners/RingLoader";

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
    return <div className='flex items-center justify-center mt-[100px] flex-col'>
      <div className='text-2xl font-bold text-center p-[40px] text-white'>Loading</div>
    <RingLoader
        loading={true}
        color="#ffffff"
        size={300}
        cssOverride={{}}
        speedMultiplier={1}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default GuardedRoute;
