// Mock Analytics Data for Dashboard
// This will be replaced with real API data later

export interface DashboardStats {
  totalSales: {
    value: number;
    change: number; // percentage
    trend: 'up' | 'down';
  };
  totalOrders: {
    value: number;
    change: number;
    trend: 'up' | 'down';
  };
  productsSold: {
    value: number;
    change: number;
    trend: 'up' | 'down';
  };
  newCustomers: {
    value: number;
    change: number;
    trend: 'up' | 'down';
  };
}

export interface RevenueData {
  day: string;
  online: number;
  offline: number;
}

export interface VisitorData {
  month: string;
  loyal: number;
  newCustomers: number;
  unique: number;
}

export interface SatisfactionData {
  month: string;
  lastMonth: number;
  thisMonth: number;
}

export interface TargetData {
  month: string;
  reality: number;
  target: number;
}

export interface TopProduct {
  rank: number;
  name: string;
  popularity: number; // 0-100
  sales: number; // percentage
}

export interface VolumeServiceData {
  month: string;
  volume: number;
  services: number;
}

// Mock Data
export const mockDashboardStats: DashboardStats = {
  totalSales: {
    value: 51000,
    change: 13,
    trend: 'up',
  },
  totalOrders: {
    value: 300,
    change: 15,
    trend: 'up',
  },
  productsSold: {
    value: 5,
    change: 12,
    trend: 'up',
  },
  newCustomers: {
    value: 8,
    change: 5.3,
    trend: 'up',
  },
};

export const mockRevenueData: RevenueData[] = [
  { day: 'Monday', online: 150, offline: 180 },
  { day: 'Tuesday', online: 180, offline: 220 },
  { day: 'Wednesday', online: 200, offline: 170 },
  { day: 'Thursday', online: 170, offline: 190 },
  { day: 'Friday', online: 190, offline: 210 },
  { day: 'Saturday', online: 220, offline: 230 },
  { day: 'Sunday', online: 240, offline: 200 },
];

export const mockVisitorData: VisitorData[] = [
  { month: 'Jan', loyal: 450, newCustomers: 380, unique: 320 },
  { month: 'Feb', loyal: 520, newCustomers: 420, unique: 380 },
  { month: 'Mar', loyal: 480, newCustomers: 460, unique: 400 },
  { month: 'Apr', loyal: 580, newCustomers: 520, unique: 450 },
  { month: 'May', loyal: 620, newCustomers: 480, unique: 420 },
  { month: 'Jun', loyal: 720, newCustomers: 580, unique: 520 },
  { month: 'Jul', loyal: 680, newCustomers: 620, unique: 560 },
  { month: 'Aug', loyal: 750, newCustomers: 680, unique: 600 },
  { month: 'Sep', loyal: 820, newCustomers: 720, unique: 650 },
  { month: 'Oct', loyal: 780, newCustomers: 760, unique: 680 },
  { month: 'Nov', loyal: 850, newCustomers: 800, unique: 720 },
  { month: 'Dec', loyal: 920, newCustomers: 780, unique: 700 },
];

export const mockSatisfactionData: SatisfactionData[] = [
  { month: 'Jan', lastMonth: 2800, thisMonth: 3200 },
  { month: 'Feb', lastMonth: 3000, thisMonth: 3500 },
  { month: 'Mar', lastMonth: 2900, thisMonth: 3800 },
  { month: 'Apr', lastMonth: 3100, thisMonth: 3600 },
  { month: 'May', lastMonth: 3200, thisMonth: 4000 },
  { month: 'Jun', lastMonth: 3300, thisMonth: 4200 },
  { month: 'Jul', lastMonth: 3400, thisMonth: 4500 },
];

export const mockTargetData: TargetData[] = [
  { month: 'Jan', reality: 18000, target: 20000 },
  { month: 'Feb', reality: 19500, target: 20000 },
  { month: 'Mar', reality: 17800, target: 21000 },
  { month: 'Apr', reality: 22000, target: 21000 },
  { month: 'May', reality: 20500, target: 22000 },
  { month: 'Jun', reality: 23000, target: 22000 },
  { month: 'Jul', reality: 24500, target: 23000 },
];

export const mockTopProducts: TopProduct[] = [
  {
    rank: 1,
    name: 'Prime Ribeye Steaks',
    popularity: 85,
    sales: 45,
  },
  {
    rank: 2,
    name: 'Wagyu Beef Burgers',
    popularity: 72,
    sales: 29,
  },
  {
    rank: 3,
    name: 'Chicken Breast Fillets',
    popularity: 65,
    sales: 18,
  },
  {
    rank: 4,
    name: 'Lamb Chops Premium',
    popularity: 58,
    sales: 22,
  },
];

export const mockVolumeServiceData: VolumeServiceData[] = [
  { month: 'Jan', volume: 800, services: 580 },
  { month: 'Feb', volume: 950, services: 620 },
  { month: 'Mar', volume: 1100, services: 680 },
  { month: 'Apr', volume: 1050, services: 700 },
  { month: 'May', volume: 1200, services: 650 },
  { month: 'Jun', volume: 980, services: 590 },
];
