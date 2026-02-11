import { getIO } from '../index';
import { SOCKET_EVENTS } from '../events';
import { ROOMS } from '../rooms';
import type { OrderWithItems } from '../../../src/types/order';

export function emitOrderCreated(order: OrderWithItems) {
  const io = getIO();
  io.to(ROOMS.ORDER_STAFF).emit(SOCKET_EVENTS.ORDER_CREATED, order);
  io.to(ROOMS.table(order.tableId)).emit(SOCKET_EVENTS.ORDER_CREATED, order);
  io.to(ROOMS.ORDER_STAFF).emit(SOCKET_EVENTS.TABLE_STATUS_CHANGED, {
    tableId: order.tableId,
  });
}

export function emitOrderUpdated(order: OrderWithItems) {
  const io = getIO();
  io.to(ROOMS.ORDER_STAFF).emit(SOCKET_EVENTS.ORDER_UPDATED, order);
  io.to(ROOMS.table(order.tableId)).emit(SOCKET_EVENTS.ORDER_UPDATED, order);
}

export function emitOrderSubmitted(order: OrderWithItems) {
  const io = getIO();
  io.to(ROOMS.ORDER_STAFF).emit(SOCKET_EVENTS.ORDER_SUBMITTED, order);
  io.to(ROOMS.KITCHEN).emit(SOCKET_EVENTS.KITCHEN_QUEUE_UPDATED, null);
  io.to(ROOMS.table(order.tableId)).emit(SOCKET_EVENTS.ORDER_SUBMITTED, order);
}

export function emitOrderCancelled(data: { orderId: number; tableId: number }) {
  const io = getIO();
  io.to(ROOMS.ORDER_STAFF).emit(SOCKET_EVENTS.ORDER_CANCELLED, data);
  io.to(ROOMS.KITCHEN).emit(SOCKET_EVENTS.KITCHEN_QUEUE_UPDATED, null);
  io.to(ROOMS.table(data.tableId)).emit(SOCKET_EVENTS.ORDER_CANCELLED, data);
  io.to(ROOMS.ORDER_STAFF).emit(SOCKET_EVENTS.TABLE_STATUS_CHANGED, {
    tableId: data.tableId,
  });
}

export function emitOrderStatusChanged(order: OrderWithItems) {
  const io = getIO();
  io.to(ROOMS.ORDER_STAFF).emit(SOCKET_EVENTS.ORDER_STATUS_CHANGED, order);
  io.to(ROOMS.table(order.tableId)).emit(SOCKET_EVENTS.ORDER_STATUS_CHANGED, order);
}
