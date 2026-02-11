'use client';

import Link from 'next/link';
import { ConnectionStatus } from './connection-status';
import { cn } from '@/lib/utils';

interface RoleHeaderProps {
  title: string;
  color?: string;
  backHref?: string;
}

export function RoleHeader({ title, color = 'bg-primary-500', backHref = '/' }: RoleHeaderProps) {
  return (
    <header className={cn('sticky top-0 z-40 px-4 py-3 text-white shadow-md', color)}>
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        <div className="flex items-center gap-3">
          <Link
            href={backHref}
            className="text-white/80 hover:text-white text-xl"
            aria-label="Quay lại"
          >
            ←
          </Link>
          <h1 className="text-lg font-semibold">{title}</h1>
        </div>
        <ConnectionStatus />
      </div>
    </header>
  );
}
