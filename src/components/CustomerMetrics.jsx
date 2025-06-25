import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const CustomerMetrics = ({ customerData }) => {
  const data = {
    labels: ['New Customers', 'Returning Customers', 'Inactive Customers'],
    datasets: [
      {
        data: [
          customerData.newCustomers,
          customerData.returningCustomers,
          customerData.inactiveCustomers
        ],
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 99, 132, 0.6)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="metric-card">
      <h3>Customer Distribution</h3>
      <Doughnut data={data} />
    </div>
  );
};

export default CustomerMetrics;