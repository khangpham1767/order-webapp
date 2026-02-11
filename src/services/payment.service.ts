import { prisma } from '@/lib/prisma';
import type { PaymentSummary, PaymentLineItem } from '@/types/payment';
import type { OrderWithItems } from '@/types/order';

const orderInclude = {
  table: true,
  items: {
    include: { menuItem: true },
    orderBy: { id: 'asc' as const },
  },
};

function buildConfigSummary(configDetail: Record<string, unknown>): string {
  const parts: string[] = [];
  if (configDetail.noodleType) parts.push(configDetail.noodleType as string);
  if (configDetail.size) parts.push(configDetail.size as string);
  const specials = configDetail.specials as string[] | undefined;
  if (specials?.length) parts.push(specials.join(', '));
  const vegetables = configDetail.vegetables as string[] | undefined;
  if (vegetables?.length) parts.push(vegetables.join(', '));
  const addons = configDetail.addons as { name: string; quantity: number }[] | undefined;
  if (addons?.length) parts.push(addons.map((a) => a.name).join(', '));
  return parts.join(' – ');
}

function toPaymentSummary(order: OrderWithItems, paidAt?: Date): PaymentSummary {
  const items: PaymentLineItem[] = order.items.map((item) => ({
    menuItemName: item.menuItem.name,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    subtotal: item.unitPrice * item.quantity,
    configSummary: buildConfigSummary(item.configDetail as Record<string, unknown>),
  }));

  const totalAmount = items.reduce((sum, item) => sum + item.subtotal, 0);

  return {
    orderId: order.id,
    tableNumber: order.table.number,
    tableLabel: order.table.label,
    items,
    totalAmount,
    paidAt: paidAt?.toISOString(),
  };
}

export async function processPayment(orderId: number): Promise<PaymentSummary> {
  const order = (await prisma.order.findUnique({
    where: { id: orderId },
    include: orderInclude,
  })) as OrderWithItems | null;

  if (!order) throw new Error('Order not found');
  if (order.status !== 'DONE') {
    throw new Error(`Cannot process payment for order in ${order.status} status`);
  }

  const totalAmount = order.items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  );

  const payment = await prisma.payment.create({
    data: {
      orderId,
      totalAmount,
    },
  });

  await prisma.order.update({
    where: { id: orderId },
    data: { status: 'PAID' },
  });

  return toPaymentSummary(order, payment.paidAt);
}

export async function getPaymentByOrderId(orderId: number): Promise<PaymentSummary | null> {
  const payment = await prisma.payment.findUnique({
    where: { orderId },
    include: {
      order: {
        include: orderInclude,
      },
    },
  });

  if (!payment) return null;

  return toPaymentSummary(payment.order as unknown as OrderWithItems, payment.paidAt);
}
