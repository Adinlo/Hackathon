import React from 'react';
import { Container, Grid, Card, CardContent, Typography } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { useEffect, useState } from 'react';
import 'chart.js/auto';
import RingLoader from "react-spinners/RingLoader";
import MetricsService from '../services/metricsService';
import { useParams, useNavigate } from 'react-router-dom';
import Papa from 'papaparse';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const [csvData, setCsvData] = useState([]);

  useEffect(() => {
    const metricsService = new MetricsService();

    const fetchData = async () => {
      try {
        const response = await metricsService.getMetric(id);
        setData(response);
      } catch (error) {
        console.error("Error fetching data:", error);
        navigate('/')
      }
    };

    fetchData();
  }, [navigate, id]);

  useEffect(() => {
    const fetchCsv = async () => {
      try {
        const response = await fetch(`http://localhost:8000/csv/clients_bdd.csv`);
        const reader = response.body.getReader();
        const result = await reader.read(); // raw array buffer
        const decoder = new TextDecoder('utf-8');
        const csvText = decoder.decode(result.value); // decoded text

        // Parse the CSV text using PapaParse
        Papa.parse(csvText, {
          header: true,
          complete: (results) => {
            setCsvData(results.data);
          },
          error: (error) => {
            console.error('Error parsing CSV:', error);
          }
        });
      } catch (error) {
        console.error('Error fetching CSV:', error);
      }
    };

    fetchCsv();
  }, []);
  console.log(csvData[1]);
  if (!data) {
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

  const chartData = {
    labels: Array.from({ length: data.number_of_generations }, (_, i) => `Gen ${i + 1}`),
    datasets: [
      {
        label: 'Fitness',
        data: data.fitness,
        fill: false,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <Container className="mt-10">
      <Typography variant="h4" className="text-center text-white mb-10">
        Genetically Optimized Deep Learning Network Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card className="bg-blue-50">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Accuracy
              </Typography>
              <Typography variant="h4">{data.accuracy * 100}%</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card className="bg-green-50">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                RMSE
              </Typography>
              <Typography variant="h4">{data.rmse}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card className="bg-yellow-50">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Loss
              </Typography>
              <Typography variant="h4">{data.loss}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card className="bg-white">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Fitness Over Generations
              </Typography>
              <Line data={chartData} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card className="bg-purple-50  mb-8">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Fitness
              </Typography>
              <Typography variant="h4">{data.fitness}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card className="bg-red-50 mb-8">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Best Generation
              </Typography>
              <Typography variant="h4">{data.bestGeneration}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
