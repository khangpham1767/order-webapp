'use client';

import { Card } from '@/components/ui/card';
import { formatVND } from '@/lib/utils';
import type { ItemSalesRow } from '@/types/statistics';

interface StatsTableProps {
  items: ItemSalesRow[];
}

export function StatsTable({ items }: StatsTableProps) {
  const sorted = [...items].sort((a, b) => b.revenue - a.revenue);

  return (
    <Card padding={false}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left px-4 py-3 font-medium text-gray-700">Món</th>
              <th className="text-right px-4 py-3 font-medium text-gray-700">SL bán</th>
              <th className="text-right px-4 py-3 font-medium text-gray-700">Doanh thu</th>
              <th className="text-right px-4 py-3 font-medium text-gray-700">Giá vốn</th>
              <th className="text-right px-4 py-3 font-medium text-gray-700">Lợi nhuận</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((row) => (
              <tr key={row.menuItemId} className="border-b border-gray-100 last:border-0">
                <td className="px-4 py-3 font-medium text-gray-900">{row.menuItemName}</td>
                <td className="px-4 py-3 text-right text-gray-600">{row.quantitySold}</td>
                <td className="px-4 py-3 text-right text-gray-600">{formatVND(row.revenue)}</td>
                <td className="px-4 py-3 text-right text-gray-600">{formatVND(row.cost)}</td>
                <td className="px-4 py-3 text-right font-medium text-gray-900">{formatVND(row.profit)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
