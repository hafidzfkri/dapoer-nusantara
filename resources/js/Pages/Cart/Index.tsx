import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Trash2, Minus, Plus, Utensils, Bike, ArrowRight } from 'lucide-react';
import MainLayout from '@/layouts/MainLayout';
import type { CartItem } from '@/types';
import { formatRupiah } from '@/utils/format';

interface CartIndexProps {
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  deliveryType: 'dine-in' | 'delivery';
}

export default function CartIndex({ items, subtotal, tax, shipping, total, deliveryType }: CartIndexProps) {
  const updateQty = (key: string, qty: number) => {
    router.post('/cart/update', { key, quantity: Math.max(1, Math.min(20, qty)) }, { preserveScroll: true });
  };

  const removeItem = (key: string) => {
    router.post('/cart/remove', { key }, { preserveScroll: true });
  };

  const setDelivery = (type: 'dine-in' | 'delivery') => {
    router.post('/cart/delivery-type', { delivery_type: type }, { preserveScroll: true });
  };

  return (
    <MainLayout>
      <Head title="Keranjang Belanja" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        <div>
          <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[#1f241c]">Keranjang Belanja</h1>
          <p className="text-sm text-[#575c52] mt-1">
            Periksa kembali racikan menu Anda sebelum melanjutkan ke pembayaran.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="rounded-3xl bg-white border border-[#e5dfd3] p-12 text-center space-y-4">
            <h2 className="font-editorial text-2xl font-bold text-[#1f241c]">Keranjang Anda Masih Kosong</h2>
            <p className="text-sm text-[#6b7066]">Pilih hidangan Nusantara favorit Anda terlebih dahulu.</p>
            <Link
              href="/#katalog-menu"
              className="inline-block px-6 py-3 rounded-full bg-[#3d5a2e] text-white text-xs font-semibold hover:bg-[#2c4221]"
            >
              Jelajahi Menu
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Items + Delivery Mode */}
            <div className="lg:col-span-8 space-y-6">
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.key}
                    className="rounded-2xl bg-white border border-[#e5dfd3] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={item.menu.image_url}
                        alt={item.menu.name}
                        className="w-20 h-20 rounded-xl object-cover bg-[#ebe4d6] shrink-0"
                      />
                      <div>
                        <h3 className="font-editorial text-lg font-bold text-[#1f241c]">{item.menu.name}</h3>
                        <p className="text-xs text-[#6b7066] mt-0.5">
                          Pedas: <span className="font-medium text-[#1f241c]">{item.spice_level}</span>
                          {item.addons.length > 0 && (
                            <> • +{item.addons.map((a) => a.name).join(', ')}</>
                          )}
                        </p>
                        <p className="text-xs font-bold text-[#3d5a2e] tabular-nums mt-1">
                          {formatRupiah(item.unit_price)} / porsi
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      <div className="flex items-center border border-[#dfd8ca] rounded-full px-2 py-1">
                        <button
                          type="button"
                          onClick={() => updateQty(item.key, item.quantity - 1)}
                          className="p-1 cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold tabular-nums">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQty(item.key, item.quantity + 1)}
                          className="p-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-right min-w-[90px]">
                        <div className="text-sm font-bold text-[#1f241c] tabular-nums">
                          {formatRupiah(item.subtotal)}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.key)}
                        className="p-2 rounded-full text-[#c85a32] hover:bg-[#c85a32]/10 cursor-pointer"
                        aria-label="Hapus item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery Type Selector */}
              <div className="rounded-2xl bg-white border border-[#e5dfd3] p-5 space-y-3">
                <h2 className="font-editorial text-lg font-bold text-[#1f241c]">Cara Menikmati Pesanan</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setDelivery('dine-in')}
                    className={`p-4 rounded-xl border text-left flex items-center gap-3 transition-colors cursor-pointer ${
                      deliveryType === 'dine-in'
                        ? 'border-[#3d5a2e] bg-[#3d5a2e]/8'
                        : 'border-[#e5dfd3] hover:border-[#3d5a2e]/50'
                    }`}
                  >
                    <Utensils className="w-5 h-5 text-[#3d5a2e]" />
                    <div>
                      <div className="text-sm font-bold text-[#1f241c]">Makan di Tempat (Dine-In)</div>
                      <div className="text-xs text-[#6b7066]">Tanpa biaya antar (Rp 0)</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDelivery('delivery')}
                    className={`p-4 rounded-xl border text-left flex items-center gap-3 transition-colors cursor-pointer ${
                      deliveryType === 'delivery'
                        ? 'border-[#3d5a2e] bg-[#3d5a2e]/8'
                        : 'border-[#e5dfd3] hover:border-[#3d5a2e]/50'
                    }`}
                  >
                    <Bike className="w-5 h-5 text-[#c85a32]" />
                    <div>
                      <div className="text-sm font-bold text-[#1f241c]">Pengiriman (Delivery)</div>
                      <div className="text-xs text-[#6b7066]">Antar ke alamat (+Rp 12.000)</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="lg:col-span-4 rounded-3xl bg-white border border-[#e5dfd3] p-6 space-y-4 sticky top-24">
              <h2 className="font-editorial text-xl font-bold text-[#1f241c]">Ringkasan Pesanan</h2>
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between text-[#575c52]">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#1f241c] tabular-nums">{formatRupiah(subtotal)}</span>
                </div>
                <div className="flex justify-between text-[#575c52]">
                  <span>Pajak Restoran (10%)</span>
                  <span className="font-semibold text-[#1f241c] tabular-nums">{formatRupiah(tax)}</span>
                </div>
                <div className="flex justify-between text-[#575c52]">
                  <span>Biaya Pengiriman</span>
                  <span className="font-semibold text-[#1f241c] tabular-nums">{formatRupiah(shipping)}</span>
                </div>
                <div className="pt-3 border-t border-[#e5dfd3] flex justify-between text-base font-bold text-[#1f241c]">
                  <span>Total</span>
                  <span className="text-[#3d5a2e] tabular-nums">{formatRupiah(total)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-full bg-[#3d5a2e] text-white text-xs font-semibold hover:bg-[#2c4221] transition-colors"
              >
                Lanjut ke Checkout <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/#katalog-menu"
                className="w-full inline-flex items-center justify-center py-3 px-5 rounded-full border border-[#dfd8ca] text-xs font-semibold text-[#1f241c] hover:bg-[#faf7f2]"
              >
                Tambah Menu Lain
              </Link>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
