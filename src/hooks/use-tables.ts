'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSocket } from './use-socket';
import { SOCKET_EVENTS } from '@/types/socket';
import type { TableWithStatus } from '@/types/table';

export function useTables() {
  const { socket } = useSocket();
  const [tables, setTables] = useState<TableWithStatus[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTables = useCallback(async () => {
    try {
      const res = await fetch('/api/tables');
      const data = await res.json();
      setTables(data);
    } catch (error) {
      console.error('Failed to fetch tables:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  useEffect(() => {
    if (!socket) return;

    const handleTableChange = () => {
      fetchTables();
    };

    socket.on(SOCKET_EVENTS.TABLE_STATUS_CHANGED, handleTableChange);
    socket.on(SOCKET_EVENTS.ORDER_SUBMITTED, handleTableChange);
    socket.on(SOCKET_EVENTS.ORDER_STATUS_CHANGED, handleTableChange);
    socket.on(SOCKET_EVENTS.PAYMENT_COMPLETED, handleTableChange);

    return () => {
      socket.off(SOCKET_EVENTS.TABLE_STATUS_CHANGED, handleTableChange);
      socket.off(SOCKET_EVENTS.ORDER_SUBMITTED, handleTableChange);
      socket.off(SOCKET_EVENTS.ORDER_STATUS_CHANGED, handleTableChange);
      socket.off(SOCKET_EVENTS.PAYMENT_COMPLETED, handleTableChange);
    };
  }, [socket, fetchTables]);

  return { tables, loading, refetch: fetchTables };
}
