'use client';

import { useSocket } from '@/hooks/use-socket';
import { cn } from '@/lib/utils';

export function ConnectionStatus() {
  const { isConnected } = useSocket();

  return (
    <div className="flex items-center gap-1.5" title={isConnected ? 'Đã kết nối' : 'Mất kết nối'}>
      <div
        className={cn(
          'h-2 w-2 rounded-full',
          isConnected ? 'bg-green-400' : 'bg-red-400 animate-pulse',
        )}
      />
      <span className="text-xs text-white/70">
        {isConnected ? 'Online' : 'Offline'}
      </span>
    </div>
  );
}
