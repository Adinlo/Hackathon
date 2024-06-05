// src/pages/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FaTachometerAlt, FaUpload, FaHome  } from 'react-icons/fa';


const HomePage = () => {

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 p-6">
        {/* <h1 className="text-3xl font-bold text-white border-b-2">Welcome to the Dashboard {name} {lastName}</h1> */}
        <h1 className="text-3xl font-bold text-white border-b-2">Welcome to the Dashboard</h1>
        {/* Add more dashboard content here */}
      </div>
    </div>
  );
};

export default HomePage;

