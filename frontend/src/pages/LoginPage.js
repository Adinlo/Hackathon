// src/pages/LoginPage.js
import React from 'react';

const LoginPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold text-center">Login</h2>
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input type="email" className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500"/>
          </div>
          <div>
            <label className="block text-sm font-medium">Password</label>
            <input type="password" className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500"/>
          </div>
          <button type="submit" className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600">Login</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

