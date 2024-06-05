// src/pages/LoginPage.js
import React, { useState } from 'react';
import Alert from '@mui/material/Alert';
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import { FaUserPlus } from 'react-icons/fa';
import AuthService from '../services/authService'

const LoginPage = () => {
  const navigate = useNavigate();
  const authService = new AuthService();
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const successLogin = () => {
    setMessage("Logged in!");
    setSeverity("success");
    setTimeout(() => navigate("/"), 1500)
  }

  const failLogin = (message) => {
    console.error(`Error uploading file: ${message}`);
    setMessage(message);
    setSeverity("error");
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await authService.login(email, password)

      successLogin();
    } catch (error) {
      failLogin(error.response.data.message)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold text-center">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input type="email" className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500" value={email} onChange={(e) => setEmail(e.target.value)}/>
          </div>
          <div className="content-center">
            <label className="block text-sm font-medium">Password</label>
            <input type="password" className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500"  value={password} onChange={(e) => setPassword(e.target.value)}/>
          </div>
          <button type="submit" className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600">Login</button>
          <div className="flex items-center justify-center pt-5">
          <Link to="/signup" className="flex items-center p-2 text-gray-700 rounded hover:bg-gray-200">
                <FaUserPlus className="mr-2" /> Don't have an account ?
              </Link>
          </div>
        </form>
        {message && <Alert severity={severity}>{message}</Alert>}
      </div>
    </div>
  );
};

export default LoginPage;

