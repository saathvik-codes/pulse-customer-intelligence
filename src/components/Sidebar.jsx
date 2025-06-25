import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <nav>
        <ul>
          <li>
            <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>
              <i className="fas fa-tachometer-alt"></i>
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/orders">
              <i className="fas fa-shopping-cart"></i>
              <span>Orders</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/products">
              <i className="fas fa-box-open"></i>
              <span>Products</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/customers">
              <i className="fas fa-users"></i>
              <span>Customers</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;