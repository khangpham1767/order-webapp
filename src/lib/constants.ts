export const ROLES = {
  ORDER_STAFF: 'order',
  KITCHEN: 'kitchen',
  ACCOUNTING: 'accounting',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const ORDER_STATUS = {
  DRAFT: 'DRAFT',
  QUEUED: 'QUEUED',
  COOKING: 'COOKING',
  DONE: 'DONE',
  PAID: 'PAID',
} as const;

export const ORDER_STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Nháp',
  QUEUED: 'Chờ bếp',
  COOKING: 'Đang nấu',
  DONE: 'Xong',
  PAID: 'Đã thanh toán',
};

export const QUEUE_POSITION_START = 1000;
export const QUEUE_POSITION_GAP = 1;
