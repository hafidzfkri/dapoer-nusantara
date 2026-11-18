import React from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import type { Order, PageProps } from '@/types';
import { formatRupiah } from '@/utils/format';

interface OrderRow extends Order {
  user?: { id: number; name: string; email: string } | null;
  payment?: { id: number; status: string; payment_method: string } | null;
}

interface OrdersProps {
  orders: OrderRow[];
  filters: { status: string };
}

const STATUSES = ['', 'pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'];

export default function AdminOrdersIndex({ orders, filters }: OrdersProps) {
  const { auth } = usePage<PageProps>().props;
  const canUpdate =
    auth.user?.role === 'admin' || auth.user?.permissions?.includes('order.update_status');

  return (
    <AdminLayout title="Manajemen Pesanan">
      <Head title="Manajemen Pesanan" />

      <div className="space-y-5">
        <div className="flex flex-wrap gap-2">
          {STATUSES.map((st) => (
            <button
              key={st || 'all'}
              type="button"
              onClick={() => router.get('/admin/orders', st ? { status: st } : {}, { preserveState: true })}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold capitalize cursor-pointer ${
                filters.status === st
                  ? 'bg-[#3d5a2e] text-white'
                  : 'bg-white border border-[#e5dfd3] text-[#4f544b]'
              }`}
            >
              {st || 'Semua Status'}
            </button>
          ))}
        </div>

        <div className="rounded-2xl bg-white border border-[#e5dfd3] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#faf7f2] border-b border-[#e5dfd3] text-[#6b7066]">
                  <th className="p-3.5 font-semibold">No. Pesanan</th>
                  <th className="p-3.5 font-semibold">Pelanggan &amp; Item</th>
                  <th className="p-3.5 font-semibold">Total</th>
                  <th className="p-3.5 font-semibold">Pembayaran</th>
                  <th className="p-3.5 font-semibold">Status Pesanan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0ebe1]">
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="p-3.5 align-top">
                      <div className="font-bold text-[#1f241c]">{order.order_number}</div>
                      <div className="text-[11px] text-[#6b7066] capitalize">{order.delivery_type}</div>
                    </td>
                    <td className="p-3.5 align-top">
                      <div className="font-semibold text-[#1f241c]">{order.user?.name ?? 'Tamu'}</div>
                      <ul className="text-[11px] text-[#575c52] mt-1 space-y-0.5">
                        {order.items.map((it) => (
                          <li key={it.id}>
                            {it.quantity}x {it.menu_name}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="p-3.5 align-top font-bold text-[#3d5a2e] tabular-nums">
                      {formatRupiah(order.total_price)}
                    </td>
                    <td className="p-3.5 align-top">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                          order.payment?.status === 'paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {order.payment?.status ?? 'unpaid'}
                      </span>
                    </td>
                    <td className="p-3.5 align-top">
                      {canUpdate ? (
                        <select
                          value={order.status}
                          onChange={(e) =>
                            router.patch(`/admin/orders/${order.id}/status`, { status: e.target.value })
                          }
                          className="px-2.5 py-1.5 rounded-lg border border-[#dfd8ca] bg-white text-xs capitalize"
                        >
                          {STATUSES.filter(Boolean).map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="uppercase font-semibold">{order.status}</span>
                      )}
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
