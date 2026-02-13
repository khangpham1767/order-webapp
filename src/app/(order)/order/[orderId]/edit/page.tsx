'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useOrder } from '@/hooks/use-orders';
import { useMenu } from '@/hooks/use-menu';
import { useOrderDraft, type DraftItem } from '@/hooks/use-order-draft';
import { MenuItemPicker } from '@/components/order/menu-item-picker';
import { OptionFlow } from '@/components/order/option-flow';
import { VariantPicker } from '@/components/order/variant-picker';
import { OrderItemCard } from '@/components/order/order-item-card';
import { Button } from '@/components/ui/button';
import { LoadingScreen } from '@/components/ui/spinner';
import { useToast } from '@/components/ui/toast';
import type { MenuItemWithOptions } from '@/types/menu';
import type { OrderItemConfig } from '@/types/order';

export default function EditOrderPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = use(params);
  const router = useRouter();
  const { showToast } = useToast();
  const { order, loading: orderLoading } = useOrder(parseInt(orderId));
  const { mainItems, addonItems, loading: menuLoading } = useMenu();
  const { items, setItems, addItem, removeItem, totalQuantity, clear } = useOrderDraft();
  const [selectedMain, setSelectedMain] = useState<MenuItemWithOptions | null>(null);
  const [selectedAddonForVariant, setSelectedAddonForVariant] = useState<MenuItemWithOptions | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (order && !initialized) {
      const draftItems: DraftItem[] = order.items.map((item, idx) => ({
        id: `existing-${idx}`,
        config: item.configDetail as unknown as OrderItemConfig,
        quantity: item.quantity,
        notes: item.notes || undefined,
      }));
      setItems(draftItems);
      setInitialized(true);
    }
  }, [order, initialized, setItems]);

  if (orderLoading || menuLoading) return <LoadingScreen />;
  if (!order) return <div className="text-center py-8 text-gray-500">Order không tồn tại</div>;
  if (order.status !== 'DRAFT' && order.status !== 'QUEUED') {
    return <div className="text-center py-8 text-gray-500">Không thể chỉnh sửa order ở trạng thái này</div>;
  }

  const handleOptionComplete = (config: OrderItemConfig, quantity: number) => {
    addItem(config, quantity);
    setSelectedMain(null);
  };

  const handleSave = async () => {
    const orderItems = items.map((item) => {
      const menuItem = [...mainItems, ...addonItems].find(
        (m) => m.id === item.config.menuItemId,
      );
      const sizeOption = menuItem?.options.find(
        (o) => o.optionType === 'SIZE' && o.label === item.config.size,
      );
      const variantOption = item.config.variant
        ? menuItem?.options.find((o) => o.optionType === 'VARIANT' && o.label === item.config.variant)
        : undefined;
      return {
        menuItemId: item.config.menuItemId,
        quantity: item.quantity,
        unitPrice: (menuItem?.sellPrice || 0) + (sizeOption?.surcharge || 0) + (variantOption?.surcharge || 0),
        configDetail: item.config,
        notes: item.notes,
      };
    });

    try {
      const res = await fetch(`/api/orders/${orderId}/items`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: orderItems }),
      });
      if (res.ok) {
        showToast('Đã cập nhật order', 'success');
        router.push(`/order/${orderId}/confirm`);
      } else {
        const data = await res.json();
        showToast(data.error || 'Lỗi cập nhật', 'error');
      }
    } catch {
      showToast('Lỗi khi cập nhật', 'error');
    }
  };

  const handleAddonSelect = (item: MenuItemWithOptions) => {
    const hasVariants = item.options.some((o) => o.optionType === 'VARIANT');
    if (hasVariants) {
      setSelectedAddonForVariant(item);
      return;
    }
    const config: OrderItemConfig = {
      menuItemId: item.id,
      menuItemName: item.name,
      noodleType: '',
      specials: [],
      vegetables: [],
      size: '',
      addons: [],
      quantity: 1,
    };
    addItem(config, 1);
  };

  const handleVariantSelect = (variant: string) => {
    if (!selectedAddonForVariant) return;
    const config: OrderItemConfig = {
      menuItemId: selectedAddonForVariant.id,
      menuItemName: selectedAddonForVariant.name,
      noodleType: '',
      specials: [],
      vegetables: [],
      size: '',
      addons: [],
      quantity: 1,
      variant,
    };
    addItem(config, 1);
    setSelectedAddonForVariant(null);
  };

  if (selectedMain) {
    return (
      <OptionFlow
        menuItem={selectedMain}
        onComplete={handleOptionComplete}
        onCancel={() => setSelectedMain(null)}
      />
    );
  }

  if (selectedAddonForVariant) {
    return (
      <VariantPicker
        menuItem={selectedAddonForVariant}
        onSelect={handleVariantSelect}
        onCancel={() => setSelectedAddonForVariant(null)}
      />
    );
  }

  return (
    <div className="space-y-4 pb-4">
      <h2 className="text-xl font-bold text-gray-900">
        Sửa Order #{orderId} – {order.table.label}
      </h2>

      <MenuItemPicker
        mainItems={mainItems}
        addonItems={addonItems}
        onSelectMain={(item) => setSelectedMain(item)}
        onSelectAddon={handleAddonSelect}
      />

      {items.length > 0 && (
        <div className="space-y-2 mt-6">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">Đã chọn ({totalQuantity})</h3>
            <button onClick={clear} className="text-sm text-red-500 hover:text-red-700">
              Xoá tất cả
            </button>
          </div>
          {items.map((item) => {
            const menuItem = [...mainItems, ...addonItems].find((m) => m.id === item.config.menuItemId);
            const sizeOption = menuItem?.options.find((o) => o.optionType === 'SIZE' && o.label === item.config.size);
            const variantOption = item.config.variant
              ? menuItem?.options.find((o) => o.optionType === 'VARIANT' && o.label === item.config.variant)
              : undefined;
            const unitPrice = (menuItem?.sellPrice || 0) + (sizeOption?.surcharge || 0) + (variantOption?.surcharge || 0);
            return (
              <OrderItemCard
                key={item.id}
                config={item.config}
                quantity={item.quantity}
                unitPrice={unitPrice}
                onRemove={() => removeItem(item.id)}
              />
            );
          })}
          <div className="flex gap-3 mt-3">
            <Button variant="secondary" className="flex-1" onClick={() => router.back()}>
              Huỷ
            </Button>
            <Button className="flex-1" onClick={handleSave}>
              Lưu thay đổi
            </Button>
          </div>
        </div>
      )}

      {items.length === 0 && (
        <div className="mt-6">
          <Button variant="secondary" className="w-full" onClick={() => router.back()}>
            Huỷ
          </Button>
        </div>
      )}
    </div>
  );
}
