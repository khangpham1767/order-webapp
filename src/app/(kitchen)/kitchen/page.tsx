'use client';

import { useEffect, useRef } from 'react';
import { useKitchenQueue } from '@/hooks/use-kitchen-queue';
import { QueueIndicator } from '@/components/kitchen/queue-indicator';
import { CurrentOrder } from '@/components/kitchen/current-order';
import { DoneButton } from '@/components/kitchen/done-button';
import { LoadingScreen } from '@/components/ui/spinner';

export default function KitchenPage() {
  const { currentOrder, queueLength, loading, startNext, completeCurrent } = useKitchenQueue();
  const autoStarted = useRef(false);

  useEffect(() => {
    if (!loading && !currentOrder && queueLength > 0 && !autoStarted.current) {
      autoStarted.current = true;
      startNext().finally(() => {
        autoStarted.current = false;
      });
    }
  }, [loading, currentOrder, queueLength, startNext]);

  const handleDone = async () => {
    const ok = await completeCurrent();
    if (ok) {
      // completeCurrent refetches state; the useEffect above will auto-start next
    }
    return ok;
  };

  if (loading) return <LoadingScreen />;

  if (!currentOrder && queueLength === 0) {
    return (
      <div className="space-y-4">
        <QueueIndicator currentOrder={null} queueLength={0} />
        <div className="text-center py-16 text-gray-400 text-lg">
          Hết order rồi!
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-24">
      <QueueIndicator currentOrder={currentOrder} queueLength={queueLength} />
      {currentOrder && <CurrentOrder order={currentOrder} />}
      <DoneButton onDone={handleDone} disabled={!currentOrder} />
    </div>
  );
}
