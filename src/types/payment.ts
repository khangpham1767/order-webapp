export interface PaymentLineItem {
  menuItemName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  configSummary: string;
}

export interface PaymentSummary {
  orderId: number;
  tableNumber: number;
  tableLabel: string;
  items: PaymentLineItem[];
  totalAmount: number;
  paidAt?: string;
}
