import type { Metadata } from 'next';
import './globals.css';
import { SocketProvider } from '@/providers/socket-provider';
import { ToastProvider } from '@/components/ui/toast';

export const metadata: Metadata = {
  title: 'Quản Lý Order - Quán Ăn Chay',
  description: 'Hệ thống quản lý order realtime cho quán ăn chay',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        <SocketProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </SocketProvider>
      </body>
    </html>
  );
}
