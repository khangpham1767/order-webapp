import type { OrderStatus } from '@prisma/client';

export interface TableWithStatus {
  id: number;
  number: number;
  label: string;
  activeOrderId: number | null;
  activeOrderStatus: OrderStatus | null;
}
