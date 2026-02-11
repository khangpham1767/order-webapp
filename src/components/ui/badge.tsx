import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'react';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'draft' | 'queued' | 'cooking' | 'done' | 'paid';
}

const variantStyles: Record<string, string> = {
  default: 'bg-gray-100 text-gray-700',
  draft: 'bg-gray-100 text-gray-600',
  queued: 'bg-primary-100 text-primary-800',
  cooking: 'bg-orange-100 text-orange-800',
  done: 'bg-kitchen-100 text-kitchen-800',
  paid: 'bg-accounting-100 text-accounting-800',
};

export function Badge({ variant = 'default', className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variantStyles[variant],
        className,
      )}
      {...props}
    />
  );
}
