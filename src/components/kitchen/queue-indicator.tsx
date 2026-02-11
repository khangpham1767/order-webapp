'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { KitchenOrder } from '@/types/kitchen';

interface QueueIndicatorProps {
  currentOrder: KitchenOrder | null;
  queueLength: number;
}

export function QueueIndicator({ currentOrder, queueLength }: QueueIndicatorProps) {
  return (
    <div className="flex items-center justify-between bg-white rounded-xl border border-gray-200 shadow-sm p-4">
      <div className="text-sm font-medium">
        {currentOrder ? (
          <span className={cn('text-kitchen-700')}>
            Đang nấu #{currentOrder.id}
          </span>
        ) : (
          <span className="text-gray-400">Chờ order...</span>
        )}
      </div>
      <Badge variant={queueLength > 0 ? 'queued' : 'default'}>
        {queueLength > 0 ? `Còn ${queueLength} đơn chờ` : 'Hết đơn'}
      </Badge>
    </div>
  );
}
