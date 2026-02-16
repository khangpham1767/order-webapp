'use client';

import { useEffect } from 'react';
import { useSocket } from '@/hooks/use-socket';
import { RoleHeader } from '@/components/layout/role-header';
import Link from 'next/link';

export default function AccountingLayout({ children }: { children: React.ReactNode }) {
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;
    const joinRoom = () => socket.emit('join_room', 'room:accounting');
    if (socket.connected) joinRoom();
    socket.on('connect', joinRoom);
    return () => {
      socket.off('connect', joinRoom);
      socket.emit('leave_room', 'room:accounting');
    };
  }, [socket]);

  return (
    <div className="min-h-screen bg-gray-50">
      <RoleHeader title="Kế toán" color="bg-accounting-600" />
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 flex gap-4">
          <Link href="/menu" className="py-3 text-sm font-medium text-gray-600 hover:text-accounting-600 border-b-2 border-transparent hover:border-accounting-500">
            Menu
          </Link>
          <Link href="/statistics" className="py-3 text-sm font-medium text-gray-600 hover:text-accounting-600 border-b-2 border-transparent hover:border-accounting-500">
            Thống kê
          </Link>
          <Link href="/table-settings" className="py-3 text-sm font-medium text-gray-600 hover:text-accounting-600 border-b-2 border-transparent hover:border-accounting-500">
            Bàn
          </Link>
        </div>
      </nav>
      <main className="max-w-4xl mx-auto p-4">{children}</main>
    </div>
  );
}
