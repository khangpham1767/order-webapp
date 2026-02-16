'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { OptionLayer } from './option-layer';
import type { OrderItemConfig, GroupedOrderItem } from '@/types/order';
import { splitGroupedItem } from '@/lib/utils';
import type { MenuItemWithOptions } from '@/types/menu';

interface ConfirmSplitProps {
  groupedItem: GroupedOrderItem;
  menuItem?: MenuItemWithOptions;
  onDone: (items: { config: OrderItemConfig; quantity: number }[]) => void;
  onBack: () => void;
}

export function ConfirmSplit({ groupedItem, menuItem, onDone, onBack }: ConfirmSplitProps) {
  const [splitItems, setSplitItems] = useState(() =>
    splitGroupedItem(groupedItem).map((item) => ({
      ...item,
      config: { ...item.config },
    })),
  );

  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleUpdateItem = (index: number, field: string, value: string | string[]) => {
    setSplitItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              config: { ...item.config, [field]: value },
            }
          : item,
      ),
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
          {groupedItem.quantity === 1 ? 'Chỉnh tùy chọn' : `Tách ${groupedItem.quantity} tô – Chỉnh riêng từng tô`}
        </h3>
      </div>

      {splitItems.map((item, index) => {
        const isEditing = editingIndex === index;
        const details: string[] = [];
        if (item.config.noodleType) details.push(item.config.noodleType);
        if (item.config.size) details.push(item.config.size);
        if (item.config.specials?.length) details.push(item.config.specials.join(', '));

        return (
          <Card key={index} className={isEditing ? 'border-primary-500' : ''}>
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setEditingIndex(isEditing ? null : index)}
            >
              <div>
                <span className="font-medium text-gray-900">
                  Tô {index + 1}:
                </span>
                <span className="text-gray-600 ml-2">{details.join(' – ')}</span>
              </div>
              <span className="text-gray-400">{isEditing ? '▲' : '▼'}</span>
            </div>

            {isEditing && menuItem && (
              <div className="mt-4 space-y-4 border-t pt-4">
                {menuItem.options.filter((o) => o.optionType === 'NOODLE_TYPE').length > 0 && (
                  <OptionLayer
                    title="Loại bánh/sợi"
                    choices={menuItem.options
                      .filter((o) => o.optionType === 'NOODLE_TYPE')
                      .map((o) => ({ id: o.id, label: o.label, isDefault: o.isDefault, surcharge: o.surcharge }))}
                    selectedValues={[item.config.noodleType]}
                    multiple={false}
                    required={true}
                    onSelect={(v) => handleUpdateItem(index, 'noodleType', v[0] || '')}
                  />
                )}
                {menuItem.options.filter((o) => o.optionType === 'SPECIAL').length > 0 && (
                  <OptionLayer
                    title="Yêu cầu đặc biệt"
                    choices={menuItem.options
                      .filter((o) => o.optionType === 'SPECIAL')
                      .map((o) => ({ id: o.id, label: o.label, isDefault: o.isDefault, surcharge: o.surcharge }))}
                    selectedValues={item.config.specials}
                    multiple={true}
                    required={false}
                    onSelect={(v) => handleUpdateItem(index, 'specials', v)}
                  />
                )}
                {menuItem.options.filter((o) => o.optionType === 'VEGETABLE').length > 0 && (
                  <OptionLayer
                    title="Rau"
                    choices={menuItem.options
                      .filter((o) => o.optionType === 'VEGETABLE')
                      .map((o) => ({ id: o.id, label: o.label, isDefault: o.isDefault, surcharge: o.surcharge }))}
                    selectedValues={item.config.vegetables}
                    multiple={false}
                    required={false}
                    onSelect={(v) => handleUpdateItem(index, 'vegetables', v)}
                  />
                )}
                {menuItem.options.filter((o) => o.optionType === 'SIZE').length > 0 && (
                  <OptionLayer
                    title="Size"
                    choices={menuItem.options
                      .filter((o) => o.optionType === 'SIZE')
                      .map((o) => ({ id: o.id, label: o.label, isDefault: o.isDefault, surcharge: o.surcharge }))}
                    selectedValues={[item.config.size]}
                    multiple={false}
                    required={true}
                    onSelect={(v) => handleUpdateItem(index, 'size', v[0] || '')}
                  />
                )}
              </div>
            )}
          </Card>
        );
      })}

      <div className="flex gap-3">
        <Button variant="secondary" className="flex-1" onClick={onBack}>
          Quay lại
        </Button>
        <Button className="flex-1" onClick={() => onDone(splitItems)}>
          Xong
        </Button>
      </div>
    </div>
  );
}
