
import React from 'react';
import { Container, Grid, Card, CardContent, Typography } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { useEffect, useState } from 'react';
import axios from 'axios';
import 'chart.js/auto';



const Dashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/metrics');
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  if (!data) {
    return <div>Loading...</div>;
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
      <Typography variant="h4" className="text-center mb-10">
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
                Metric
              </Typography>
              <Typography variant="h4">{data.metric}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card className="bg-yellow-50">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Correct Predictions
              </Typography>
              <Typography variant="h4">{data.number_of_correct_predictions}</Typography>
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
          <Card className="bg-purple-50">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Number of Generations
              </Typography>
              <Typography variant="h4">{data.number_of_generations}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card className="bg-red-50">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Best Generation
              </Typography>
              <Typography variant="h4">{data.best_generation}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
