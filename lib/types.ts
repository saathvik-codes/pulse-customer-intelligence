export type DashboardData = {
  kpis: {
    totalRevenue: number;
    totalOrders: number;
    totalCustomers: number;
    avgOrderValue: number;
    repeatPurchaseRate: number;
    dateRange: { start: string; end: string };
  };
  monthlyTrend: { month: string; revenue: number; orders: number; customers: number }[];
  segments: { segment: string; customers: number; revenue: number }[];
  countries: { country: string; revenue: number; orders: number }[];
  topProducts: { product: string; revenue: number; units: number }[];
  cohorts: { cohort: string; month: number; customers: number; size: number; retention_pct: number }[];
  churn: {
    breakdown: { risk: string; customers: number; revenue: number }[];
    revenueAtRisk: number;
    topAtRisk: { customerId: string; country: string; monetary: number; recencyDays: number; frequency: number }[];
  };
};
