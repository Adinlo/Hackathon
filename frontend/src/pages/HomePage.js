// src/pages/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FaTachometerAlt, FaUpload } from 'react-icons/fa';

const HomePage = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h2 className="text-2xl font-bold">Menu</h2>
          <ul className="mt-6 space-y-2">
            <li>
              <Link to="/" className="flex items-center p-2 text-gray-700 rounded hover:bg-gray-200">
                <FaTachometerAlt className="mr-2" /> Dashboard
              </Link>
            </li>
            <li>
              <Link to="/upload" className="flex items-center p-2 text-gray-700 rounded hover:bg-gray-200">
                <FaUpload className="mr-2" /> Upload
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold">Welcome to the Dashboard</h1>
        {/* Add more dashboard content here */}
      </div>
    </div>
  );
};

export default HomePage;

