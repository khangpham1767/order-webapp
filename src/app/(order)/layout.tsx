'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useSocket } from '@/hooks/use-socket';
import { RoleHeader } from '@/components/layout/role-header';

export default function OrderLayout({ children }: { children: React.ReactNode }) {
  const { socket } = useSocket();
  const pathname = usePathname();
  const backHref = pathname === '/tables' ? '/' : '/tables';

  useEffect(() => {
    if (!socket) return;
    socket.emit('join_room', 'room:order_staff');
    return () => {
      socket.emit('leave_room', 'room:order_staff');
    };
  }, [socket]);

  return (
    <div className="min-h-screen bg-gray-50">
      <RoleHeader title="Nhân viên Order" color="bg-primary-500" backHref={backHref} />
      <main className="max-w-4xl mx-auto p-4">{children}</main>
    </div>
  );
}
