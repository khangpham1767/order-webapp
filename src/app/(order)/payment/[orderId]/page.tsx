'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useOrder } from '@/hooks/use-orders';
import { OrderSummary } from '@/components/order/order-summary';
import { Button } from '@/components/ui/button';
import { LoadingScreen } from '@/components/ui/spinner';
import { formatVND } from '@/lib/utils';
import { useToast } from '@/components/ui/toast';

export default function PaymentPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = use(params);
  const router = useRouter();
  const { showToast } = useToast();
  const { order, loading } = useOrder(parseInt(orderId));
  const [processing, setProcessing] = useState(false);

  if (loading) return <LoadingScreen />;
  if (!order) return <div className="text-center py-8 text-gray-500">Order không tồn tại</div>;
  if (order.status !== 'DONE') {
    return (
      <div className="text-center py-8 text-gray-500">
        Order chưa hoàn thành, không thể thanh toán
      </div>
    );
  }

  const total = order.items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  );

  const handlePayment = async () => {
    setProcessing(true);
    try {
      const res = await fetch(`/api/payments/${orderId}`, { method: 'POST' });
      if (res.ok) {
        showToast('Thanh toán thành công!', 'success');
        router.push('/tables');
      } else {
        const data = await res.json();
        showToast(data.error || 'Lỗi thanh toán', 'error');
      }
    } catch {
      showToast('Lỗi khi thanh toán', 'error');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">
        Thanh toán – {order.table.label}
      </h2>

      <OrderSummary items={order.items} />

      <div className="bg-primary-50 rounded-xl p-4 text-center">
        <p className="text-sm text-gray-600">Tổng thanh toán</p>
        <p className="text-3xl font-bold text-primary-700 mt-1">{formatVND(total)}</p>
      </div>

      <Button
        size="lg"
        className="w-full"
        onClick={handlePayment}
        disabled={processing}
      >
        {processing ? 'Đang xử lý...' : 'Xác nhận thanh toán'}
      </Button>
    </div>
  );
}
