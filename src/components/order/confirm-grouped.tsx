'use client';

import { Card } from '@/components/ui/card';
import type { GroupedOrderItem } from '@/types/order';

interface ConfirmGroupedProps {
  groupedItems: GroupedOrderItem[];
  onItemClick: (index: number) => void;
}

export function ConfirmGrouped({ groupedItems, onItemClick }: ConfirmGroupedProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
        Gộp theo cấu hình
      </h3>
      {groupedItems.map((item, index) => {
        const details: string[] = [];
        if (item.config.noodleType) details.push(item.config.noodleType);
        if (item.config.size) details.push(item.config.size);
        if (item.config.specials?.length) details.push(item.config.specials.join(', '));

        return (
          <Card
            key={index}
            className="cursor-pointer hover:shadow-md hover:border-primary-300 transition-all"
            onClick={() => onItemClick(index)}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium text-gray-900">{item.config.menuItemName}</span>
                {details.length > 0 && (
                  <span className="text-gray-500"> – {details.join(' – ')}</span>
                )}
              </div>
              <span className="text-primary-600 font-bold text-lg">
                x{item.quantity}
              </span>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
