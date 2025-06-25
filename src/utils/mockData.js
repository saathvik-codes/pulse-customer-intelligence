export const mockDashboardData = {
  sales: [
    { month: 'Jan', sales: 125000 },
    { month: 'Feb', sales: 189000 },
    { month: 'Mar', sales: 242000 }, // Increased for festival season
    { month: 'Apr', sales: 178000 },
    { month: 'May', sales: 210000 },
    { month: 'Jun', sales: 195000 },
    { month: 'Jul', sales: 223000 },
    { month: 'Aug', sales: 298000 }, // Independence Day sales
    { month: 'Sep', sales: 345000 }, // Ganesh Chaturthi sales
    { month: 'Oct', sales: 431000 }, // Diwali season
    { month: 'Nov', sales: 387000 }, // Post-Diwali sales
    { month: 'Dec', sales: 415000 }, // Christmas/New Year sales
  ],
  customers: {
    newCustomers: 842,
    returningCustomers: 1243,
    inactiveCustomers: 156,
  },
  inventory: [
    { category: 'Electronics', stock: 342, total: 500 }, // Increased for Indian market
    { category: 'Clothing', stock: 289, total: 400 },  // Traditional wear added
    { category: 'Home Goods', stock: 156, total: 250 },
    { category: 'Books', stock: 310, total: 400 },     // Regional language books added
    { category: 'Grocery', stock: 420, total: 500 },  // Added FMCG category
  ],
  recentOrders: [
    { id: 1001, customer: 'Rajesh Sharma', amount: 12599, status: 'Shipped', product: 'Smartphone' },
    { id: 1002, customer: 'Priya Patel', amount: 8950, status: 'Processing', product: 'Saree' },
    { id: 1003, customer: 'Amit Singh', amount: 24575, status: 'Delivered', product: 'Laptop' },
    { id: 1004, customer: 'Neha Gupta', amount: 18750, status: 'Shipped', product: 'Mixer Grinder' },
    { id: 1005, customer: 'Vikram Joshi', amount: 32500, status: 'Processing', product: 'Smart TV' },
    { id: 1006, customer: 'Ananya Reddy', amount: 14230, status: 'Delivered', product: 'Kurta Set' },
    { id: 1007, customer: 'Sanjay Kumar', amount: 21000, status: 'Shipped', product: 'Air Conditioner' },
  ],
  topProducts: [
    { name: 'Smartphones', sales: 342, category: 'Electronics' },
    { name: 'Traditional Wear', sales: 289, category: 'Clothing' },
    { name: 'Kitchen Appliances', sales: 215, category: 'Home Goods' },
    { name: 'Regional Books', sales: 187, category: 'Books' },
    { name: 'Packaged Foods', sales: 398, category: 'Grocery' },
  ],
  regionalSales: [
    { region: 'North', sales: 845000 },
    { region: 'South', sales: 923000 },
    { region: 'East', sales: 587000 },
    { region: 'West', sales: 764000 },
  ]
};