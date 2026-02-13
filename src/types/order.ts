import type { Order, OrderItem, MenuItem, Table } from '@prisma/client';

export interface AddonConfig {
  menuItemId: number;
  name: string;
  quantity: number;
  price: number;
  variant?: string;
}

export interface OrderItemConfig {
  menuItemId: number;
  menuItemName: string;
  noodleType: string;
  specials: string[];
  vegetables: string[];
  size: string;
  addons: AddonConfig[];
  quantity: number;
  variant?: string;
}

export interface GroupedOrderItem {
  config: OrderItemConfig;
  quantity: number;
  notes?: string;
}

export interface OrderItemWithMenu extends OrderItem {
  menuItem: MenuItem;
}

export interface OrderWithItems extends Order {
  table: Table;
  items: OrderItemWithMenu[];
}

export interface CreateOrderPayload {
  tableId: number;
  items: {
    menuItemId: number;
    quantity: number;
    unitPrice: number;
    configDetail: OrderItemConfig;
    notes?: string;
  }[];
}

export interface UpdateOrderItemsPayload {
  items: {
    menuItemId: number;
    quantity: number;
    unitPrice: number;
    configDetail: OrderItemConfig;
    notes?: string;
  }[];
}
