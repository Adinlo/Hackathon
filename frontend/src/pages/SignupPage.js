// src/pages/SignupPage.js
import React, { useState } from 'react';

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
    } else {
      // Handle signup logic
      setError('');
      console.log({ email, password });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold text-center">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
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
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
