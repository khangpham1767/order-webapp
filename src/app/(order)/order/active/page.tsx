'use client';

import { useOrders } from '@/hooks/use-orders';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingScreen } from '@/components/ui/spinner';
import { ORDER_STATUS_LABELS } from '@/lib/constants';
import { formatVND } from '@/lib/utils';
import Link from 'next/link';

export default function ActiveOrdersPage() {
  const { orders, loading } = useOrders('DRAFT,QUEUED,COOKING,DONE');

  if (loading) return <LoadingScreen />;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Đơn đang xử lý</h2>

      {orders.length === 0 && (
        <p className="text-center text-gray-500 py-8">Không có đơn đang xử lý</p>
      )}

      {orders.map((order) => {
        const total = order.items.reduce(
          (sum, item) => sum + item.unitPrice * item.quantity,
          0,
        );
        return (
          <Link key={order.id} href={`/order/${order.id}`}>
            <Card className="hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">
                      #{order.id}
                    </span>
                    <Badge
                      variant={order.status.toLowerCase() as 'draft' | 'queued' | 'cooking' | 'done'}
                    >
                      {ORDER_STATUS_LABELS[order.status]}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {order.table.label} · {order.items.length} món
                  </p>
                </div>
                <span className="font-medium text-gray-700">{formatVND(total)}</span>
              </div>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
