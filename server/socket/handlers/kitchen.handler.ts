import { getIO } from '../index';
import { SOCKET_EVENTS } from '../events';
import { ROOMS } from '../rooms';
import type { KitchenQueueState } from '../../../src/types/kitchen';
import type { OrderWithItems } from '../../../src/types/order';

export function emitKitchenQueueUpdated(state: KitchenQueueState) {
  const io = getIO();
  io.to(ROOMS.KITCHEN).emit(SOCKET_EVENTS.KITCHEN_QUEUE_UPDATED, state);
}

export function emitKitchenOrderStarted(order: OrderWithItems) {
  const io = getIO();
  io.to(ROOMS.KITCHEN).emit(SOCKET_EVENTS.KITCHEN_ORDER_STARTED, order);
  io.to(ROOMS.ORDER_STAFF).emit(SOCKET_EVENTS.ORDER_STATUS_CHANGED, order);
  io.to(ROOMS.table(order.tableId)).emit(SOCKET_EVENTS.ORDER_STATUS_CHANGED, order);
}

export function emitKitchenOrderDone(order: OrderWithItems) {
  const io = getIO();
  io.to(ROOMS.KITCHEN).emit(SOCKET_EVENTS.KITCHEN_ORDER_DONE, order);
  io.to(ROOMS.ORDER_STAFF).emit(SOCKET_EVENTS.ORDER_STATUS_CHANGED, order);
  io.to(ROOMS.table(order.tableId)).emit(SOCKET_EVENTS.ORDER_STATUS_CHANGED, order);
}
