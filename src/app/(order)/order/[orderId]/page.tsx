'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { useOrder } from '@/hooks/use-orders';
import { OrderSummary } from '@/components/order/order-summary';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LoadingScreen } from '@/components/ui/spinner';
import { ORDER_STATUS_LABELS } from '@/lib/constants';
import { useToast } from '@/components/ui/toast';

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = use(params);
  const router = useRouter();
  const { showToast } = useToast();
  const { order, loading } = useOrder(parseInt(orderId));

  if (loading) return <LoadingScreen />;
  if (!order) return <div className="text-center py-8 text-gray-500">Order không tồn tại</div>;

  const canEdit = order.status === 'DRAFT' || order.status === 'QUEUED';
  const canCancel = order.status === 'DRAFT' || order.status === 'QUEUED';
  const canPay = order.status === 'DONE';
  const canAddMore = order.status === 'COOKING' || order.status === 'DONE';

  const handleCancel = async () => {
    if (!confirm('Bạn chắc chắn muốn huỷ order?')) return;
    try {
      const res = await fetch(`/api/orders/${orderId}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Đã huỷ order', 'success');
        router.push('/tables');
      } else {
        const data = await res.json();
        showToast(data.error || 'Không thể huỷ', 'error');
      }
    } catch {
      showToast('Lỗi khi huỷ order', 'error');
    }
  };

  const handleAddMore = async () => {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tableId: order.tableId, items: [] }),
      });
      if (res.ok) {
        const newOrder = await res.json();
        router.push(`/order/new?tableId=${order.tableId}&orderId=${newOrder.id}`);
      }
    } catch {
      showToast('Lỗi khi tạo order mới', 'error');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Order #{order.id} – {order.table.label}
          </h2>
          <Badge
            variant={order.status.toLowerCase() as 'draft' | 'queued' | 'cooking' | 'done' | 'paid'}
            className="mt-1"
          >
            {ORDER_STATUS_LABELS[order.status]}
          </Badge>
        </div>
      </div>

      <OrderSummary items={order.items} />

      <div className="flex flex-col gap-2 pt-4">
        {canEdit && (
          <Button onClick={() => router.push(`/order/${orderId}/edit`)} variant="secondary">
            Chỉnh sửa
          </Button>
        )}
        {canAddMore && (
          <Button onClick={handleAddMore}>
            Order thêm
          </Button>
        )}
        {canPay && (
          <Button onClick={() => router.push(`/payment/${orderId}`)}>
            Tính tiền
          </Button>
        )}
        {canCancel && (
          <Button variant="danger" onClick={handleCancel}>
            Huỷ order
          </Button>
        )}
      </div>
    </div>
  );
}
