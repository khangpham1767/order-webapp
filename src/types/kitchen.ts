import type { OrderStatus } from '@prisma/client';

export interface KitchenOrderItem {
  id: number;
  menuItemName: string;
  quantity: number;
  configDetail: {
    noodleType: string;
    specials: string[];
    vegetables: string[];
    size: string;
    addons: { name: string; quantity: number }[];
  };
  notes?: string | null;
}

export interface KitchenOrder {
  id: number;
  tableNumber: number;
  tableLabel: string;
  status: OrderStatus;
  queuePosition: number | null;
  items: KitchenOrderItem[];
  createdAt: string;
}

export interface KitchenQueueState {
  currentOrder: KitchenOrder | null;
  queuedOrders: KitchenOrder[];
  queueLength: number;
}
