import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { CheckCircle2, MapPin, Clock, ClipboardList } from 'lucide-react';
import MainLayout from '@/layouts/MainLayout';
import type { Order } from '@/types';
import { formatRupiah } from '@/utils/format';

interface SuccessProps {
  order: Order;
}

export default function CheckoutSuccess({ order }: SuccessProps) {
  const estimatedTime = new Date(new Date(order.created_at).getTime() + 30 * 60 * 1000).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <MainLayout>
      <Head title="Pesanan Diterima" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8">
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-[#3d5a2e]/12 text-[#3d5a2e] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[#1f241c]">Pesanan Anda Dicatat</h1>
          <p className="text-sm text-[#575c52] max-w-md mx-auto">
            Status pembayaran saat ini <strong>Menunggu Konfirmasi Kasir</strong> (simulasi). Simpan nomor pesanan di bawah ini untuk melacak statusnya.
          </p>
        </div>

        <div className="bg-white border border-[#E5DFD3] p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#EFE9DC]">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-[#6B7066]">Nomor Pesanan</div>
              <div className="font-editorial text-2xl font-bold text-[#3D5A2E]">{order.order_number}</div>
            </div>
            <div className="text-right">
              <div className="text-[11px] uppercase tracking-wider text-[#6B7066]">Estimasi Siap</div>
              <div className="text-sm font-bold text-[#1F241C] inline-flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#C85A32]" /> {estimatedTime} WIB
              </div>
            </div>
          </div>

          {/* Instruksi Pembayaran Simulasi */}
          <div className="bg-[#FAF7F2] border border-[#DFD8CA] p-4 space-y-2 text-xs">
            <div className="font-semibold uppercase tracking-wider text-[11px] text-[#C85A32]">
              Instruksi Pembayaran ({order.payment_method.toUpperCase()} — Simulasi)
            </div>
            {order.payment_method === 'qris' ? (
              <p className="text-[#4F544B] leading-relaxed">
                Tunjukkan nomor pesanan <strong>{order.order_number}</strong> atau lakukan scan QRIS di kasir sebesar{' '}
                <strong>{formatRupiah(order.total_price)}</strong>. Status akan berubah setelah kasir mengonfirmasi.
              </p>
            ) : (
              <div className="text-[#4F544B] space-y-1">
                <p>Silakan transfer tepat sebesar <strong>{formatRupiah(order.total_price)}</strong> ke salah satu rekening simulasi berikut:</p>
                <p className="font-mono text-[11px] text-[#1F241C]">BCA 1234-567-890 • Mandiri 0987-654-321 (a.n. Dapoer Nusantara)</p>
                <p className="text-[11px] text-[#6B7066]">Cantumkan nomor pesanan <strong>{order.order_number}</strong> pada berita transfer.</p>
              </div>
            )}
          </div>

          <div className="space-y-2.5 text-xs">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between gap-3">
                <span className="text-[#1f241c]">
                  <strong>{item.quantity}x</strong> {item.menu_name}
                </span>
                <span className="font-semibold tabular-nums">{formatRupiah(item.subtotal)}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-[#efe9dc] flex justify-between items-center">
            <span className="text-sm font-bold text-[#1f241c]">Total Pembayaran ({order.payment_method.toUpperCase()})</span>
            <span className="text-lg font-bold text-[#3d5a2e] tabular-nums">{formatRupiah(order.total_price)}</span>
          </div>

          <div className="rounded-2xl bg-[#faf7f2] border border-[#e5dfd3] p-4 flex items-start gap-3 text-xs">
            <MapPin className="w-4 h-4 text-[#3d5a2e] shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-[#1f241c]">
                {order.delivery_type === 'dine-in' ? 'Makan di Tempat (Dine-In)' : 'Pengiriman ke Alamat'}
              </div>
              <div className="text-[#575c52] mt-0.5">
                {order.address}, {order.city} • {order.phone}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/orders"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#3d5a2e] text-white text-xs font-semibold hover:bg-[#2c4221]"
          >
            <ClipboardList className="w-4 h-4" /> Lacak &amp; Lihat Riwayat Pesanan
          </Link>
          <Link
            href="/"
            className="px-6 py-3 rounded-full border border-[#dfd8ca] text-xs font-semibold text-[#1f241c] hover:bg-[#f2ece1]"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}
