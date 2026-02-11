'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { formatVND, cn } from '@/lib/utils';
import type { MenuItemWithOptions } from '@/types/menu';

interface MenuItemListProps {
  items: MenuItemWithOptions[];
  onToggleActive: (itemId: number) => void;
  onEdit: (itemId: number) => void;
}

function MenuItemSection({
  title,
  items,
  onToggleActive,
  onEdit,
}: {
  title: string;
  items: MenuItemWithOptions[];
  onToggleActive: (itemId: number) => void;
  onEdit: (itemId: number) => void;
}) {
  if (items.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      {items.map((item) => (
        <Card key={item.id} className={cn(!item.active && 'opacity-50')}>
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-gray-900 truncate">{item.name}</h4>
                <Badge variant={item.type === 'MAIN' ? 'cooking' : 'default'}>
                  {item.type === 'MAIN' ? 'Món chính' : 'Phụ'}
                </Badge>
              </div>
              <div className="flex gap-3 mt-1 text-sm text-gray-500">
                <span>Bán: {formatVND(item.sellPrice)}</span>
                <span>Vốn: {formatVND(item.costPrice)}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Switch
                checked={item.active}
                onChange={() => onToggleActive(item.id)}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(item.id)}
              >
                Sửa
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

export function MenuItemList({ items, onToggleActive, onEdit }: MenuItemListProps) {
  const mainItems = items.filter((i) => i.type === 'MAIN');
  const addonItems = items.filter((i) => i.type === 'ADDON');

  return (
    <div className="space-y-6">
      <MenuItemSection title="Món chính" items={mainItems} onToggleActive={onToggleActive} onEdit={onEdit} />
      <MenuItemSection title="Thêm / Phụ phí" items={addonItems} onToggleActive={onToggleActive} onEdit={onEdit} />
    </div>
  );
}
