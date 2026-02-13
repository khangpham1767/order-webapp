'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMenu } from '@/hooks/use-menu';
import { useOrderDraft } from '@/hooks/use-order-draft';
import { MenuItemPicker } from '@/components/order/menu-item-picker';
import { OptionFlow } from '@/components/order/option-flow';
import { VariantPicker } from '@/components/order/variant-picker';
import { OrderItemCard } from '@/components/order/order-item-card';
import { Button } from '@/components/ui/button';
import { LoadingScreen } from '@/components/ui/spinner';
import type { MenuItemWithOptions } from '@/types/menu';
import type { OrderItemConfig } from '@/types/order';

function NewOrderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tableId = searchParams.get('tableId');
  const orderId = searchParams.get('orderId');

  const { mainItems, addonItems, loading: menuLoading } = useMenu();
  const { items, totalQuantity, addItem, removeItem, clear } = useOrderDraft();
  const [selectedMain, setSelectedMain] = useState<MenuItemWithOptions | null>(null);
  const [selectedAddonForVariant, setSelectedAddonForVariant] = useState<MenuItemWithOptions | null>(null);

  if (menuLoading) return <LoadingScreen />;

  const handleMainSelect = (item: MenuItemWithOptions) => {
    setSelectedMain(item);
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
    const variantOption = selectedAddonForVariant.options.find(
      (o) => o.optionType === 'VARIANT' && o.label === variant,
    );
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
    const unitPrice = selectedAddonForVariant.sellPrice + (variantOption?.surcharge || 0);
    addItem(config, 1);
    setSelectedAddonForVariant(null);
  };

  const handleOptionComplete = (config: OrderItemConfig, quantity: number) => {
    addItem(config, quantity);
    setSelectedMain(null);
  };

  const handleSubmit = async () => {
    if (!orderId || items.length === 0) return;

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
      const sizeSurcharge = sizeOption?.surcharge || 0;
      const variantSurcharge = variantOption?.surcharge || 0;
      const basePrice = menuItem?.sellPrice || 0;

      return {
        menuItemId: item.config.menuItemId,
        quantity: item.quantity,
        unitPrice: basePrice + sizeSurcharge + variantSurcharge,
        configDetail: item.config,
        notes: item.notes,
      };
    });

    try {
      await fetch(`/api/orders/${orderId}/items`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: orderItems }),
      });
      router.push(`/order/${orderId}/confirm`);
    } catch (error) {
      console.error('Failed to save order items:', error);
    }
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
        Order mới {tableId && `– Bàn ${tableId}`}
      </h2>

      <MenuItemPicker
        mainItems={mainItems}
        addonItems={addonItems}
        onSelectMain={handleMainSelect}
        onSelectAddon={handleAddonSelect}
      />

      {/* Draft items preview */}
      {items.length > 0 && (
        <div className="space-y-2 mt-6">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">Đã chọn ({totalQuantity})</h3>
            <button onClick={clear} className="text-sm text-red-500 hover:text-red-700">
              Xoá tất cả
            </button>
          </div>
          {items.map((item) => {
            const menuItem = [...mainItems, ...addonItems].find(
              (m) => m.id === item.config.menuItemId,
            );
            const sizeOption = menuItem?.options.find(
              (o) => o.optionType === 'SIZE' && o.label === item.config.size,
            );
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
                notes={item.notes}
                onRemove={() => removeItem(item.id)}
              />
            );
          })}
          <Button className="w-full mt-3" onClick={handleSubmit}>
            Xác nhận đơn
          </Button>
        </div>
      )}
    </div>
  );
}

export default function NewOrderPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <NewOrderContent />
    </Suspense>
  );
}
