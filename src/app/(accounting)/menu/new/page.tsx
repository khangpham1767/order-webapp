'use client';

import { useRouter } from 'next/navigation';
import { MenuItemForm } from '@/components/accounting/menu-item-form';
import { useToast } from '@/components/ui/toast';
import type { CreateMenuItemPayload, UpdateMenuItemPayload } from '@/types/menu';

export default function NewMenuItemPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const handleSubmit = async (data: CreateMenuItemPayload | UpdateMenuItemPayload) => {
    const res = await fetch('/api/menu', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      showToast('Tạo món thành công!', 'success');
      router.push('/menu');
    } else {
      const result = await res.json();
      showToast(result.error || 'Lỗi tạo món', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Thêm món mới</h2>
      <MenuItemForm
        onSubmit={handleSubmit}
        onCancel={() => router.push('/menu')}
      />
    </div>
  );
}
