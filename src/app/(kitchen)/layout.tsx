'use client';

import { useEffect } from 'react';
import { useSocket } from '@/hooks/use-socket';
import { RoleHeader } from '@/components/layout/role-header';

export default function KitchenLayout({ children }: { children: React.ReactNode }) {
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;
    socket.emit('join_room', 'room:kitchen');
    return () => {
      socket.emit('leave_room', 'room:kitchen');
    };
  }, [socket]);

  return (
    <div className="min-h-screen bg-kitchen-50">
      <RoleHeader title="Bếp" color="bg-kitchen-600" />
      <main className="max-w-4xl mx-auto p-4">{children}</main>
    </div>
  );
}
