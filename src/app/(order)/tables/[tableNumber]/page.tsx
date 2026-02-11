'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingScreen } from '@/components/ui/spinner';
import type { OrderWithItems } from '@/types/order';

export default function TableDetailPage({
  params,
}: {
  params: Promise<{ tableNumber: string }>;
}) {
  const { tableNumber } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTable() {
      try {
        const tablesRes = await fetch('/api/tables');
        const tables = await tablesRes.json();
        const table = tables.find((t: { number: number }) => t.number === parseInt(tableNumber));

        if (!table) {
          router.push('/tables');
          return;
        }

        if (table.activeOrderId) {
          router.push(`/order/${table.activeOrderId}`);
        } else {
          const orderRes = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tableId: table.id, items: [] }),
          });
          const order: OrderWithItems = await orderRes.json();
          router.push(`/order/new?tableId=${table.id}&orderId=${order.id}`);
        }
      } catch {
        router.push('/tables');
      } finally {
        setLoading(false);
      }
    }
    loadTable();
  }, [tableNumber, router]);

  if (loading) return <LoadingScreen />;
  return null;
}
