import React from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { MapPin, CreditCard, Utensils, Bike } from 'lucide-react';
import MainLayout from '@/layouts/MainLayout';
import type { CartItem, PageProps } from '@/types';
import { formatRupiah } from '@/utils/format';

interface CheckoutProps {
  items: Array<Omit<CartItem, 'key'>>;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  deliveryType: 'dine-in' | 'delivery';
}

export default function CheckoutIndex({ items, subtotal, tax, shipping, total, deliveryType }: CheckoutProps) {
  const { auth, errors } = usePage<PageProps>().props;

  const { data, setData, post, processing } = useForm({
    name: auth.user?.name ?? '',
    phone: auth.user?.phone ?? '',
    delivery_type: deliveryType,
    address: '',
    city: '',
    payment_method: 'qris' as 'qris' | 'transfer',
    notes: '',
  });

  const activeShipping = data.delivery_type === 'delivery' ? 12000 : 0;
  const activeTotal = subtotal + tax + activeShipping;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/checkout');
  };

  return (
    <MainLayout>
      <Head title="Konfirmasi Pesanan" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        <div>
          <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[#1f241c]">Konfirmasi Pesanan</h1>
          <p className="text-sm text-[#575c52] mt-1">Lengkapi detail penerima dan metode pembayaran Anda.</p>
        </div>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-6">
            {/* Delivery Mode */}
            <div className="rounded-2xl bg-white border border-[#e5dfd3] p-6 space-y-4">
              <h2 className="font-editorial text-lg font-bold text-[#1f241c]">Tipe Layanan</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setData('delivery_type', 'dine-in')}
                  className={`p-3.5 rounded-xl border text-left flex items-center gap-3 cursor-pointer ${
                    data.delivery_type === 'dine-in'
                      ? 'border-[#3d5a2e] bg-[#3d5a2e]/8'
                      : 'border-[#e5dfd3]'
                  }`}
                >
                  <Utensils className="w-4 h-4 text-[#3d5a2e]" />
                  <div>
                    <div className="text-xs font-bold">Makan di Tempat</div>
                    <div className="text-[11px] text-[#6b7066]">Ongkir Rp 0</div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setData('delivery_type', 'delivery')}
                  className={`p-3.5 rounded-xl border text-left flex items-center gap-3 cursor-pointer ${
                    data.delivery_type === 'delivery'
                      ? 'border-[#3d5a2e] bg-[#3d5a2e]/8'
                      : 'border-[#e5dfd3]'
                  }`}
                >
                  <Bike className="w-4 h-4 text-[#c85a32]" />
                  <div>
                    <div className="text-xs font-bold">Pengiriman ke Alamat</div>
                    <div className="text-[11px] text-[#6b7066]">Ongkir Rp 12.000</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Recipient & Address */}
            <div className="rounded-2xl bg-white border border-[#e5dfd3] p-6 space-y-4">
              <h2 className="font-editorial text-lg font-bold text-[#1f241c] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#3d5a2e]" /> Detail Pemesan
              </h2>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5">Nama Pemesan</label>
                  <input
                    type="text"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#dfd8ca] text-xs focus:outline-none focus:border-[#3d5a2e]"
                    required
                  />
                  {errors.name && <p className="text-[11px] text-[#c85a32] mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1.5">Nomor Telepon</label>
                  <input
                    type="tel"
                    value={data.phone}
                    onChange={(e) => setData('phone', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#dfd8ca] text-xs focus:outline-none focus:border-[#3d5a2e]"
                    required
                  />
                  {errors.phone && <p className="text-[11px] text-[#c85a32] mt-1">{errors.phone}</p>}
                </div>
              </div>

              {data.delivery_type === 'delivery' && (
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1.5">Alamat Lengkap</label>
                    <input
                      type="text"
                      value={data.address}
                      onChange={(e) => setData('address', e.target.value)}
                      placeholder="Contoh: Jl. Naskah Lr. Abdullah No. 12, Sukarami"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#dfd8ca] text-xs focus:outline-none focus:border-[#3d5a2e]"
                      required
                    />
                    {errors.address && <p className="text-[11px] text-[#c85a32] mt-1">{errors.address}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5">Kota</label>
                    <input
                      type="text"
                      value={data.city}
                      onChange={(e) => setData('city', e.target.value)}
                      placeholder="Palembang"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#dfd8ca] text-xs focus:outline-none focus:border-[#3d5a2e]"
                      required
                    />
                    {errors.city && <p className="text-[11px] text-[#c85a32] mt-1">{errors.city}</p>}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold mb-1.5">Catatan Tambahan (Opsional)</label>
                <textarea
                  value={data.notes}
                  onChange={(e) => setData('notes', e.target.value)}
                  rows={2}
                  placeholder="Contoh: Tanpa seledri, atau nomor meja jika dine-in..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#dfd8ca] text-xs focus:outline-none focus:border-[#3d5a2e]"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="rounded-2xl bg-white border border-[#e5dfd3] p-6 space-y-4">
              <h2 className="font-editorial text-lg font-bold text-[#1f241c] flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#3d5a2e]" /> Metode Pembayaran
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setData('payment_method', 'qris')}
                  className={`p-4 rounded-xl border text-left cursor-pointer ${
                    data.payment_method === 'qris' ? 'border-[#3d5a2e] bg-[#3d5a2e]/8' : 'border-[#e5dfd3]'
                  }`}
                >
                  <div className="text-xs font-bold text-[#1f241c]">QRIS</div>
                  <div className="text-[11px] text-[#6b7066] mt-0.5">Scan instan via e-wallet &amp; m-banking</div>
                </button>
                <button
                  type="button"
                  onClick={() => setData('payment_method', 'transfer')}
                  className={`p-4 rounded-xl border text-left cursor-pointer ${
                    data.payment_method === 'transfer' ? 'border-[#3d5a2e] bg-[#3d5a2e]/8' : 'border-[#e5dfd3]'
                  }`}
                >
                  <div className="text-xs font-bold text-[#1f241c]">Transfer Bank</div>
                  <div className="text-[11px] text-[#6b7066] mt-0.5">BCA, Mandiri, BNI</div>
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4 rounded-3xl bg-white border border-[#e5dfd3] p-6 space-y-4 sticky top-24">
            <h2 className="font-editorial text-xl font-bold text-[#1f241c]">Ringkasan</h2>
            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1 text-xs">
              {items.map((item, idx) => (
                <div key={idx} className="flex justify-between gap-2 pb-2 border-b border-[#f0ebe1]">
                  <div>
                    <div className="font-semibold text-[#1f241c]">
                      {item.quantity}x {item.menu.name}
                    </div>
                    <div className="text-[11px] text-[#6b7066]">
                      {item.spice_level}
                      {item.addons.length > 0 ? ` • +${item.addons.map((a) => a.name).join(', ')}` : ''}
                    </div>
                  </div>
                  <span className="font-semibold tabular-nums shrink-0">{formatRupiah(item.subtotal)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-xs pt-2">
              <div className="flex justify-between text-[#575c52]">
                <span>Subtotal</span>
                <span className="tabular-nums font-semibold">{formatRupiah(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#575c52]">
                <span>Pajak (10%)</span>
                <span className="tabular-nums font-semibold">{formatRupiah(tax)}</span>
              </div>
              <div className="flex justify-between text-[#575c52]">
                <span>Ongkir</span>
                <span className="tabular-nums font-semibold">{formatRupiah(activeShipping)}</span>
              </div>
              <div className="pt-3 border-t border-[#e5dfd3] flex justify-between text-base font-bold">
                <span>Total Bayar</span>
                <span className="text-[#3d5a2e] tabular-nums">{formatRupiah(activeTotal)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={processing}
              className="w-full py-3.5 px-5 rounded-full bg-[#3d5a2e] text-white text-xs font-semibold hover:bg-[#2c4221] disabled:opacity-60 transition-colors cursor-pointer"
            >
              {processing ? 'Memproses Pesanan...' : 'Konfirmasi & Pesan Sekarang'}
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
