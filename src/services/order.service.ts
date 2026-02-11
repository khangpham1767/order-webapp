import { prisma } from '@/lib/prisma';
import { QUEUE_POSITION_START } from '@/lib/constants';
import type { CreateOrderPayload, UpdateOrderItemsPayload, OrderWithItems } from '@/types/order';

const orderInclude = {
  table: true,
  items: {
    include: { menuItem: true },
    orderBy: { id: 'asc' as const },
  },
};

export async function getOrders(status?: string): Promise<OrderWithItems[]> {
  const where = status ? { status: { in: status.split(',') as never[] } } : {};
  return prisma.order.findMany({
    where,
    include: orderInclude,
    orderBy: { createdAt: 'desc' },
  }) as Promise<OrderWithItems[]>;
}

export async function getOrderById(orderId: number): Promise<OrderWithItems | null> {
  return prisma.order.findUnique({
    where: { id: orderId },
    include: orderInclude,
  }) as Promise<OrderWithItems | null>;
}

export async function createOrder(payload: CreateOrderPayload): Promise<OrderWithItems> {
  return prisma.order.create({
    data: {
      tableId: payload.tableId,
      status: 'DRAFT',
      items: {
        create: payload.items.map((item) => ({
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          configDetail: item.configDetail as never,
          notes: item.notes,
        })),
      },
    },
    include: orderInclude,
  }) as Promise<OrderWithItems>;
}

export async function submitOrder(
  orderId: number,
  frontInsert: boolean = false,
): Promise<OrderWithItems> {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new Error('Order not found');
  if (order.status !== 'DRAFT' && order.status !== 'QUEUED') {
    throw new Error(`Cannot submit order in ${order.status} status`);
  }

  let queuePosition: number;

  if (frontInsert) {
    const minOrder = await prisma.order.findFirst({
      where: { status: 'QUEUED' },
      orderBy: { queuePosition: 'asc' },
      select: { queuePosition: true },
    });
    queuePosition = minOrder?.queuePosition
      ? minOrder.queuePosition - 1
      : QUEUE_POSITION_START;
  } else {
    const maxOrder = await prisma.order.findFirst({
      where: { status: 'QUEUED' },
      orderBy: { queuePosition: 'desc' },
      select: { queuePosition: true },
    });
    queuePosition = maxOrder?.queuePosition
      ? maxOrder.queuePosition + 1
      : QUEUE_POSITION_START;
  }

  return prisma.order.update({
    where: { id: orderId },
    data: { status: 'QUEUED', queuePosition },
    include: orderInclude,
  }) as Promise<OrderWithItems>;
}

export async function updateOrderItems(
  orderId: number,
  payload: UpdateOrderItemsPayload,
): Promise<OrderWithItems> {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new Error('Order not found');
  if (order.status !== 'DRAFT' && order.status !== 'QUEUED') {
    throw new Error(`Cannot edit order in ${order.status} status`);
  }

  // Delete existing items and create new ones
  await prisma.orderItem.deleteMany({ where: { orderId } });

  return prisma.order.update({
    where: { id: orderId },
    data: {
      items: {
        create: payload.items.map((item) => ({
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          configDetail: item.configDetail as never,
          notes: item.notes,
        })),
      },
    },
    include: orderInclude,
  }) as Promise<OrderWithItems>;
}

export async function cancelOrder(orderId: number): Promise<{ orderId: number; tableId: number }> {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new Error('Order not found');
  if (order.status !== 'DRAFT' && order.status !== 'QUEUED') {
    throw new Error(`Cannot cancel order in ${order.status} status`);
  }

  await prisma.order.delete({ where: { id: orderId } });
  return { orderId, tableId: order.tableId };
}

export async function createAdditionalOrder(
  tableId: number,
  items: CreateOrderPayload['items'],
): Promise<OrderWithItems> {
  // Create a new order for the same table
  const order = await createOrder({ tableId, items });
  // Submit with front-insert to prioritize
  return submitOrder(order.id, true);
}

export async function getActiveOrdersForTable(tableId: number): Promise<OrderWithItems[]> {
  return prisma.order.findMany({
    where: {
      tableId,
      status: { notIn: ['PAID'] },
    },
    include: orderInclude,
    orderBy: { createdAt: 'desc' },
  }) as Promise<OrderWithItems[]>;
}
