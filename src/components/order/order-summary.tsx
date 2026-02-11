'use client';

import { OrderItemCard } from './order-item-card';
import { formatVND } from '@/lib/utils';
import type { OrderItemWithMenu } from '@/types/order';

interface OrderSummaryProps {
  items: OrderItemWithMenu[];
  showPrice?: boolean;
}

export function OrderSummary({ items, showPrice = true }: OrderSummaryProps) {
  const total = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <OrderItemCard
          key={item.id}
          config={item.configDetail as never}
          quantity={item.quantity}
          unitPrice={item.unitPrice}
          notes={item.notes || undefined}
          showPrice={showPrice}
        />
      ))}
      {showPrice && items.length > 0 && (
        <div className="flex justify-between items-center pt-3 border-t border-gray-200">
          <span className="font-semibold text-gray-900">Tổng cộng</span>
          <span className="text-lg font-bold text-primary-600">{formatVND(total)}</span>
        </div>
      )}
    </div>
  );
}
