'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatVND } from '@/lib/utils';
import type { MenuItemWithOptions } from '@/types/menu';

interface MenuItemPickerProps {
  mainItems: MenuItemWithOptions[];
  addonItems: MenuItemWithOptions[];
  onSelectMain: (item: MenuItemWithOptions) => void;
  onSelectAddon: (item: MenuItemWithOptions) => void;
}

export function MenuItemPicker({
  mainItems,
  addonItems,
  onSelectMain,
  onSelectAddon,
}: MenuItemPickerProps) {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Món chính</h2>
        <div className="grid gap-3">
          {mainItems.map((item) => (
            <Card
              key={item.id}
              className="cursor-pointer hover:shadow-md hover:border-primary-300 transition-all"
              onClick={() => onSelectMain(item)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {item.options.filter((o) => o.optionType === 'NOODLE_TYPE').map((o) => o.label).join(', ')}
                  </p>
                </div>
                <span className="text-primary-600 font-semibold">{formatVND(item.sellPrice)}</span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {addonItems.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Thêm / Phụ phí</h2>
          <div className="grid grid-cols-2 gap-3">
            {addonItems.map((item) => (
              <Card
                key={item.id}
                className="cursor-pointer hover:shadow-md hover:border-primary-300 transition-all"
                onClick={() => onSelectAddon(item)}
              >
                <div className="text-center">
                  <h3 className="font-medium text-gray-900 text-sm">{item.name}</h3>
                  <Badge className="mt-1">{formatVND(item.sellPrice)}</Badge>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
