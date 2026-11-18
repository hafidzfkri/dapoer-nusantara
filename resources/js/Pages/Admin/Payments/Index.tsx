import React from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { CheckCircle2, Printer } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';
import type { PageProps } from '@/types';
import { formatRupiah } from '@/utils/format';

interface PaymentRow {
  id: number;
  order_id: number;
  payment_method: string;
  amount: number;
  status: string;
  paid_at: string | null;
  reference_number: string | null;
  confirmer?: { id: number; name: string } | null;
  order?: {
    id: number;
    order_number: string;
    delivery_type: string;
    user?: { id: number; name: string; email: string } | null;
  } | null;
}

interface PaymentsProps {
  payments: PaymentRow[];
}

export default function AdminPaymentsIndex({ payments }: PaymentsProps) {
  const { auth } = usePage<PageProps>().props;
  const canConfirm = auth.user?.role === 'admin' || auth.user?.permissions?.includes('payment.confirm');

  return (
    <AdminLayout title="Manajemen Pembayaran (Kasir)">
      <Head title="Manajemen Pembayaran" />

      <div className="rounded-2xl bg-white border border-[#e5dfd3] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#faf7f2] border-b border-[#e5dfd3] text-[#6b7066]">
                <th className="p-3.5 font-semibold">No. Pesanan</th>
                <th className="p-3.5 font-semibold">Pelanggan</th>
                <th className="p-3.5 font-semibold">Metode</th>
                <th className="p-3.5 font-semibold">Nominal</th>
                <th className="p-3.5 font-semibold">Status</th>
                <th className="p-3.5 font-semibold">Dikonfirmasi Oleh</th>
                <th className="p-3.5 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0ebe1]">
              {payments.map((p) => (
                <tr key={p.id}>
                  <td className="p-3.5 font-bold text-[#1f241c]">{p.order?.order_number ?? '-'}</td>
                  <td className="p-3.5 text-[#4f544b]">{p.order?.user?.name ?? 'Tamu'}</td>
                  <td className="p-3.5 uppercase font-semibold text-[#4f544b]">{p.payment_method}</td>
                  <td className="p-3.5 font-bold tabular-nums text-[#3d5a2e]">{formatRupiah(p.amount)}</td>
                  <td className="p-3.5">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                        p.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-[#6b7066]">
                    {p.confirmer?.name ? `${p.confirmer.name}` : '-'}
                  </td>
                  <td className="p-3.5 text-right space-x-2">
                    {canConfirm && p.status !== 'paid' && (
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Konfirmasi pembayaran ${formatRupiah(p.amount)} untuk ${p.order?.order_number}?`)) {
                            router.post(`/admin/payments/${p.id}/confirm`);
                          }
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#3d5a2e] text-white text-[11px] font-semibold cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Konfirmasi Lunas
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-[#dfd8ca] text-[11px] cursor-pointer"
                      title="Cetak Struk"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
