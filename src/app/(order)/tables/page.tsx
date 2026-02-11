'use client';

import { useTables } from '@/hooks/use-tables';
import { TableGrid } from '@/components/order/table-grid';
import { LoadingScreen } from '@/components/ui/spinner';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function TablesPage() {
  const { tables, loading } = useTables();

  if (loading) return <LoadingScreen />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Chọn bàn</h2>
        <Link href="/order/active">
          <Button variant="ghost" size="sm">Đơn đang xử lý</Button>
        </Link>
      </div>
      <TableGrid tables={tables} />
    </div>
  );
}
