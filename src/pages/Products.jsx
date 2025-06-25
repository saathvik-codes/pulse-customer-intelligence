import React from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { FaRupeeSign, FaBoxOpen } from 'react-icons/fa';

const Products = () => {
  const products = [
    { id: 'P1001', name: 'Handwoven Silk Saree', category: 'Apparel', price: 4599, stock: 28, rating: 4.8 },
    { id: 'P1002', name: 'Kashmiri Pashmina Shawl', category: 'Accessories', price: 3299, stock: 15, rating: 4.9 },
    { id: 'P1003', name: 'Handcrafted Brass Diya', category: 'Home Decor', price: 599, stock: 42, rating: 4.7 },
    { id: 'P1004', name: 'Organic Turmeric Powder', category: 'Groceries', price: 249, stock: 86, rating: 4.6 },
    { id: 'P1005', name: 'Blue Pottery Coffee Mug', category: 'Kitchenware', price: 799, stock: 23, rating: 4.5 },
  ];

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="card">
          <div className="page-header">
            <h2><FaBoxOpen className="header-icon" /> Product Inventory</h2>
            <div className="summary-cards">
              <div className="summary-card">
                <h3>Total Products</h3>
                <p>128</p>
              </div>
              <div className="summary-card">
                <h3>Low Stock</h3>
                <p className="warning">12</p>
              </div>
              <div className="summary-card">
                <h3>Top Rated</h3>
                <p>Kashmiri Pashmina Shawl</p>
              </div>
            </div>
          </div>
          
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product ID</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Rating</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td className="product-name">{product.name}</td>
                    <td>{product.category}</td>
                    <td className="price"><FaRupeeSign /> {product.price.toLocaleString('en-IN')}</td>
                    <td>
                      <div className="stock-indicator">
                        <div 
                          className={`stock-bar ${product.stock < 30 ? 'low' : 'healthy'}`}
                          style={{ width: `${Math.min(100, (product.stock / 100) * 100)}%` }}
                        ></div>
                        <span>{product.stock}</span>
                      </div>
                    </td>
                    <td>
                      <div className="rating">
                        {product.rating} 
                        <div className="stars">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={i < Math.floor(product.rating) ? 'filled' : ''}>★</span>
                          ))}
                        </div>
                      </div>
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

export default Products;