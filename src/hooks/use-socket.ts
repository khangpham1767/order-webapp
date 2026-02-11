'use client';

import { use } from 'react';
import { SocketContext } from '@/providers/socket-provider';

export function useSocket() {
  return use(SocketContext);
}
