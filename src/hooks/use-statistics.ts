'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSocket } from './use-socket';
import { SOCKET_EVENTS } from '@/types/socket';
import type { StatisticsData } from '@/types/statistics';

export function useStatistics() {
  const { socket } = useSocket();
  const [data, setData] = useState<StatisticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/statistics');
      const result = await res.json();
      setData(result);
    } catch (error) {
      console.error('Failed to fetch statistics:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    if (!socket) return;

    const handlePayment = () => {
      fetchStats();
    };

    socket.on(SOCKET_EVENTS.PAYMENT_COMPLETED, handlePayment);

    return () => {
      socket.off(SOCKET_EVENTS.PAYMENT_COMPLETED, handlePayment);
    };
  }, [socket, fetchStats]);

  return { data, loading, refetch: fetchStats };
}
