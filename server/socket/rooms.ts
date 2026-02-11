export const ROOMS = {
  ORDER_STAFF: 'room:order_staff',
  KITCHEN: 'room:kitchen',
  ACCOUNTING: 'room:accounting',
  table: (tableId: number) => `room:table:${tableId}`,
} as const;
