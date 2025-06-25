import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import SalesChart from '../components/SalesChart';
import CustomerMetrics from '../components/CustomerMetrics';
import InventoryStatus from '../components/InventoryStatus';
import RecentOrders from '../components/RecentOrders';
import { fetchDashboardData } from '../utils/api';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchDashboardData();
        setDashboardData(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="dashboard-grid">
          <div className="card sales-chart">
            <SalesChart salesData={dashboardData.sales} />
          </div>
          <div className="card customer-metrics">
            <CustomerMetrics customerData={dashboardData.customers} />
          </div>
          <div className="card inventory-status">
            <InventoryStatus inventory={dashboardData.inventory} />
          </div>
          <div className="card recent-orders">
            <RecentOrders orders={dashboardData.recentOrders} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;