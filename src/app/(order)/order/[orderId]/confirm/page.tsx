'use client';

import { use, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useOrder } from '@/hooks/use-orders';
import { useMenu } from '@/hooks/use-menu';
import { ConfirmGrouped } from '@/components/order/confirm-grouped';
import { ConfirmSplit } from '@/components/order/confirm-split';
import { ConfirmRegroup } from '@/components/order/confirm-regroup';
import { Button } from '@/components/ui/button';
import { LoadingScreen } from '@/components/ui/spinner';
import { useToast } from '@/components/ui/toast';
import { groupOrderItems } from '@/lib/utils';
import type { OrderItemConfig, GroupedOrderItem } from '@/types/order';

type ConfirmLayer = 'grouped' | 'split' | 'regroup';

export default function ConfirmOrderPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = use(params);
  const router = useRouter();
  const { showToast } = useToast();
  const { order, loading: orderLoading } = useOrder(parseInt(orderId));
  const { mainItems, loading: menuLoading } = useMenu();

  const [layer, setLayer] = useState<ConfirmLayer>('grouped');
  const [splitIndex, setSplitIndex] = useState<number | null>(null);
  const [modifiedItems, setModifiedItems] = useState<{ config: OrderItemConfig; quantity: number }[] | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const groupedItems: GroupedOrderItem[] = useMemo(() => {
    if (!order) return [];
    if (modifiedItems) {
      return groupOrderItems(modifiedItems);
    }
    return groupOrderItems(
      order.items.map((item) => ({
        config: item.configDetail as unknown as OrderItemConfig,
        quantity: item.quantity,
      })),
    );
  }, [order, modifiedItems]);

  if (orderLoading || menuLoading) return <LoadingScreen />;
  if (!order) return <div className="text-center py-8 text-gray-500">Order không tồn tại</div>;

  const handleGroupedItemClick = (index: number) => {
    const item = groupedItems[index];
    if (item.quantity > 1) {
      setSplitIndex(index);
      setLayer('split');
    }
  };

  const handleSplitDone = (items: { config: OrderItemConfig; quantity: number }[]) => {
    // Replace the split group with individual items, keep others
    const allItems: { config: OrderItemConfig; quantity: number }[] = [];
    groupedItems.forEach((g, i) => {
      if (i === splitIndex) {
        allItems.push(...items);
      } else {
        allItems.push({ config: g.config, quantity: g.quantity });
      }
    });
    setModifiedItems(allItems);
    setLayer('regroup');
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      // If items were modified, save them first
      if (modifiedItems) {
        const orderItems = modifiedItems.map((item) => {
          const menuItem = mainItems.find((m) => m.id === item.config.menuItemId);
          const sizeOption = menuItem?.options.find(
            (o) => o.optionType === 'SIZE' && o.label === item.config.size,
          );
          return {
            menuItemId: item.config.menuItemId,
            quantity: item.quantity,
            unitPrice: (menuItem?.sellPrice || 0) + (sizeOption?.surcharge || 0),
            configDetail: item.config,
          };
        });

        await fetch(`/api/orders/${orderId}/items`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: orderItems }),
        });
      }

      // Submit to kitchen
      const res = await fetch(`/api/orders/${orderId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      if (res.ok) {
        showToast('Đã gửi bếp!', 'success');
        router.push('/tables');
      } else {
        const data = await res.json();
        showToast(data.error || 'Lỗi gửi bếp', 'error');
      }
    } catch {
      showToast('Lỗi khi gửi bếp', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">
        Xác nhận Order #{orderId} – {order.table.label}
      </h2>

      {layer === 'grouped' && (
        <ConfirmGrouped
          groupedItems={groupedItems}
          onItemClick={handleGroupedItemClick}
        />
      )}

      {layer === 'split' && splitIndex !== null && (
        <ConfirmSplit
          groupedItem={groupedItems[splitIndex]}
          menuItem={mainItems.find((m) => m.id === groupedItems[splitIndex].config.menuItemId)}
          onDone={handleSplitDone}
          onBack={() => { setLayer('grouped'); setSplitIndex(null); }}
        />
      )}

      {layer === 'regroup' && (
        <ConfirmRegroup groupedItems={groupedItems} />
      )}

      {(layer === 'grouped' || layer === 'regroup') && (
        <div className="flex gap-3 pt-4">
          <Button variant="secondary" className="flex-1" onClick={() => router.back()}>
            Quay lại sửa
          </Button>
          <Button
            className="flex-1"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? 'Đang gửi...' : 'Gửi bếp'}
          </Button>
        </div>
      )}
    </div>
  );
}
