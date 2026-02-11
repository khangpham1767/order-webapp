'use client';

import { Card } from '@/components/ui/card';
import type { KitchenOrder } from '@/types/kitchen';

interface CurrentOrderProps {
  order: KitchenOrder;
}

export function CurrentOrder({ order }: CurrentOrderProps) {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-kitchen-800">{order.tableLabel}</h2>
        <p className="text-sm text-gray-500">Order #{order.id}</p>
      </div>

      <div className="space-y-3">
        {order.items.map((item) => {
          const details: string[] = [];
          if (item.configDetail.noodleType) details.push(item.configDetail.noodleType);
          if (item.configDetail.size && item.configDetail.size !== 'Tô thường') {
            details.push(item.configDetail.size);
          }
          if (item.configDetail.specials?.length) {
            details.push(item.configDetail.specials.join(', '));
          }
          if (item.configDetail.vegetables?.length) {
            details.push(item.configDetail.vegetables.join(', '));
          }
          if (item.configDetail.addons?.length) {
            details.push(item.configDetail.addons.map((a) => a.name).join(', '));
          }

          return (
            <Card key={item.id} className="border-l-4 border-l-kitchen-500">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{item.menuItemName}</h3>
                  {details.length > 0 && (
                    <p className="text-base text-gray-600 mt-1">{details.join(' – ')}</p>
                  )}
                  {item.notes && (
                    <p className="text-base text-kitchen-600 mt-1 font-medium italic">
                      {item.notes}
                    </p>
                  )}
                </div>
                {item.quantity > 1 && (
                  <span className="text-2xl font-bold text-kitchen-600">x{item.quantity}</span>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
