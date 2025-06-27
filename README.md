# E-commerce Analytics Dashboard (Indian Market)

![Dashboard Preview]![image](https://github.com/user-attachments/assets/840527e4-3f79-4897-971b-7d6f8d2131c1)


A modern, responsive e-commerce analytics dashboard built with React, specifically tailored for the Indian market with localized data and features.

## Features

- **Real-time Analytics**: Track sales, inventory, and customer metrics
- **Indian Market Focus**: Localized data with Indian customer names, addresses, and products
- **Interactive Charts**: Built with Chart.js for data visualization
- **Multi-page Navigation**: Separate sections for Dashboard, Orders, Products, and Customers
- **Responsive Design**: Works on all device sizes
- **Professional UI**: Clean, modern interface with intuitive navigation

## Technologies Used

- React 18
- React Router 6
- Chart.js
- React Icons
- Bootstrap 5 (for responsive utilities)
- CSS3 (custom styles)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/ecommerce-dashboard.git
2. Navigate to the project directory:
   ```bash
    cd ecommerce-dashboard
   ```
3.Install dependencies:
```bash
npm install
```

4. Start the development server:
```bash
npm start
Open http://localhost:3000 in your browser
```

Project Structure
```bash
ecommerce-dashboard/
├── public/              # Static files
├── src/
│   ├── components/      # Reusable components
│   │   ├── Header.jsx
│   │   ├── Sidebar.jsx
│   │   ├── SalesChart.jsx
│   │   └── ... 
│   ├── pages/           # Page components
│   │   ├── Dashboard.jsx
│   │   ├── Orders.jsx
│   │   ├── Products.jsx
│   │   └── Customers.jsx
│   ├── utils/           # Utility functions
│   ├── styles/          # CSS files
│   ├── App.js           # Main app component
│   └── index.js         # Entry point
├── package.json
└── README.md
```
Data Customization
To modify the Indian-specific data:
```text
Customer data: Edit src/pages/Customers.jsx

Product data: Edit src/pages/Products.jsx

Sales data: Edit src/utils/mockData.js
```
Screenshots
Dashboard	C:\Users\saath\OneDrive\Pictures\Screenshots\Screenshot 2025-06-25 095307.png

Available Scripts
```text
npm start: Runs the app in development mode

npm test: Launches the test runner

npm run build: Builds the app for production

npm run eject: Ejects from Create React App (advanced)
```
Future Enhancements
```text
Add authentication

Connect to real backend API

Implement dark mode

Add regional sales analysis (by Indian states)
```
Include GST calculation features

Contributing
Contributions are welcome! Please open an issue or submit a pull request.

License
This project is licensed under the MIT License - see the LICENSE file for details.

   
