import type { KitchenQueueState } from './kitchen';
import type { OrderWithItems } from './order';
import type { PaymentSummary } from './payment';

export const SOCKET_EVENTS = {
  // Client → Server
  JOIN_ROOM: 'join_room',
  LEAVE_ROOM: 'leave_room',

  // Order events
  ORDER_CREATED: 'order:created',
  ORDER_UPDATED: 'order:updated',
  ORDER_SUBMITTED: 'order:submitted',
  ORDER_CANCELLED: 'order:cancelled',
  ORDER_STATUS_CHANGED: 'order:status_changed',

  // Kitchen events
  KITCHEN_QUEUE_UPDATED: 'kitchen:queue_updated',
  KITCHEN_ORDER_STARTED: 'kitchen:order_started',
  KITCHEN_ORDER_DONE: 'kitchen:order_done',

  // Payment events
  PAYMENT_COMPLETED: 'payment:completed',

  // Table events
  TABLE_STATUS_CHANGED: 'table:status_changed',
} as const;

export interface ServerToClientEvents {
  [SOCKET_EVENTS.ORDER_CREATED]: (order: OrderWithItems) => void;
  [SOCKET_EVENTS.ORDER_UPDATED]: (order: OrderWithItems) => void;
  [SOCKET_EVENTS.ORDER_SUBMITTED]: (order: OrderWithItems) => void;
  [SOCKET_EVENTS.ORDER_CANCELLED]: (order: { orderId: number; tableId: number }) => void;
  [SOCKET_EVENTS.ORDER_STATUS_CHANGED]: (order: OrderWithItems) => void;
  [SOCKET_EVENTS.KITCHEN_QUEUE_UPDATED]: (state: KitchenQueueState) => void;
  [SOCKET_EVENTS.KITCHEN_ORDER_STARTED]: (order: OrderWithItems) => void;
  [SOCKET_EVENTS.KITCHEN_ORDER_DONE]: (order: OrderWithItems) => void;
  [SOCKET_EVENTS.PAYMENT_COMPLETED]: (payment: PaymentSummary) => void;
  [SOCKET_EVENTS.TABLE_STATUS_CHANGED]: (data: { tableId: number }) => void;
}

export interface ClientToServerEvents {
  [SOCKET_EVENTS.JOIN_ROOM]: (room: string) => void;
  [SOCKET_EVENTS.LEAVE_ROOM]: (room: string) => void;
}
