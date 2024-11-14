import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register necessary chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const QuantityChart = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error('Error fetching products:', error));
  }, []);

  const chartData = {
    labels: products.map(product => product.name), // Product names as labels on the x-axis
    datasets: [
      {
        label: 'Product Quantities',
        data: products.map(product => product.quantity), // Product quantities as data for the bar chart
        backgroundColor: 'rgba(75, 192, 192, 0.6)', // Color of the bars
        barThickness: 40, // Set the thickness of the bars
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Product Quantity Chart',
      },
    },
    scales: {
      x: {
        grid: {
          display: false, // Hide grid lines on the x-axis for a cleaner look
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(200, 200, 200, 0.5)', // Lighter grid lines for better visibility
        },
      },
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Product Quantity Chart</h2>
      <Bar data={chartData} options={options} />
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
  },
  title: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#3498db',
  },
};

export default QuantityChart;