import React, { useState } from 'react';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';
import type { PageProps } from '@/types';

interface TableRow {
  id: number;
  table_number: string;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved';
  is_available: boolean;
}

export default function AdminTablesIndex({ tables }: { tables: TableRow[] }) {
  const { errors } = usePage<PageProps>().props;
  const form = useForm({
    table_number: '',
    capacity: '4',
    status: 'available' as 'available' | 'occupied' | 'reserved',
    is_available: true,
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    form.post('/admin/tables', { onSuccess: () => form.reset('table_number') });
  };

  return (
    <AdminLayout title="Manajemen Meja">
      <Head title="Manajemen Meja" />

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        <form onSubmit={submit} className="lg:col-span-4 rounded-2xl bg-white border border-[#e5dfd3] p-5 space-y-3 text-xs">
          <h2 className="font-editorial text-lg font-bold">Tambah Meja</h2>
          <div>
            <label className="block font-semibold mb-1">Nomor Meja</label>
            <input
              type="text"
              value={form.data.table_number}
              onChange={(e) => form.setData('table_number', e.target.value)}
              placeholder="Contoh: M-01"
              className="w-full px-3 py-2 rounded-xl border border-[#dfd8ca]"
              required
            />
            {errors.table_number && <p className="text-[#c85a32] mt-1">{errors.table_number}</p>}
          </div>
          <div>
            <label className="block font-semibold mb-1">Kapasitas (Kursi)</label>
            <input
              type="number"
              min={1}
              max={30}
              value={form.data.capacity}
              onChange={(e) => form.setData('capacity', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#dfd8ca]"
              required
            />
          </div>
          <button
            type="submit"
            disabled={form.processing}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#3d5a2e] text-white font-semibold cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Simpan Meja
          </button>
        </form>

        <div className="lg:col-span-8 grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {tables.map((t) => (
            <div key={t.id} className="rounded-2xl bg-white border border-[#e5dfd3] p-4 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-editorial text-lg font-bold">{t.table_number}</span>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Hapus meja ${t.table_number}?`)) {
                      router.delete(`/admin/tables/${t.id}`);
                    }
                  }}
                  className="p-1 text-[#c85a32] cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="text-[#6b7066]">Kapasitas: {t.capacity} kursi</div>
              <select
                value={t.status}
                onChange={(e) =>
                  router.put(`/admin/tables/${t.id}`, {
                    table_number: t.table_number,
                    capacity: t.capacity,
                    status: e.target.value,
                    is_available: t.is_available,
                  })
                }
                className="w-full px-2.5 py-1.5 rounded-lg border border-[#dfd8ca] bg-[#faf7f2] capitalize"
              >
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
                <option value="reserved">Reserved</option>
              </select>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
