// Simulated API calls with mock data
import { mockDashboardData } from './mockData';

export const fetchDashboardData = async () => {
  // In a real app, this would be an actual API call
  // return fetch('https://api.example.com/dashboard').then(res => res.json());
  
  // For demo purposes, we'll use mock data with a delay to simulate network request
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(mockDashboardData);
    }, 800);
  });
};