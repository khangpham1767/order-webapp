export interface DashboardStats {
  totalOrders: number;
  totalItemsSold: number;
  totalRevenue: number;
  totalProfit: number;
}

export interface ItemSalesRow {
  menuItemId: number;
  menuItemName: string;
  quantitySold: number;
  revenue: number;
  cost: number;
  profit: number;
}

export interface StatisticsData {
  summary: DashboardStats;
  itemBreakdown: ItemSalesRow[];
}
