// src/pages/UploadPage.js
import React, { useState } from 'react';
import Alert from '@mui/material/Alert';
import axios from 'axios';
import { parse } from 'csv-parse/browser/esm';
import { FaTachometerAlt, FaUpload, FaHome } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [severity, setSeverity] = useState('');
  const [task, setTask] = useState('regression');
  const [message, setMessage] = useState('');
  const [csvData, setCsvData] = useState([]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        parse(text, {
          columns: true,
          skip_empty_lines: true
        }, (err, records) => {
          if (err) {
            console.error('Error parsing CSV:', err);
          } else {
            setCsvData(records);
          }
        });
      };
      reader.readAsText(file);
    }
  };

  const handleTaskChange = (event) => {
    setTask(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('task', task);

    try {
      const response = await axios.post('http://localhost:8000/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setMessage(response.data.info);
      setSeverity("success");
  } catch (error) {
      console.error('Error uploading file:', error);
      setMessage('Error uploading file');
      setSeverity("error");
  }
  };

  return (
      <div className="flex flex-col items-center justify-center p-2 mt-[10%]">
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
            <div>
              <label className="block text-sm font-medium">Select Task</label>
              <select
                value={task}
                onChange={handleTaskChange}
                className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="regression">Regression</option>
                <option value="classification">Classification</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
            >
              Upload
            </button>
          </form>
          {message && <Alert severity={severity}>{message}</Alert>}
        </div>
        {csvData.length > 0 && (
          <div className="w-full max-w-4xl bg-white shadow-md rounded-lg overflow-hidden">
            <h3 className="text-xl font-bold p-4 bg-gray-200">CSV Data</h3>
            <div className="overflow-auto max-h-96">
              <table className="min-w-full bg-white border">
                <thead className="bg-gray-50">
                  <tr>
                    {Object.keys(csvData[0]).map((key) => (
                      <th key={key} className="px-4 py-2 border text-left text-sm font-medium text-gray-500">
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {csvData.map((row, index) => (
                    <tr key={index}>
                      {Object.values(row).map((value, i) => (
                        <td key={i} className="px-4 py-2 border text-sm text-gray-700">
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
    </div>
  );
};

export default UploadPage;
