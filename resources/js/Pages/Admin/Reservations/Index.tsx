import React from 'react';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';
import type { PageProps } from '@/types';

interface ReservationRow {
  id: number;
  customer_name: string;
  customer_phone: string;
  reservation_date: string;
  reservation_time: string;
  guest_count: number;
  status: string;
  table?: { id: number; table_number: string; capacity: number } | null;
}

interface ReservationsProps {
  reservations: ReservationRow[];
  tables: Array<{ id: number; table_number: string; capacity: number }>;
}

export default function AdminReservationsIndex({ reservations, tables }: ReservationsProps) {
  const { errors } = usePage<PageProps>().props;
  const form = useForm({
    table_id: tables[0]?.id ? String(tables[0].id) : '',
    customer_name: '',
    customer_phone: '',
    reservation_date: new Date().toISOString().slice(0, 10),
    reservation_time: '19:00',
    guest_count: '2',
    notes: '',
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    form.post('/admin/reservations', {
      onSuccess: () => form.reset('customer_name', 'customer_phone', 'notes'),
    });
  };

  return (
    <AdminLayout title="Manajemen Reservasi">
      <Head title="Manajemen Reservasi" />

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        <form onSubmit={submit} className="lg:col-span-4 rounded-2xl bg-white border border-[#e5dfd3] p-5 space-y-3 text-xs">
          <h2 className="font-editorial text-lg font-bold">Buat Reservasi Meja</h2>
          <div>
            <label className="block font-semibold mb-1">Pilih Meja</label>
            <select
              value={form.data.table_id}
              onChange={(e) => form.setData('table_id', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#dfd8ca]"
              required
            >
              {tables.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.table_number} (Maks {t.capacity} orang)
                </option>
              ))}
            </select>
            {errors.table_id && <p className="text-[#c85a32] mt-1">{errors.table_id}</p>}
          </div>
          <div>
            <label className="block font-semibold mb-1">Nama Pelanggan</label>
            <input
              type="text"
              value={form.data.customer_name}
              onChange={(e) => form.setData('customer_name', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#dfd8ca]"
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">No. Telepon</label>
            <input
              type="tel"
              value={form.data.customer_phone}
              onChange={(e) => form.setData('customer_phone', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#dfd8ca]"
              required
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block font-semibold mb-1">Tanggal</label>
              <input
                type="date"
                value={form.data.reservation_date}
                onChange={(e) => form.setData('reservation_date', e.target.value)}
                className="w-full px-2 py-2 rounded-xl border border-[#dfd8ca]"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Jam</label>
              <input
                type="time"
                value={form.data.reservation_time}
                onChange={(e) => form.setData('reservation_time', e.target.value)}
                className="w-full px-2 py-2 rounded-xl border border-[#dfd8ca]"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Tamu</label>
              <input
                type="number"
                min={1}
                value={form.data.guest_count}
                onChange={(e) => form.setData('guest_count', e.target.value)}
                className="w-full px-2 py-2 rounded-xl border border-[#dfd8ca]"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={form.processing || tables.length === 0}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#3d5a2e] text-white font-semibold disabled:opacity-50 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Simpan Reservasi
          </button>
        </form>

        <div className="lg:col-span-8 rounded-2xl bg-white border border-[#e5dfd3] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#faf7f2] border-b border-[#e5dfd3] text-[#6b7066]">
                  <th className="p-3.5 font-semibold">Pelanggan</th>
                  <th className="p-3.5 font-semibold">Meja</th>
                  <th className="p-3.5 font-semibold">Jadwal</th>
                  <th className="p-3.5 font-semibold">Tamu</th>
                  <th className="p-3.5 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0ebe1]">
                {reservations.map((r) => (
                  <tr key={r.id}>
                    <td className="p-3.5">
                      <div className="font-bold text-[#1f241c]">{r.customer_name}</div>
                      <div className="text-[11px] text-[#6b7066]">{r.customer_phone}</div>
                    </td>
                    <td className="p-3.5 font-semibold">{r.table?.table_number ?? '-'}</td>
                    <td className="p-3.5 tabular-nums">
                      {r.reservation_date} • {r.reservation_time}
                    </td>
                    <td className="p-3.5 tabular-nums">{r.guest_count} org</td>
                    <td className="p-3.5">
                      <select
                        value={r.status}
                        onChange={(e) =>
                          router.patch(`/admin/reservations/${r.id}/status`, { status: e.target.value })
                        }
                        className="px-2.5 py-1.5 rounded-lg border border-[#dfd8ca] bg-white capitalize"
                      >
                        {['pending', 'confirmed', 'seated', 'completed', 'cancelled'].map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
