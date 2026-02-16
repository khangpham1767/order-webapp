'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { QuantityStepper } from '@/components/ui/quantity-stepper';
import { OptionLayer } from './option-layer';
import type { MenuItemWithOptions } from '@/types/menu';
import type { OrderItemConfig } from '@/types/order';
import type { OptionType } from '@prisma/client';

interface OptionFlowProps {
  menuItem: MenuItemWithOptions;
  onComplete: (config: OrderItemConfig, quantity: number) => void;
  onCancel: () => void;
}

type Step = 'NOODLE_TYPE' | 'SPECIAL' | 'VEGETABLE' | 'SIZE';

const STEP_ORDER: Step[] = ['NOODLE_TYPE', 'SPECIAL', 'VEGETABLE', 'SIZE'];
const STEP_LABELS: Record<Step, string> = {
  NOODLE_TYPE: 'Loại bánh/sợi',
  SPECIAL: 'Yêu cầu đặc biệt',
  VEGETABLE: 'Rau',
  SIZE: 'Size',
};

export function OptionFlow({ menuItem, onComplete, onCancel }: OptionFlowProps) {
  const optionsByType = (type: OptionType) =>
    menuItem.options
      .filter((o) => o.optionType === type)
      .map((o) => ({ id: o.id, label: o.label, isDefault: o.isDefault, surcharge: o.surcharge }));

  const noodleOptions = optionsByType('NOODLE_TYPE');
  const specialOptions = optionsByType('SPECIAL');
  const vegetableOptions = optionsByType('VEGETABLE');
  const sizeOptions = optionsByType('SIZE');

  // Filter steps that have options
  const availableSteps = STEP_ORDER.filter((step) => {
    if (step === 'NOODLE_TYPE') return noodleOptions.length > 0;
    if (step === 'SPECIAL') return specialOptions.length > 0;
    if (step === 'VEGETABLE') return vegetableOptions.length > 0;
    if (step === 'SIZE') return sizeOptions.length > 0;
    return true;
  });

  const [expandedSection, setExpandedSection] = useState<Step | null>(null);
  const [noodleType, setNoodleType] = useState<string>(
    noodleOptions.find((o) => o.isDefault)?.label || noodleOptions[0]?.label || '',
  );
  const [specials, setSpecials] = useState<string[]>([]);
  const [vegetables, setVegetables] = useState<string[]>(
    vegetableOptions.filter((o) => o.isDefault).map((o) => o.label),
  );
  const [size, setSize] = useState<string>(
    sizeOptions.find((o) => o.isDefault)?.label || sizeOptions[0]?.label || 'Tô thường',
  );
  const [quantity, setQuantity] = useState(1);

  const toggleSection = (step: Step) => {
    setExpandedSection((prev) => (prev === step ? null : step));
  };

  const getSectionDisplayValue = (step: Step): string => {
    switch (step) {
      case 'NOODLE_TYPE':
        return noodleType || 'Chưa chọn';
      case 'SPECIAL':
        return specials.length > 0 ? specials.join(', ') : 'Chưa chọn';
      case 'VEGETABLE':
        return vegetables.length > 0 ? vegetables.join(', ') : 'Chưa chọn';
      case 'SIZE':
        return size || 'Chưa chọn';
    }
  };

  const handleSubmit = () => {
    const config: OrderItemConfig = {
      menuItemId: menuItem.id,
      menuItemName: menuItem.name,
      noodleType,
      specials,
      vegetables,
      size,
      addons: [],
      quantity,
    };
    onComplete({ ...config, quantity: 1 }, quantity);
  };

  const renderSectionContent = (step: Step) => {
    switch (step) {
      case 'NOODLE_TYPE':
        return (
          <OptionLayer
            title="Chọn loại bánh/sợi"
            choices={noodleOptions}
            selectedValues={[noodleType]}
            multiple={false}
            required={true}
            onSelect={(v) => setNoodleType(v[0] || '')}
          />
        );
      case 'SPECIAL':
        return (
          <OptionLayer
            title="Yêu cầu đặc biệt"
            choices={specialOptions}
            selectedValues={specials}
            multiple={true}
            required={false}
            onSelect={setSpecials}
          />
        );
      case 'VEGETABLE':
        return (
          <OptionLayer
            title="Chọn rau"
            choices={vegetableOptions}
            selectedValues={vegetables}
            multiple={false}
            required={false}
            onSelect={setVegetables}
          />
        );
      case 'SIZE':
        return (
          <OptionLayer
            title="Chọn size"
            choices={sizeOptions}
            selectedValues={[size]}
            multiple={false}
            required={true}
            onSelect={(v) => setSize(v[0] || '')}
          />
        );
    }
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-theme(spacing.32))]">
      <div className="flex-1 space-y-3">
        <h2 className="text-lg font-semibold text-gray-900">{menuItem.name}</h2>

        {/* Accordion sections */}
        {availableSteps.map((step) => {
          const isExpanded = expandedSection === step;
          const displayValue = getSectionDisplayValue(step);
          const hasValue = displayValue !== 'Chưa chọn';

          return (
            <div key={step} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                type="button"
                className="flex items-center justify-between w-full px-4 py-3 text-left bg-white hover:bg-gray-50 transition-colors"
                onClick={() => toggleSection(step)}
              >
                <span className="text-sm font-medium text-gray-700">
                  {STEP_LABELS[step]}
                </span>
                <span className="flex items-center gap-2">
                  <span
                    className={cn(
                      'text-sm',
                      hasValue ? 'text-gray-900' : 'text-gray-400',
                    )}
                  >
                    {displayValue}
                  </span>
                  <svg
                    className={cn(
                      'w-4 h-4 text-gray-400 transition-transform',
                      isExpanded && 'rotate-180',
                    )}
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </span>
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 border-t border-gray-100">
                  <div className="pt-3">{renderSectionContent(step)}</div>
                </div>
              )}
            </div>
          );
        })}

        {/* Quantity - always visible, not collapsible */}
        <div className="border border-gray-200 rounded-lg px-4 py-3 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Số lượng</span>
          <QuantityStepper value={quantity} onChange={setQuantity} min={1} max={20} />
        </div>
      </div>

      {/* Bottom buttons */}
      <div className="flex gap-3 mt-auto pt-6">
        <Button variant="secondary" className="flex-1" onClick={onCancel}>
          Quay lại
        </Button>
        <Button className="flex-1" onClick={handleSubmit}>
          Thêm vào đơn
        </Button>
      </div>
    </div>
  );
}
