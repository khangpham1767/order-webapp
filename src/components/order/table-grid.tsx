'use client';

import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { TableWithStatus } from '@/types/table';
import { ORDER_STATUS_LABELS } from '@/lib/constants';

interface TableGridProps {
  tables: TableWithStatus[];
}

const statusColor: Record<string, string> = {
  DRAFT: 'border-gray-300 bg-gray-50',
  QUEUED: 'border-primary-300 bg-primary-50',
  COOKING: 'border-orange-300 bg-orange-50',
  DONE: 'border-kitchen-300 bg-kitchen-50',
};

export function TableGrid({ tables }: TableGridProps) {
  const router = useRouter();

  const createNewOrder = async (tableId: number) => {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tableId, items: [] }),
    });
    if (res.ok) {
      const order = await res.json();
      router.push(`/order/new?tableId=${tableId}&orderId=${order.id}`);
    }
  };

  const handleTableClick = async (table: TableWithStatus) => {
    if (table.activeOrderId) {
      // If DRAFT, check if it has items — clean up abandoned empty drafts
      if (table.activeOrderStatus === 'DRAFT') {
        try {
          const res = await fetch(`/api/orders/${table.activeOrderId}`);
          if (res.ok) {
            const order = await res.json();
            if (order.items.length === 0) {
              // Empty draft — delete it and create fresh
              await fetch(`/api/orders/${table.activeOrderId}`, { method: 'DELETE' });
              await createNewOrder(table.id);
              return;
            }
          }
        } catch {
          // Fall through to default behavior
        }
      }
      router.push(`/order/${table.activeOrderId}`);
    } else {
      try {
        await createNewOrder(table.id);
      } catch (error) {
        console.error('Failed to create order:', error);
      }
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {tables.map((table) => (
        <Card
          key={table.id}
          className={cn(
            'cursor-pointer border-2 transition-all hover:shadow-md text-center',
            table.activeOrderStatus
              ? statusColor[table.activeOrderStatus] || 'border-gray-200'
              : 'border-gray-200 hover:border-primary-300',
          )}
          onClick={() => handleTableClick(table)}
        >
          <div className="text-2xl font-bold text-gray-800">{table.number}</div>
          <div className="text-xs text-gray-500 mt-1">{table.label}</div>
          {table.activeOrderStatus && (
            <Badge
              variant={table.activeOrderStatus.toLowerCase() as 'draft' | 'queued' | 'cooking' | 'done'}
              className="mt-2"
            >
              {ORDER_STATUS_LABELS[table.activeOrderStatus]}
            </Badge>
          )}
          {!table.activeOrderStatus && (
            <div className="text-xs text-gray-400 mt-2">Trống</div>
          )}
        </Card>
      ))}
    </div>
  );
}
