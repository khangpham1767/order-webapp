'use client';

import { useReducer, useCallback } from 'react';
import type { OrderItemConfig, GroupedOrderItem } from '@/types/order';
import { groupOrderItems, splitGroupedItem } from '@/lib/utils';

interface DraftItem {
  id: string;
  config: OrderItemConfig;
  quantity: number;
  notes?: string;
}

type DraftAction =
  | { type: 'ADD_ITEM'; payload: { config: OrderItemConfig; quantity: number; notes?: string } }
  | { type: 'REMOVE_ITEM'; payload: { id: string } }
  | { type: 'UPDATE_ITEM'; payload: { id: string; config: OrderItemConfig; quantity: number; notes?: string } }
  | { type: 'SET_ITEMS'; payload: DraftItem[] }
  | { type: 'CLEAR' };

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

function draftReducer(state: DraftItem[], action: DraftAction): DraftItem[] {
  switch (action.type) {
    case 'ADD_ITEM':
      return [
        ...state,
        {
          id: generateId(),
          config: action.payload.config,
          quantity: action.payload.quantity,
          notes: action.payload.notes,
        },
      ];
    case 'REMOVE_ITEM':
      return state.filter((item) => item.id !== action.payload.id);
    case 'UPDATE_ITEM':
      return state.map((item) =>
        item.id === action.payload.id
          ? { ...item, config: action.payload.config, quantity: action.payload.quantity, notes: action.payload.notes }
          : item,
      );
    case 'SET_ITEMS':
      return action.payload;
    case 'CLEAR':
      return [];
    default:
      return state;
  }
}

export function useOrderDraft(initialItems: DraftItem[] = []) {
  const [items, dispatch] = useReducer(draftReducer, initialItems);

  const addItem = useCallback(
    (config: OrderItemConfig, quantity: number = 1, notes?: string) => {
      dispatch({ type: 'ADD_ITEM', payload: { config, quantity, notes } });
    },
    [],
  );

  const removeItem = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } });
  }, []);

  const updateItem = useCallback(
    (id: string, config: OrderItemConfig, quantity: number, notes?: string) => {
      dispatch({ type: 'UPDATE_ITEM', payload: { id, config, quantity, notes } });
    },
    [],
  );

  const setItems = useCallback((newItems: DraftItem[]) => {
    dispatch({ type: 'SET_ITEMS', payload: newItems });
  }, []);

  const clear = useCallback(() => {
    dispatch({ type: 'CLEAR' });
  }, []);

  const groupedItems: GroupedOrderItem[] = groupOrderItems(
    items.map((i) => ({ config: i.config, quantity: i.quantity, notes: i.notes })),
  );

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => {
    const basePrice = item.config.addons?.reduce((a, addon) => a + addon.price * addon.quantity, 0) || 0;
    return sum + (basePrice + getSizePrice(item.config)) * item.quantity;
  }, 0);

  return {
    items,
    groupedItems,
    totalQuantity,
    totalPrice,
    addItem,
    removeItem,
    updateItem,
    setItems,
    clear,
    splitGroupedItem,
  };
}

function getSizePrice(_config: OrderItemConfig): number {
  return 0;
}

export type { DraftItem, DraftAction };
