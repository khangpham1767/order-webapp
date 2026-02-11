import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { OrderItemConfig, GroupedOrderItem } from '@/types/order';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
}

function configKey(config: OrderItemConfig): string {
  return JSON.stringify({
    menuItemId: config.menuItemId,
    noodleType: config.noodleType,
    specials: [...(config.specials || [])].sort(),
    vegetables: [...(config.vegetables || [])].sort(),
    size: config.size,
    addons: [...(config.addons || [])].sort((a, b) => a.menuItemId - b.menuItemId),
  });
}

export function groupOrderItems(
  items: { config: OrderItemConfig; quantity: number; notes?: string }[],
): GroupedOrderItem[] {
  const map = new Map<string, GroupedOrderItem>();

  for (const item of items) {
    const key = configKey(item.config);
    const existing = map.get(key);
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      map.set(key, {
        config: item.config,
        quantity: item.quantity,
        notes: item.notes,
      });
    }
  }

  return Array.from(map.values());
}

export function splitGroupedItem(
  grouped: GroupedOrderItem,
): { config: OrderItemConfig; quantity: number; notes?: string }[] {
  return Array.from({ length: grouped.quantity }, () => ({
    config: { ...grouped.config },
    quantity: 1,
    notes: grouped.notes,
  }));
}
