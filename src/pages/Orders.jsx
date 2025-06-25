import React from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const Orders = () => {
  const orders = [
    { id: 1001, customer: 'Rajesh Sharma', date: '2023-05-15', amount: 12599, status: 'Shipped' },
    { id: 1002, customer: 'Priya Patel', date: '2023-05-16', amount: 8950, status: 'Processing' },
    { id: 1003, customer: 'Amit Singh', date: '2023-05-17', amount: 24575, status: 'Delivered' },
    { id: 1004, customer: 'Neha Gupta', date: '2023-05-18', amount: 18750, status: 'Shipped' },
    { id: 1005, customer: 'Vikram Joshi', date: '2023-05-19', amount: 32500, status: 'Processing' },
    { id: 1006, customer: 'Ananya Reddy', date: '2023-05-20', amount: 14230, status: 'Delivered' },
    { id: 1007, customer: 'Sanjay Kumar', date: '2023-05-21', amount: 21000, status: 'Shipped' },
    { id: 1008, customer: 'Deepika Iyer', date: '2023-05-22', amount: 17500, status: 'Processing' },
  ];

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="card">
          <h2>Orders Management</h2>
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Amount (₹)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{order.customer}</td>
                  <td>{order.date}</td>
                  <td>₹{(order.amount).toLocaleString('en-IN')}</td>
                  <td>
                    <span className={`status-badge ${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Orders;