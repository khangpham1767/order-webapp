'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LoadingScreen } from '@/components/ui/spinner';
import { useToast } from '@/components/ui/toast';

interface TableData {
  id: number;
  number: number;
  label: string;
  activeOrderId: number | null;
}

export default function TableSettingsPage() {
  const [tables, setTables] = useState<TableData[]>([]);
  const [loading, setLoading] = useState(true);
  const [newNumber, setNewNumber] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [adding, setAdding] = useState(false);
  const { showToast } = useToast();

  const fetchTables = useCallback(async () => {
    try {
      const res = await fetch('/api/tables');
      const data = await res.json();
      setTables(data);
    } catch {
      showToast('Lỗi tải danh sách bàn', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  const handleAdd = async () => {
    const num = parseInt(newNumber);
    if (!num || !newLabel.trim()) {
      showToast('Nhập số bàn và tên bàn', 'error');
      return;
    }
    setAdding(true);
    try {
      const res = await fetch('/api/tables', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ number: num, label: newLabel.trim() }),
      });
      if (res.ok) {
        showToast('Đã thêm bàn', 'success');
        setNewNumber('');
        setNewLabel('');
        fetchTables();
      } else {
        const data = await res.json();
        showToast(data.error || 'Lỗi thêm bàn', 'error');
      }
    } catch {
      showToast('Lỗi thêm bàn', 'error');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (table: TableData) => {
    if (!confirm(`Xóa ${table.label}?`)) return;
    try {
      const res = await fetch(`/api/tables/${table.id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Đã xóa bàn', 'success');
        fetchTables();
      } else {
        const data = await res.json();
        showToast(data.error || 'Lỗi xóa bàn', 'error');
      }
    } catch {
      showToast('Lỗi xóa bàn', 'error');
    }
  };

  // Auto-fill label when number changes
  const handleNumberChange = (val: string) => {
    setNewNumber(val);
    if (val) {
      setNewLabel(`Bàn ${val}`);
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Quản lý bàn</h2>

      {/* Add new table */}
      <Card>
        <h3 className="font-semibold text-gray-800 mb-3">Thêm bàn mới</h3>
        <div className="flex gap-2 items-end">
          <Input
            label="Số bàn"
            type="number"
            value={newNumber}
            onChange={(e) => handleNumberChange(e.target.value)}
            className="w-24"
            min={1}
          />
          <Input
            label="Tên bàn"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleAdd} disabled={adding}>
            {adding ? 'Đang thêm...' : 'Thêm'}
          </Button>
        </div>
      </Card>

      {/* Table list */}
      <div className="space-y-2">
        <h3 className="font-semibold text-gray-800">Danh sách bàn ({tables.length})</h3>
        {tables.map((table) => (
          <Card key={table.id} className="flex items-center justify-between">
            <div>
              <span className="font-medium text-gray-900">{table.label}</span>
              <span className="text-sm text-gray-500 ml-2">(Số {table.number})</span>
            </div>
            <Button
              variant="danger"
              size="sm"
              onClick={() => handleDelete(table)}
              disabled={!!table.activeOrderId}
            >
              {table.activeOrderId ? 'Đang có order' : 'Xóa'}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
