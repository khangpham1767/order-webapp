'use client';

import { Card } from '@/components/ui/card';
import { formatVND } from '@/lib/utils';
import type { OrderItemConfig } from '@/types/order';

interface OrderItemCardProps {
  config: OrderItemConfig;
  quantity: number;
  unitPrice: number;
  notes?: string;
  showPrice?: boolean;
  onRemove?: () => void;
  onClick?: () => void;
}

export function OrderItemCard({
  config,
  quantity,
  unitPrice,
  notes,
  showPrice = true,
  onRemove,
  onClick,
}: OrderItemCardProps) {
  const details: string[] = [];
  if (config.variant) details.push(config.variant);
  if (config.noodleType) details.push(config.noodleType);
  if (config.size && config.size !== 'Tô thường') details.push(config.size);
  if (config.specials?.length) details.push(config.specials.join(', '));
  if (config.vegetables?.length) details.push(config.vegetables.join(', '));
  if (config.addons?.length) details.push(config.addons.map((a) => a.name).join(', '));

  return (
    <Card
      className={onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-gray-900 truncate">{config.menuItemName}</h3>
            {quantity > 1 && (
              <span className="text-primary-600 font-semibold text-sm">x{quantity}</span>
            )}
          </div>
          {details.length > 0 && (
            <p className="text-sm text-gray-500 mt-0.5">{details.join(' – ')}</p>
          )}
          {notes && <p className="text-sm text-primary-600 mt-0.5 italic">{notes}</p>}
        </div>
        <div className="flex items-center gap-2 ml-3 shrink-0">
          {showPrice && (
            <span className="text-sm font-medium text-gray-700">
              {formatVND(unitPrice * quantity)}
            </span>
          )}
          {onRemove && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onRemove(); }}
              className="text-red-400 hover:text-red-600 text-lg"
              aria-label="Xóa"
            >
              ×
            </button>
          )}
        </div>
      </div>
    </Card>
  );
}
