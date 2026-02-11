'use client';

import { useState, useEffect, useCallback } from 'react';
import type { MenuItemWithOptions } from '@/types/menu';

export function useMenu(activeOnly: boolean = true) {
  const [menuItems, setMenuItems] = useState<MenuItemWithOptions[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMenu = useCallback(async () => {
    try {
      const url = activeOnly ? '/api/menu' : '/api/menu?all=true';
      const res = await fetch(url);
      const data = await res.json();
      setMenuItems(data);
    } catch (error) {
      console.error('Failed to fetch menu:', error);
    } finally {
      setLoading(false);
    }
  }, [activeOnly]);

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  const mainItems = menuItems.filter((item) => item.type === 'MAIN');
  const addonItems = menuItems.filter((item) => item.type === 'ADDON');

  return { menuItems, mainItems, addonItems, loading, refetch: fetchMenu };
}
