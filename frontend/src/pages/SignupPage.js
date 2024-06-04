// src/pages/SignupPage.js
import React, { useState } from 'react';
import Alert from '@mui/material/Alert';
import { useNavigate } from "react-router-dom";
import AuthService from '../services/authService'
import { Link } from 'react-router-dom';
import { FaSignInAlt } from 'react-icons/fa';

const SignupPage = () => {
  const navigate = useNavigate();
  const authService = new AuthService();
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const successRegister = () => {
    setMessage("Logged in!");
    setSeverity("success");
    setTimeout(() => navigate("/"), 1500)
  }

  const failRegister = (message) => {
    console.error(`Error uploading file: ${message}`);
    setMessage(message);
    setSeverity("error");
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
    } else {
      // Handle signup logic
      try {
        await authService.register(name, lastName, email, password)

        successRegister();
      } catch(err) {
        failRegister(err.response.data.message)
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold text-center">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Last Name</label>
            <input
              className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Confirm Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <button type="submit" className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600">
            Sign Up
          </button>
          <div className="flex items-center justify-center pt-5">
          <Link to="/login" className="flex items-center p-2 text-gray-700 rounded hover:bg-gray-200">
                <FaSignInAlt className="mr-2" /> Login
              </Link>
          </div>
        </form>
        {message && <Alert severity={severity}>{message}</Alert>}
      </div>
    </div>
  );
};

export default SignupPage;
