'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { QuantityStepper } from '@/components/ui/quantity-stepper';
import { OptionLayer } from './option-layer';
import type { MenuItemWithOptions } from '@/types/menu';
import type { OrderItemConfig } from '@/types/order';
import type { OptionType } from '@prisma/client';

interface OptionFlowProps {
  menuItem: MenuItemWithOptions;
  addonItems: MenuItemWithOptions[];
  onComplete: (config: OrderItemConfig, quantity: number) => void;
  onCancel: () => void;
}

type Step = 'NOODLE_TYPE' | 'SPECIAL' | 'VEGETABLE' | 'SIZE' | 'ADDONS' | 'QUANTITY';

const STEP_ORDER: Step[] = ['NOODLE_TYPE', 'SPECIAL', 'VEGETABLE', 'SIZE', 'ADDONS', 'QUANTITY'];
const STEP_LABELS: Record<Step, string> = {
  NOODLE_TYPE: 'Loại bánh/sợi',
  SPECIAL: 'Yêu cầu đặc biệt',
  VEGETABLE: 'Rau',
  SIZE: 'Size',
  ADDONS: 'Thêm',
  QUANTITY: 'Số lượng',
};

export function OptionFlow({ menuItem, addonItems, onComplete, onCancel }: OptionFlowProps) {
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
    if (step === 'ADDONS') return addonItems.length > 0;
    return true; // QUANTITY always shown
  });

  const [stepIndex, setStepIndex] = useState(0);
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
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);

  const currentStep = availableSteps[stepIndex];
  const isLastStep = stepIndex === availableSteps.length - 1;
  const isFirstStep = stepIndex === 0;

  const canProceed = () => {
    if (currentStep === 'NOODLE_TYPE') return noodleType !== '';
    if (currentStep === 'SIZE') return size !== '';
    return true;
  };

  const handleNext = () => {
    if (isLastStep) {
      const sizeSurcharge = sizeOptions.find((o) => o.label === size)?.surcharge || 0;
      const config: OrderItemConfig = {
        menuItemId: menuItem.id,
        menuItemName: menuItem.name,
        noodleType,
        specials,
        vegetables,
        size,
        addons: selectedAddons.map((name) => {
          const addon = addonItems.find((a) => a.name === name)!;
          return {
            menuItemId: addon.id,
            name: addon.name,
            quantity: 1,
            price: addon.sellPrice,
          };
        }),
        quantity,
      };
      const unitPrice = menuItem.sellPrice + sizeSurcharge;
      onComplete({ ...config, quantity: 1 }, quantity);
      return;
    }
    setStepIndex((i) => i + 1);
  };

  const handleBack = () => {
    if (isFirstStep) {
      onCancel();
    } else {
      setStepIndex((i) => i - 1);
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="flex items-center gap-1">
        {availableSteps.map((step, i) => (
          <div
            key={step}
            className={`h-1 flex-1 rounded-full ${
              i <= stepIndex ? 'bg-primary-500' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>

      <h2 className="text-lg font-semibold text-gray-900">
        {menuItem.name} — {STEP_LABELS[currentStep]}
      </h2>

      {/* Step content */}
      {currentStep === 'NOODLE_TYPE' && (
        <OptionLayer
          title="Chọn loại bánh/sợi"
          choices={noodleOptions}
          selectedValues={[noodleType]}
          multiple={false}
          required={true}
          onSelect={(v) => setNoodleType(v[0] || '')}
        />
      )}

      {currentStep === 'SPECIAL' && (
        <OptionLayer
          title="Yêu cầu đặc biệt"
          choices={specialOptions}
          selectedValues={specials}
          multiple={true}
          required={false}
          onSelect={setSpecials}
        />
      )}

      {currentStep === 'VEGETABLE' && (
        <OptionLayer
          title="Chọn rau"
          choices={vegetableOptions}
          selectedValues={vegetables}
          multiple={false}
          required={false}
          onSelect={setVegetables}
        />
      )}

      {currentStep === 'SIZE' && (
        <OptionLayer
          title="Chọn size"
          choices={sizeOptions}
          selectedValues={[size]}
          multiple={false}
          required={true}
          onSelect={(v) => setSize(v[0] || '')}
        />
      )}

      {currentStep === 'ADDONS' && (
        <OptionLayer
          title="Thêm phụ phí"
          choices={addonItems.map((a) => ({
            id: a.id,
            label: a.name,
            isDefault: false,
            surcharge: a.sellPrice,
          }))}
          selectedValues={selectedAddons}
          multiple={true}
          required={false}
          onSelect={setSelectedAddons}
        />
      )}

      {currentStep === 'QUANTITY' && (
        <div className="flex flex-col items-center gap-4 py-8">
          <p className="text-gray-600">Số lượng</p>
          <QuantityStepper value={quantity} onChange={setQuantity} min={1} max={20} />
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-3">
        <Button variant="secondary" className="flex-1" onClick={handleBack}>
          {isFirstStep ? 'Huỷ' : 'Quay lại'}
        </Button>
        <Button
          className="flex-1"
          onClick={handleNext}
          disabled={!canProceed()}
        >
          {isLastStep ? 'Thêm vào đơn' : 'Tiếp tục'}
        </Button>
      </div>
    </div>
  );
}
