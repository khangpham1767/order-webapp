'use client';

import { useRouter } from 'next/navigation';
import { useMenu } from '@/hooks/use-menu';
import { MenuItemList } from '@/components/accounting/menu-item-list';
import { Button } from '@/components/ui/button';
import { LoadingScreen } from '@/components/ui/spinner';
import { useToast } from '@/components/ui/toast';

export default function MenuPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { menuItems, loading, refetch } = useMenu(false);

  const handleToggleActive = async (itemId: number) => {
    try {
      const res = await fetch(`/api/menu/${itemId}`, { method: 'PATCH' });
      if (res.ok) {
        await refetch();
      } else {
        const data = await res.json();
        showToast(data.error || 'Lỗi cập nhật', 'error');
      }
    } catch {
      showToast('Lỗi khi cập nhật', 'error');
    }
  };

  const handleEdit = (itemId: number) => {
    router.push(`/menu/${itemId}/edit`);
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Quản lý menu</h2>
        <Button onClick={() => router.push('/menu/new')}>Thêm món mới</Button>
      </div>
      <MenuItemList
        items={menuItems}
        onToggleActive={handleToggleActive}
        onEdit={handleEdit}
      />
    </div>
  );
}
