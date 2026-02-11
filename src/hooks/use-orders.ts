'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSocket } from './use-socket';
import { SOCKET_EVENTS } from '@/types/socket';
import type { OrderWithItems } from '@/types/order';

export function useOrders(status?: string) {
  const { socket } = useSocket();
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    try {
      const url = status ? `/api/orders?status=${status}` : '/api/orders';
      const res = await fetch(url);
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    if (!socket) return;

    const handleChange = () => {
      fetchOrders();
    };

    socket.on(SOCKET_EVENTS.ORDER_CREATED, handleChange);
    socket.on(SOCKET_EVENTS.ORDER_UPDATED, handleChange);
    socket.on(SOCKET_EVENTS.ORDER_SUBMITTED, handleChange);
    socket.on(SOCKET_EVENTS.ORDER_CANCELLED, handleChange);
    socket.on(SOCKET_EVENTS.ORDER_STATUS_CHANGED, handleChange);
    socket.on(SOCKET_EVENTS.PAYMENT_COMPLETED, handleChange);

    return () => {
      socket.off(SOCKET_EVENTS.ORDER_CREATED, handleChange);
      socket.off(SOCKET_EVENTS.ORDER_UPDATED, handleChange);
      socket.off(SOCKET_EVENTS.ORDER_SUBMITTED, handleChange);
      socket.off(SOCKET_EVENTS.ORDER_CANCELLED, handleChange);
      socket.off(SOCKET_EVENTS.ORDER_STATUS_CHANGED, handleChange);
      socket.off(SOCKET_EVENTS.PAYMENT_COMPLETED, handleChange);
    };
  }, [socket, fetchOrders]);

  return { orders, loading, refetch: fetchOrders };
}

export function useOrder(orderId: number | null) {
  const { socket } = useSocket();
  const [order, setOrder] = useState<OrderWithItems | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = useCallback(async () => {
    if (!orderId) {
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`/api/orders/${orderId}`);
      if (res.ok) {
        const data = await res.json();
        setOrder(data);
      }
    } catch (error) {
      console.error('Failed to fetch order:', error);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  useEffect(() => {
    if (!socket) return;

    const handleChange = () => {
      fetchOrder();
    };

    socket.on(SOCKET_EVENTS.ORDER_UPDATED, handleChange);
    socket.on(SOCKET_EVENTS.ORDER_STATUS_CHANGED, handleChange);

    return () => {
      socket.off(SOCKET_EVENTS.ORDER_UPDATED, handleChange);
      socket.off(SOCKET_EVENTS.ORDER_STATUS_CHANGED, handleChange);
    };
  }, [socket, fetchOrder]);

  return { order, loading, refetch: fetchOrder };
}
