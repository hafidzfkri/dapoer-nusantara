import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { ClipboardList, Clock } from 'lucide-react';
import MainLayout from '@/layouts/MainLayout';
import type { Order } from '@/types';
import { formatRupiah } from '@/utils/format';

interface OrdersIndexProps {
  orders: Order[];
}

const STATUS_BADGE: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800',
  processing: 'bg-[#3d5a2e]/15 text-[#3d5a2e]',
  completed: 'bg-emerald-100 text-emerald-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function OrdersIndex({ orders }: OrdersIndexProps) {
  return (
    <MainLayout>
      <Head title="Riwayat Pesanan" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="font-editorial text-3xl font-bold text-[#1f241c]">Riwayat Pesanan</h1>
            <p className="text-sm text-[#575c52] mt-1">Pantau status hidangan yang pernah dan sedang Anda pesan.</p>
          </div>
          <Link
            href="/#katalog-menu"
            className="px-4 py-2 rounded-full bg-[#3d5a2e] text-white text-xs font-semibold hover:bg-[#2c4221]"
          >
            Pesan Lagi
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-3xl bg-white border border-[#e5dfd3] p-12 text-center space-y-3">
            <ClipboardList className="w-8 h-8 text-[#6b7066] mx-auto" />
            <h2 className="font-editorial text-xl font-bold text-[#1f241c]">Belum Ada Pesanan</h2>
            <p className="text-xs text-[#6b7066]">Pesanan Anda akan muncul di sini setelah checkout.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="rounded-2xl bg-white border border-[#e5dfd3] p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#f0ebe1]">
                  <div>
                    <span className="font-editorial text-lg font-bold text-[#1f241c]">{order.order_number}</span>
                    <div className="text-xs text-[#6b7066] inline-flex items-center gap-1 ml-3">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(order.created_at).toLocaleString('id-ID')}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] px-2.5 py-1 rounded-full bg-[#f2ece1] text-[#4f544b] font-medium">
                      {order.delivery_type === 'dine-in' ? 'Dine-In' : 'Delivery'}
                    </span>
                    <span
                      className={`text-[11px] px-2.5 py-1 rounded-full font-semibold uppercase ${
                        STATUS_BADGE[order.status] ?? 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-[#575c52]">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <span>
                        {item.quantity}x {item.menu_name}
                      </span>
                      <span className="tabular-nums font-medium text-[#1f241c]">{formatRupiah(item.subtotal)}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-[#f0ebe1] flex items-center justify-between text-xs">
                  <Link href={`/payment-success/${order.id}`} className="font-semibold text-[#3d5a2e] hover:underline">
                    Lihat Detail Struk →
                  </Link>
                  <span className="text-sm font-bold text-[#1f241c] tabular-nums">
                    Total: {formatRupiah(order.total_price)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
