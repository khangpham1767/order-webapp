'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';

interface DoneButtonProps {
  onDone: () => Promise<boolean>;
  disabled?: boolean;
}

export function DoneButton({ onDone, disabled }: DoneButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleDone = useCallback(async () => {
    if (loading || disabled) return;
    setLoading(true);
    try {
      await onDone();
    } finally {
      setLoading(false);
    }
  }, [onDone, loading, disabled]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
        e.preventDefault();
        handleDone();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDone]);

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-kitchen-50">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="kitchen"
          size="xl"
          className="w-full"
          onClick={handleDone}
          disabled={disabled || loading}
        >
          {loading ? 'Đang xử lý...' : 'XONG ORDER'}
        </Button>
      </div>
    </div>
  );
}
