import React from 'react';
import { Head, router } from '@inertiajs/react';
import { ChefHat, Clock, CheckCircle2 } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';
import type { Order } from '@/types';

interface KitchenOrder extends Order {
  user?: { id: number; name: string } | null;
}

interface KitchenProps {
  orders: KitchenOrder[];
}

export default function AdminKitchenIndex({ orders }: KitchenProps) {
  return (
    <AdminLayout title="Kitchen Display System (KDS)">
      <Head title="Kitchen Display" />

      {orders.length === 0 ? (
        <div className="rounded-2xl bg-white border border-[#e5dfd3] p-12 text-center space-y-2">
          <ChefHat className="w-8 h-8 text-[#3d5a2e] mx-auto" />
          <h2 className="font-editorial text-xl font-bold">Belum Ada Antrean Dapur</h2>
          <p className="text-xs text-[#6b7066]">
            Pesanan yang sudah dikonfirmasi akan muncul otomatis di sini.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-2xl bg-white border border-[#e5dfd3] p-5 flex flex-col justify-between gap-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-[#f0ebe1] pb-2.5">
                  <div>
                    <div className="font-editorial text-lg font-bold text-[#1f241c]">{order.order_number}</div>
                    <div className="text-[11px] text-[#6b7066] inline-flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {new Date(order.created_at).toLocaleTimeString('id-ID')} •{' '}
                      <span className="uppercase">{order.delivery_type}</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-[#f2ece1] text-[#3d5a2e]">
                    {order.status}
                  </span>
                </div>

                <ul className="space-y-2 text-xs">
                  {order.items.map((item) => (
                    <li key={item.id} className="p-2.5 rounded-xl bg-[#faf7f2] border border-[#efe9dc]">
                      <span className="font-bold text-[#3d5a2e]">{item.quantity}x</span>{' '}
                      <span className="font-semibold text-[#1f241c]">{item.menu_name}</span>
                    </li>
                  ))}
                </ul>

                {order.notes && (
                  <p className="text-[11px] p-2.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200">
                    Catatan: {order.notes}
                  </p>
                )}
              </div>

              <div className="flex gap-2 pt-2 border-t border-[#f0ebe1]">
                {order.status === 'confirmed' && (
                  <button
                    type="button"
                    onClick={() => router.patch(`/admin/kitchen/${order.id}/prep`, { status: 'preparing' })}
                    className="flex-1 py-2.5 rounded-full bg-[#d99b26] text-white text-xs font-semibold cursor-pointer"
                  >
                    Mulai Masak (Preparing)
                  </button>
                )}
                {order.status === 'preparing' && (
                  <button
                    type="button"
                    onClick={() => router.patch(`/admin/kitchen/${order.id}/prep`, { status: 'ready' })}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-full bg-[#3d5a2e] text-white text-xs font-semibold cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Siap Disajikan (Ready)
                  </button>
                )}
                {order.status === 'ready' && (
                  <div className="w-full text-center text-xs font-semibold text-[#3d5a2e] py-1">
                    Siap di Counter / Kurir
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
