'use client';

import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { formatVND } from '@/lib/utils';

interface OptionChoice {
  id: number;
  label: string;
  isDefault: boolean;
  surcharge: number;
}

interface OptionLayerProps {
  title: string;
  choices: OptionChoice[];
  selectedValues: string[];
  multiple: boolean;
  required: boolean;
  onSelect: (values: string[]) => void;
}

export function OptionLayer({
  title,
  choices,
  selectedValues,
  multiple,
  required,
  onSelect,
}: OptionLayerProps) {
  const handleChoiceClick = (label: string) => {
    if (multiple) {
      if (selectedValues.includes(label)) {
        onSelect(selectedValues.filter((v) => v !== label));
      } else {
        onSelect([...selectedValues, label]);
      }
    } else {
      onSelect([label]);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <h3 className="text-base font-semibold text-gray-800">{title}</h3>
        {required && <span className="text-xs text-red-500">*Bắt buộc</span>}
        {multiple && <span className="text-xs text-gray-400">(chọn nhiều)</span>}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {choices.map((choice) => {
          const isSelected = selectedValues.includes(choice.label);
          return (
            <Card
              key={choice.id}
              padding={false}
              className={cn(
                'p-3 cursor-pointer text-center transition-all border-2',
                isSelected
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300',
              )}
              onClick={() => handleChoiceClick(choice.label)}
            >
              <div className="text-sm font-medium text-gray-900">{choice.label}</div>
              {choice.surcharge !== 0 && (
                <div className={cn('text-xs mt-0.5', choice.surcharge > 0 ? 'text-red-500' : 'text-kitchen-600')}>
                  {choice.surcharge > 0 ? '+' : ''}{formatVND(choice.surcharge)}
                </div>
              )}
              {choice.isDefault && !isSelected && (
                <div className="text-xs text-gray-400 mt-0.5">Mặc định</div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
