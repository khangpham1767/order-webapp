'use client';

import { Card } from '@/components/ui/card';
import { formatVND } from '@/lib/utils';
import type { DashboardStats } from '@/types/statistics';

interface StatsSummaryProps {
  stats: DashboardStats;
}

const KPI_CONFIG = [
  { key: 'totalOrders' as const, label: 'Tổng đơn', format: (v: number) => v.toString() },
  { key: 'totalItemsSold' as const, label: 'Món đã bán', format: (v: number) => v.toString() },
  { key: 'totalRevenue' as const, label: 'Doanh thu', format: formatVND },
  { key: 'totalProfit' as const, label: 'Lợi nhuận', format: formatVND },
];

export function StatsSummary({ stats }: StatsSummaryProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {KPI_CONFIG.map((kpi) => (
        <Card key={kpi.key}>
          <p className="text-sm text-gray-500">{kpi.label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{kpi.format(stats[kpi.key])}</p>
        </Card>
      ))}
    </div>
  );
}
