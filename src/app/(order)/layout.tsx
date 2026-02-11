'use client';

import { useEffect } from 'react';
import { useSocket } from '@/hooks/use-socket';
import { RoleHeader } from '@/components/layout/role-header';

export default function OrderLayout({ children }: { children: React.ReactNode }) {
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;
    socket.emit('join_room', 'room:order_staff');
    return () => {
      socket.emit('leave_room', 'room:order_staff');
    };
  }, [socket]);

  return (
    <div className="min-h-screen bg-gray-50">
      <RoleHeader title="Nhân viên Order" color="bg-primary-500" />
      <main className="max-w-4xl mx-auto p-4">{children}</main>
    </div>
  );
}
