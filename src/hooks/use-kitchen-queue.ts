'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSocket } from './use-socket';
import { SOCKET_EVENTS } from '@/types/socket';
import type { KitchenQueueState } from '@/types/kitchen';

export function useKitchenQueue() {
  const { socket } = useSocket();
  const [state, setState] = useState<KitchenQueueState>({
    currentOrder: null,
    queuedOrders: [],
    queueLength: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchState = useCallback(async () => {
    try {
      const res = await fetch('/api/kitchen');
      const data = await res.json();
      setState(data);
    } catch (error) {
      console.error('Failed to fetch kitchen state:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchState();
  }, [fetchState]);

  useEffect(() => {
    if (!socket) return;

    const handleQueueUpdate = () => {
      fetchState();
    };

    socket.on(SOCKET_EVENTS.KITCHEN_QUEUE_UPDATED, handleQueueUpdate);
    socket.on(SOCKET_EVENTS.KITCHEN_ORDER_STARTED, handleQueueUpdate);
    socket.on(SOCKET_EVENTS.KITCHEN_ORDER_DONE, handleQueueUpdate);
    socket.on(SOCKET_EVENTS.ORDER_SUBMITTED, handleQueueUpdate);

    return () => {
      socket.off(SOCKET_EVENTS.KITCHEN_QUEUE_UPDATED, handleQueueUpdate);
      socket.off(SOCKET_EVENTS.KITCHEN_ORDER_STARTED, handleQueueUpdate);
      socket.off(SOCKET_EVENTS.KITCHEN_ORDER_DONE, handleQueueUpdate);
      socket.off(SOCKET_EVENTS.ORDER_SUBMITTED, handleQueueUpdate);
    };
  }, [socket, fetchState]);

  const startNext = useCallback(async () => {
    const res = await fetch('/api/kitchen/next', { method: 'POST' });
    if (res.ok) {
      await fetchState();
    }
    return res.ok;
  }, [fetchState]);

  const completeCurrent = useCallback(async () => {
    const res = await fetch('/api/kitchen/done', { method: 'POST' });
    if (res.ok) {
      await fetchState();
    }
    return res.ok;
  }, [fetchState]);

  return { ...state, loading, startNext, completeCurrent, refetch: fetchState };
}
