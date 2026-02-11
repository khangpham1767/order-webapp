import type { MenuItem, MenuItemOption, OptionType } from '@prisma/client';

export interface MenuItemWithOptions extends MenuItem {
  options: MenuItemOption[];
}

export interface MenuOptionGroup {
  type: OptionType;
  label: string;
  choices: MenuOptionChoice[];
  multiple: boolean;
  required: boolean;
}

export interface MenuOptionChoice {
  id: number;
  label: string;
  isDefault: boolean;
  surcharge: number;
}

export interface CreateMenuItemPayload {
  name: string;
  sellPrice: number;
  costPrice: number;
  type: 'MAIN' | 'ADDON';
  options?: {
    optionType: OptionType;
    label: string;
    isDefault?: boolean;
    surcharge?: number;
    sortOrder?: number;
  }[];
}

export interface UpdateMenuItemPayload {
  name?: string;
  sellPrice?: number;
  costPrice?: number;
  active?: boolean;
  options?: {
    optionType: OptionType;
    label: string;
    isDefault?: boolean;
    surcharge?: number;
    sortOrder?: number;
  }[];
}
