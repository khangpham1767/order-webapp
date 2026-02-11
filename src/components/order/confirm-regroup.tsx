'use client';

import { Card } from '@/components/ui/card';
import type { GroupedOrderItem } from '@/types/order';

interface ConfirmRegroupProps {
  groupedItems: GroupedOrderItem[];
}

export function ConfirmRegroup({ groupedItems }: ConfirmRegroupProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
        Đơn hàng (gộp lại)
      </h3>
      {groupedItems.map((item, index) => {
        const details: string[] = [];
        if (item.config.noodleType) details.push(item.config.noodleType);
        if (item.config.size) details.push(item.config.size);
        if (item.config.specials?.length) details.push(item.config.specials.join(', '));
        if (item.config.vegetables?.length) details.push(item.config.vegetables.join(', '));
        if (item.config.addons?.length) details.push(item.config.addons.map((a) => a.name).join(', '));

        return (
          <Card key={index}>
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium text-gray-900">{item.config.menuItemName}</span>
                {details.length > 0 && (
                  <span className="text-gray-500 text-sm"> – {details.join(' – ')}</span>
                )}
              </div>
              <span className="text-primary-600 font-bold">x{item.quantity}</span>
            </div>
            {item.notes && (
              <p className="text-sm text-primary-600 mt-1 italic">{item.notes}</p>
            )}
          </Card>
        );
      })}
    </div>
  );
}
