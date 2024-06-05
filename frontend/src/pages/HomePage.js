import React, { useEffect, useState } from 'react';
import MetricsService from '../services/metricsService';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const metricsService = new MetricsService();

    const fetchData = async () => {
      try {
        const response = await metricsService.getMetrics();
        setData(response);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-white border-b-2">Welcome to the Dashboard</h1>
        <div className="mt-4">
          {data.map((metric) => (
            <Link to={`/dashboard/${metric.id}`} key={metric.id} className="block mb-4">
              <div key={metric.id} className="p-4 mb-4 bg-white shadow-md rounded">
                <h2 className="text-xl font-bold">Metric ID: {metric.id}</h2>
                <p>Accuracy: {metric.accuracy}</p>
                <p>Metric: {metric.metric}</p>
                <p>Best Generation: {metric.bestGeneration}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
