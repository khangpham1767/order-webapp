export const SOCKET_EVENTS = {
  JOIN_ROOM: 'join_room',
  LEAVE_ROOM: 'leave_room',

  ORDER_CREATED: 'order:created',
  ORDER_UPDATED: 'order:updated',
  ORDER_SUBMITTED: 'order:submitted',
  ORDER_CANCELLED: 'order:cancelled',
  ORDER_STATUS_CHANGED: 'order:status_changed',

  KITCHEN_QUEUE_UPDATED: 'kitchen:queue_updated',
  KITCHEN_ORDER_STARTED: 'kitchen:order_started',
  KITCHEN_ORDER_DONE: 'kitchen:order_done',

  PAYMENT_COMPLETED: 'payment:completed',

  TABLE_STATUS_CHANGED: 'table:status_changed',
} as const;
