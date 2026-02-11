'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { MenuItemWithOptions, CreateMenuItemPayload, UpdateMenuItemPayload } from '@/types/menu';
import type { OptionType } from '@prisma/client';

interface OptionRow {
  key: string;
  optionType: OptionType;
  label: string;
  surcharge: number;
  isDefault: boolean;
}

interface MenuItemFormProps {
  initialData?: MenuItemWithOptions;
  onSubmit: (data: CreateMenuItemPayload | UpdateMenuItemPayload) => Promise<void>;
  onCancel: () => void;
  isEdit?: boolean;
}

const OPTION_GROUPS: { type: OptionType; label: string }[] = [
  { type: 'NOODLE_TYPE', label: 'Loại mì' },
  { type: 'SPECIAL', label: 'Đặc biệt' },
  { type: 'VEGETABLE', label: 'Rau' },
  { type: 'SIZE', label: 'Size' },
];

function generateKey() {
  return Math.random().toString(36).substring(2, 9);
}

export function MenuItemForm({ initialData, onSubmit, onCancel, isEdit }: MenuItemFormProps) {
  const [name, setName] = useState(initialData?.name ?? '');
  const [sellPrice, setSellPrice] = useState(initialData?.sellPrice?.toString() ?? '');
  const [costPrice, setCostPrice] = useState(initialData?.costPrice?.toString() ?? '');
  const [type, setType] = useState<'MAIN' | 'ADDON'>(initialData?.type ?? 'MAIN');
  const [active, setActive] = useState(initialData?.active ?? true);
  const [options, setOptions] = useState<OptionRow[]>(() => {
    if (!initialData?.options) return [];
    return initialData.options.map((opt) => ({
      key: generateKey(),
      optionType: opt.optionType as OptionType,
      label: opt.label,
      surcharge: opt.surcharge,
      isDefault: opt.isDefault,
    }));
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Tên món là bắt buộc';
    if (Number(sellPrice) < 0) newErrors.sellPrice = 'Giá bán phải >= 0';
    if (Number(costPrice) < 0) newErrors.costPrice = 'Giá vốn phải >= 0';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      const optionPayload = type === 'MAIN' && options.length > 0
        ? options.map((opt, i) => ({
            optionType: opt.optionType,
            label: opt.label,
            isDefault: opt.isDefault,
            surcharge: opt.surcharge,
            sortOrder: i,
          }))
        : undefined;

      if (isEdit) {
        const payload: UpdateMenuItemPayload = {
          name: name.trim(),
          sellPrice: Number(sellPrice),
          costPrice: Number(costPrice),
          active,
          options: optionPayload,
        };
        await onSubmit(payload);
      } else {
        const payload: CreateMenuItemPayload = {
          name: name.trim(),
          sellPrice: Number(sellPrice),
          costPrice: Number(costPrice),
          type,
          options: optionPayload,
        };
        await onSubmit(payload);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const addOption = (optionType: OptionType) => {
    setOptions((prev) => [
      ...prev,
      { key: generateKey(), optionType, label: '', surcharge: 0, isDefault: false },
    ]);
  };

  const removeOption = (key: string) => {
    setOptions((prev) => prev.filter((o) => o.key !== key));
  };

  const updateOption = (key: string, field: keyof OptionRow, value: string | number | boolean) => {
    setOptions((prev) =>
      prev.map((o) => (o.key === key ? { ...o, [field]: value } : o)),
    );
  };

  return (
    <div className="space-y-6">
      <Input
        label="Tên món"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={errors.name}
        placeholder="Nhập tên món..."
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Giá bán (VND)"
          type="number"
          value={sellPrice}
          onChange={(e) => setSellPrice(e.target.value)}
          error={errors.sellPrice}
          min={0}
        />
        <Input
          label="Giá vốn (VND)"
          type="number"
          value={costPrice}
          onChange={(e) => setCostPrice(e.target.value)}
          error={errors.costPrice}
          min={0}
        />
      </div>

      {!isEdit && (
        <Select
          label="Loại"
          value={type}
          onChange={(e) => setType(e.target.value as 'MAIN' | 'ADDON')}
          options={[
            { value: 'MAIN', label: 'Món chính' },
            { value: 'ADDON', label: 'Thêm / Phụ phí' },
          ]}
        />
      )}

      {isEdit && (
        <div className="flex items-center gap-2">
          <Switch checked={active} onChange={setActive} label="Đang bán" />
        </div>
      )}

      {type === 'MAIN' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Tùy chọn</h3>
          {OPTION_GROUPS.map((group) => {
            const groupOptions = options.filter((o) => o.optionType === group.type);
            return (
              <Card key={group.type}>
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-700">{group.label}</h4>
                  {groupOptions.map((opt) => (
                    <div key={opt.key} className="flex items-center gap-2">
                      <Input
                        className="flex-1"
                        placeholder="Tên"
                        value={opt.label}
                        onChange={(e) => updateOption(opt.key, 'label', e.target.value)}
                      />
                      <Input
                        className="w-28"
                        type="number"
                        placeholder="Phụ thu"
                        value={opt.surcharge || ''}
                        onChange={(e) => updateOption(opt.key, 'surcharge', Number(e.target.value))}
                        min={0}
                      />
                      <Switch
                        checked={opt.isDefault}
                        onChange={(v) => updateOption(opt.key, 'isDefault', v)}
                        label="Mặc định"
                      />
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => removeOption(opt.key)}
                      >
                        Xóa
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => addOption(group.type)}
                  >
                    + Thêm lựa chọn
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <div className="flex gap-3">
        <Button variant="secondary" className="flex-1" onClick={onCancel} disabled={submitting}>
          Hủy
        </Button>
        <Button className="flex-1" onClick={handleSubmit} disabled={submitting}>
          {submitting ? 'Đang lưu...' : isEdit ? 'Cập nhật' : 'Tạo món'}
        </Button>
      </div>
    </div>
  );
}
