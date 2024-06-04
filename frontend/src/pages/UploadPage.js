// src/pages/UploadPage.js
import React, { useState } from 'react';
import axios from 'axios';

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:8000/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setMessage(response.data.info);
    } catch (error) {
      console.error('Error uploading file:', error);
      setMessage('Error uploading file');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold text-center">Upload CSV</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium">Upload File</label>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
          >
            Upload
          </button>
        </form>
        {message && <p className="mt-4 text-center">{message}</p>}
      </div>
    </div>
  );
};

export default UploadPage;
