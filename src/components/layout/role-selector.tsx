'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/card';

const roles = [
  {
    key: 'order',
    label: 'Nhân viên Order',
    description: 'Nhận order, chỉnh sửa, tính tiền',
    href: '/tables',
    color: 'bg-primary-500',
    icon: '🍜',
  },
  {
    key: 'kitchen',
    label: 'Bếp',
    description: 'Nhận và xử lý order',
    href: '/kitchen',
    color: 'bg-kitchen-500',
    icon: '👨‍🍳',
  },
  {
    key: 'accounting',
    label: 'Kế toán',
    description: 'Quản lý menu, thống kê',
    href: '/menu',
    color: 'bg-accounting-500',
    icon: '📊',
  },
];

export function RoleSelector() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản Lý Order</h1>
      <p className="text-gray-500 mb-8">Chọn vai trò của bạn</p>
      <div className="grid gap-4 w-full max-w-md">
        {roles.map((role) => (
          <Link key={role.key} href={role.href}>
            <Card className="flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className={`${role.color} w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0`}>
                {role.icon}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{role.label}</h2>
                <p className="text-sm text-gray-500">{role.description}</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
