import { prisma } from '@/lib/prisma';
import type { DashboardStats, ItemSalesRow, StatisticsData } from '@/types/statistics';

export async function getStatistics(): Promise<StatisticsData> {
  // Get all PAID orders with their items
  const paidOrders = await prisma.order.findMany({
    where: { status: 'PAID' },
    include: {
      items: {
        include: { menuItem: true },
      },
    },
  });

  let totalItemsSold = 0;
  let totalRevenue = 0;
  let totalProfit = 0;

  const itemMap = new Map<
    number,
    { menuItemName: string; quantitySold: number; revenue: number; cost: number }
  >();

  for (const order of paidOrders) {
    for (const item of order.items) {
      totalItemsSold += item.quantity;
      const itemRevenue = item.unitPrice * item.quantity;
      const itemCost = item.menuItem.costPrice * item.quantity;
      totalRevenue += itemRevenue;
      totalProfit += itemRevenue - itemCost;

      const existing = itemMap.get(item.menuItemId);
      if (existing) {
        existing.quantitySold += item.quantity;
        existing.revenue += itemRevenue;
        existing.cost += itemCost;
      } else {
        itemMap.set(item.menuItemId, {
          menuItemName: item.menuItem.name,
          quantitySold: item.quantity,
          revenue: itemRevenue,
          cost: itemCost,
        });
      }
    }
  }

  const summary: DashboardStats = {
    totalOrders: paidOrders.length,
    totalItemsSold,
    totalRevenue,
    totalProfit,
  };

  const itemBreakdown: ItemSalesRow[] = Array.from(itemMap.entries()).map(
    ([menuItemId, data]) => ({
      menuItemId,
      menuItemName: data.menuItemName,
      quantitySold: data.quantitySold,
      revenue: data.revenue,
      cost: data.cost,
      profit: data.revenue - data.cost,
    }),
  );

  return { summary, itemBreakdown };
}
