'use client';

import { useStatistics } from '@/hooks/use-statistics';
import { StatsSummary } from '@/components/accounting/stats-summary';
import { StatsTable } from '@/components/accounting/stats-table';
import { LoadingScreen } from '@/components/ui/spinner';

export default function StatisticsPage() {
  const { data, loading } = useStatistics();

  if (loading) return <LoadingScreen />;

  if (!data) {
    return (
      <div className="text-center py-16 text-gray-400 text-lg">
        Chưa có dữ liệu thống kê
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Thống kê</h2>
      <StatsSummary stats={data.summary} />
      {data.itemBreakdown.length > 0 && <StatsTable items={data.itemBreakdown} />}
    </div>
  );
}
