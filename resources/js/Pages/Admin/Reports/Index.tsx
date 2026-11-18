import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import { formatRupiah } from '@/utils/format';

interface ReportsProps {
  filters: { from: string; to: string };
  summary: { total_revenue: number; paid_revenue: number; total_orders: number };
  byMethod: Array<{ payment_method: string; count: number; total: number }>;
  topItems: Array<{ menu_name: string; qty: number; revenue: number }>;
}

export default function AdminReportsIndex({ filters, summary, byMethod, topItems }: ReportsProps) {
  const [from, setFrom] = useState(filters.from);
  const [to, setTo] = useState(filters.to);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    router.get('/admin/reports', { from, to }, { preserveState: true });
  };

  return (
    <AdminLayout title="Laporan Penjualan">
      <Head title="Laporan Penjualan" />

      <div className="space-y-6">
        <form onSubmit={submit} className="flex flex-wrap items-end gap-3 text-xs">
          <div>
            <label className="block font-semibold mb-1">Dari Tanggal</label>
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="px-3 py-2 rounded-xl bg-white border border-[#dfd8ca]" />
          </div>
          <div>
            <label className="block font-semibold mb-1">Sampai Tanggal</label>
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="px-3 py-2 rounded-xl bg-white border border-[#dfd8ca]" />
          </div>
          <button type="submit" className="px-4 py-2.5 rounded-xl bg-[#3d5a2e] text-white font-semibold cursor-pointer">
            Terapkan
          </button>
        </form>

        <div className="grid sm:grid-cols-3 gap-4">
          <div className="rounded-2xl bg-white border border-[#e5dfd3] p-5">
            <div className="text-xs text-[#6b7066]">Omzet Pesanan (Non-Batal)</div>
            <div className="text-xl font-bold text-[#3d5a2e] tabular-nums mt-1">{formatRupiah(summary.total_revenue)}</div>
          </div>
          <div className="rounded-2xl bg-white border border-[#e5dfd3] p-5">
            <div className="text-xs text-[#6b7066]">Pembayaran Terkonfirmasi (Paid)</div>
            <div className="text-xl font-bold text-[#1f241c] tabular-nums mt-1">{formatRupiah(summary.paid_revenue)}</div>
          </div>
          <div className="rounded-2xl bg-white border border-[#e5dfd3] p-5">
            <div className="text-xs text-[#6b7066]">Total Transaksi</div>
            <div className="text-xl font-bold text-[#c85a32] tabular-nums mt-1">{summary.total_orders}</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-white border border-[#e5dfd3] p-5 space-y-3 text-xs">
            <h2 className="font-editorial text-lg font-bold">Per Metode Pembayaran</h2>
            {byMethod.map((m) => (
              <div key={m.payment_method} className="flex justify-between py-2 border-b border-[#f0ebe1]">
                <span className="uppercase font-semibold">{m.payment_method} ({m.count}x)</span>
                <span className="font-bold tabular-nums">{formatRupiah(Number(m.total))}</span>
              </div>
            ))}
          </div>

          <div className="rounded-2xl bg-white border border-[#e5dfd3] p-5 space-y-3 text-xs">
            <h2 className="font-editorial text-lg font-bold">Menu Terlaris Periode Ini</h2>
            {topItems.map((it) => (
              <div key={it.menu_name} className="flex justify-between py-2 border-b border-[#f0ebe1]">
                <span className="font-semibold">{it.menu_name} ({it.qty} porsi)</span>
                <span className="font-bold tabular-nums text-[#3d5a2e]">{formatRupiah(Number(it.revenue))}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
