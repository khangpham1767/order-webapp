'use client';

import { cn } from '@/lib/utils';
import { Button } from './button';

interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  className,
}: QuantityStepperProps) {
  return (
    <div className={cn('inline-flex items-center gap-2', className)}>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Giảm"
      >
        -
      </Button>
      <span className="min-w-[2rem] text-center text-lg font-semibold">{value}</span>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Tăng"
      >
        +
      </Button>
    </div>
  );
}
