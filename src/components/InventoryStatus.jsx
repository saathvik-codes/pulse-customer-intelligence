import React from 'react';

const InventoryStatus = ({ inventory }) => {
  return (
    <div className="metric-card">
      <h3>Inventory Status</h3>
      <div className="inventory-grid">
        {inventory.map((item, index) => (
          <div key={index} className="inventory-item">
            <span className="category">{item.category}</span>
            <div className="progress-container">
              <div 
                className="progress-bar" 
                style={{ width: `${(item.stock / item.total) * 100}%` }}
              ></div>
            </div>
            <span className="stock">{item.stock} / {item.total}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InventoryStatus;