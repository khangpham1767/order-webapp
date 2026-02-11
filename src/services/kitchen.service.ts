import { prisma } from '@/lib/prisma';
import type { KitchenOrder, KitchenQueueState } from '@/types/kitchen';
import type { OrderWithItems } from '@/types/order';

const orderInclude = {
  table: true,
  items: {
    include: { menuItem: true },
    orderBy: { id: 'asc' as const },
  },
};

function toKitchenOrder(order: OrderWithItems): KitchenOrder {
  return {
    id: order.id,
    tableNumber: order.table.number,
    tableLabel: order.table.label,
    status: order.status,
    queuePosition: order.queuePosition,
    items: order.items.map((item) => {
      const config = item.configDetail as Record<string, unknown>;
      return {
        id: item.id,
        menuItemName: item.menuItem.name,
        quantity: item.quantity,
        configDetail: {
          noodleType: (config.noodleType as string) || '',
          specials: (config.specials as string[]) || [],
          vegetables: (config.vegetables as string[]) || [],
          size: (config.size as string) || '',
          addons: (config.addons as { name: string; quantity: number }[]) || [],
        },
        notes: item.notes,
      };
    }),
    createdAt: order.createdAt.toISOString(),
  };
}

export async function getKitchenQueueState(): Promise<KitchenQueueState> {
  const currentOrder = await prisma.order.findFirst({
    where: { status: 'COOKING' },
    include: orderInclude,
  });

  const queuedOrders = await prisma.order.findMany({
    where: { status: 'QUEUED' },
    include: orderInclude,
    orderBy: { queuePosition: 'asc' },
  });

  return {
    currentOrder: currentOrder ? toKitchenOrder(currentOrder as OrderWithItems) : null,
    queuedOrders: queuedOrders.map((o) => toKitchenOrder(o as OrderWithItems)),
    queueLength: queuedOrders.length,
  };
}

export async function startNextOrder(): Promise<OrderWithItems | null> {
  // Check if there's already a COOKING order
  const cooking = await prisma.order.findFirst({ where: { status: 'COOKING' } });
  if (cooking) return null;

  // Get next QUEUED order (FIFO by queuePosition)
  const next = await prisma.order.findFirst({
    where: { status: 'QUEUED' },
    orderBy: { queuePosition: 'asc' },
  });

  if (!next) return null;

  return prisma.order.update({
    where: { id: next.id },
    data: { status: 'COOKING' },
    include: orderInclude,
  }) as Promise<OrderWithItems>;
}

export async function completeCurrentOrder(): Promise<{
  completedOrder: OrderWithItems;
  nextOrder: OrderWithItems | null;
}> {
  const current = await prisma.order.findFirst({
    where: { status: 'COOKING' },
  });

  if (!current) throw new Error('No order currently cooking');

  const completedOrder = (await prisma.order.update({
    where: { id: current.id },
    data: { status: 'DONE' },
    include: orderInclude,
  })) as OrderWithItems;

  // Auto-advance: start the next order in queue
  const nextOrder = await startNextOrder();

  return { completedOrder, nextOrder };
}
