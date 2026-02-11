'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MenuItemForm } from '@/components/accounting/menu-item-form';
import { LoadingScreen } from '@/components/ui/spinner';
import { useToast } from '@/components/ui/toast';
import type { MenuItemWithOptions, CreateMenuItemPayload, UpdateMenuItemPayload } from '@/types/menu';

export default function EditMenuItemPage({
  params,
}: {
  params: Promise<{ itemId: string }>;
}) {
  const { itemId } = use(params);
  const router = useRouter();
  const { showToast } = useToast();
  const [item, setItem] = useState<MenuItemWithOptions | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/menu/${itemId}`)
      .then((res) => res.json())
      .then((data) => setItem(data))
      .catch(() => showToast('Lỗi tải dữ liệu', 'error'))
      .finally(() => setLoading(false));
  }, [itemId, showToast]);

  const handleSubmit = async (data: CreateMenuItemPayload | UpdateMenuItemPayload) => {
    const res = await fetch(`/api/menu/${itemId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      showToast('Cập nhật thành công!', 'success');
      router.push('/menu');
    } else {
      const result = await res.json();
      showToast(result.error || 'Lỗi cập nhật', 'error');
    }
  };

  if (loading) return <LoadingScreen />;
  if (!item) return <div className="text-center py-8 text-gray-500">Không tìm thấy món</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Sửa: {item.name}</h2>
      <MenuItemForm
        initialData={item}
        onSubmit={handleSubmit}
        onCancel={() => router.push('/menu')}
        isEdit
      />
    </div>
  );
}
