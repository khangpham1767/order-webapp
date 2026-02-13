'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { OptionLayer } from './option-layer';
import type { MenuItemWithOptions } from '@/types/menu';

interface VariantPickerProps {
  menuItem: MenuItemWithOptions;
  onSelect: (variant: string) => void;
  onCancel: () => void;
}

export function VariantPicker({ menuItem, onSelect, onCancel }: VariantPickerProps) {
  const variantOptions = menuItem.options
    .filter((o) => o.optionType === 'VARIANT')
    .map((o) => ({ id: o.id, label: o.label, isDefault: o.isDefault, surcharge: o.surcharge }));

  const [selected, setSelected] = useState<string>(
    variantOptions.find((o) => o.isDefault)?.label || '',
  );

  return (
    <div className="flex flex-col min-h-[calc(100vh-theme(spacing.32))]">
      <div className="space-y-6 flex-1">
        <h2 className="text-lg font-semibold text-gray-900">
          {menuItem.name} — Chọn loại
        </h2>
        <OptionLayer
          title="Chọn loại"
          choices={variantOptions}
          selectedValues={selected ? [selected] : []}
          multiple={false}
          required={true}
          onSelect={(v) => setSelected(v[0] || '')}
          basePrice={menuItem.sellPrice}
        />
      </div>
      <div className="flex gap-3 mt-auto pt-6">
        <Button variant="secondary" className="flex-1" onClick={onCancel}>
          Huỷ
        </Button>
        <Button
          className="flex-1"
          onClick={() => onSelect(selected)}
          disabled={!selected}
        >
          Thêm vào đơn
        </Button>
      </div>
    </div>
  );
}
