import { prisma } from '@/lib/prisma';
import type { MenuItemWithOptions, CreateMenuItemPayload, UpdateMenuItemPayload } from '@/types/menu';

export async function getMenuItems(activeOnly: boolean = true): Promise<MenuItemWithOptions[]> {
  return prisma.menuItem.findMany({
    where: activeOnly ? { active: true } : {},
    include: {
      options: { orderBy: { sortOrder: 'asc' } },
    },
    orderBy: { id: 'asc' },
  }) as Promise<MenuItemWithOptions[]>;
}

export async function getMenuItemById(id: number): Promise<MenuItemWithOptions | null> {
  return prisma.menuItem.findUnique({
    where: { id },
    include: {
      options: { orderBy: { sortOrder: 'asc' } },
    },
  }) as Promise<MenuItemWithOptions | null>;
}

export async function createMenuItem(payload: CreateMenuItemPayload): Promise<MenuItemWithOptions> {
  return prisma.menuItem.create({
    data: {
      name: payload.name,
      sellPrice: payload.sellPrice,
      costPrice: payload.costPrice,
      type: payload.type,
      options: payload.options
        ? {
            create: payload.options.map((opt) => ({
              optionType: opt.optionType,
              label: opt.label,
              isDefault: opt.isDefault ?? false,
              surcharge: opt.surcharge ?? 0,
              sortOrder: opt.sortOrder ?? 0,
            })),
          }
        : undefined,
    },
    include: {
      options: { orderBy: { sortOrder: 'asc' } },
    },
  }) as Promise<MenuItemWithOptions>;
}

export async function updateMenuItem(
  id: number,
  payload: UpdateMenuItemPayload,
): Promise<MenuItemWithOptions> {
  // If options are provided, replace all options
  if (payload.options) {
    await prisma.menuItemOption.deleteMany({ where: { menuItemId: id } });
  }

  return prisma.menuItem.update({
    where: { id },
    data: {
      ...(payload.name !== undefined && { name: payload.name }),
      ...(payload.sellPrice !== undefined && { sellPrice: payload.sellPrice }),
      ...(payload.costPrice !== undefined && { costPrice: payload.costPrice }),
      ...(payload.active !== undefined && { active: payload.active }),
      ...(payload.options && {
        options: {
          create: payload.options.map((opt) => ({
            optionType: opt.optionType,
            label: opt.label,
            isDefault: opt.isDefault ?? false,
            surcharge: opt.surcharge ?? 0,
            sortOrder: opt.sortOrder ?? 0,
          })),
        },
      }),
    },
    include: {
      options: { orderBy: { sortOrder: 'asc' } },
    },
  }) as Promise<MenuItemWithOptions>;
}

export async function toggleMenuItem(id: number): Promise<MenuItemWithOptions> {
  const item = await prisma.menuItem.findUnique({ where: { id } });
  if (!item) throw new Error('Menu item not found');

  return prisma.menuItem.update({
    where: { id },
    data: { active: !item.active },
    include: {
      options: { orderBy: { sortOrder: 'asc' } },
    },
  }) as Promise<MenuItemWithOptions>;
}
