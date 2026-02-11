import { getIO } from '../index';
import { SOCKET_EVENTS } from '../events';
import { ROOMS } from '../rooms';
import type { PaymentSummary } from '../../../src/types/payment';

export function emitPaymentCompleted(payment: PaymentSummary, tableId: number) {
  const io = getIO();
  io.to(ROOMS.ORDER_STAFF).emit(SOCKET_EVENTS.PAYMENT_COMPLETED, payment);
  io.to(ROOMS.ACCOUNTING).emit(SOCKET_EVENTS.PAYMENT_COMPLETED, payment);
  io.to(ROOMS.table(tableId)).emit(SOCKET_EVENTS.PAYMENT_COMPLETED, payment);
  io.to(ROOMS.ORDER_STAFF).emit(SOCKET_EVENTS.TABLE_STATUS_CHANGED, { tableId });
}
