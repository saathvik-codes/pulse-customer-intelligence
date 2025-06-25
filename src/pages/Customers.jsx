import React from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { FaUser, FaMapMarkerAlt, FaPhone, FaRupeeSign } from 'react-icons/fa';

const Customers = () => {
  const customers = [
    { 
      id: 'C1001', 
      name: 'Aarav Sharma', 
      email: 'aarav.sharma@example.com', 
      phone: '+91 9876543210',
      address: '24, MG Road, Bangalore, Karnataka - 560001',
      orders: 12, 
      totalSpent: 45980,
      joined: '15/01/2022',
      status: 'Premium'
    },
    { 
      id: 'C1002', 
      name: 'Priya Patel', 
      email: 'priya.patel@example.com',
      phone: '+91 8765432109',
      address: '5th Cross, Jayanagar, Mumbai, Maharashtra - 400001',
      orders: 8, 
      totalSpent: 28750,
      joined: '22/03/2022',
      status: 'Regular'
    },
    { 
      id: 'C1003', 
      name: 'Rahul Singh', 
      email: 'rahul.singh@example.com',
      phone: '+91 7654321098',
      address: '12, Park Street, Kolkata, West Bengal - 700016',
      orders: 15, 
      totalSpent: 65320,
      joined: '05/11/2021',
      status: 'Premium'
    },
    { 
      id: 'C1004', 
      name: 'Ananya Gupta', 
      email: 'ananya.gupta@example.com',
      phone: '+91 6543210987',
      address: '7, Connaught Place, New Delhi - 110001',
      orders: 5, 
      totalSpent: 12990,
      joined: '18/06/2022',
      status: 'New'
    },
  ];

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="card">
          <div className="page-header">
            <h2><FaUser className="header-icon" /> Customer Database</h2>
            <div className="summary-cards">
              <div className="summary-card">
                <h3>Total Customers</h3>
                <p>342</p>
              </div>
              <div className="summary-card">
                <h3>Premium Members</h3>
                <p className="premium">127</p>
              </div>
              <div className="summary-card">
                <h3>New This Month</h3>
                <p>28</p>
              </div>
            </div>
          </div>
          
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Customer ID</th>
                  <th>Details</th>
                  <th>Contact</th>
                  <th>Orders</th>
                  <th>Total Spent</th>
                  <th>Member Since</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {customers.map(customer => (
                  <tr key={customer.id}>
                    <td>{customer.id}</td>
                    <td>
                      <div className="customer-info">
                        <div className="customer-name">{customer.name}</div>
                        <div className="customer-email">{customer.email}</div>
                      </div>
                    </td>
                    <td>
                      <div className="contact-info">
                        <div><FaPhone /> {customer.phone}</div>
                        <div><FaMapMarkerAlt /> {customer.address}</div>
                      </div>
                    </td>
                    <td>{customer.orders}</td>
                    <td className="price"><FaRupeeSign /> {customer.totalSpent.toLocaleString('en-IN')}</td>
                    <td>{customer.joined}</td>
                    <td>
                      <span className={`status-badge ${customer.status.toLowerCase()}`}>
                        {customer.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customers;