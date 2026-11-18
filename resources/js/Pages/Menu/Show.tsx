import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, Clock, Minus, Plus, ShoppingBag, Check } from 'lucide-react';
import MainLayout from '@/layouts/MainLayout';
import type { MenuItem, PageProps } from '@/types';
import { formatRupiah } from '@/utils/format';

interface ShowProps {
  menu: MenuItem;
  related: MenuItem[];
}

const SPICE_LEVELS: Array<'Tidak Pedas' | 'Sedang' | 'Pedas'> = ['Tidak Pedas', 'Sedang', 'Pedas'];

const ADDONS = [
  { name: 'Telur Balado', price: 10000 },
  { name: 'Tempe Goreng', price: 10000 },
  { name: 'Tahu Goreng', price: 10000 },
  { name: 'Pisang Goreng', price: 12000 },
];

export default function Show({ menu, related }: ShowProps) {
  const { auth } = usePage<PageProps>().props;
  const isStaff = !!auth.user && auth.user.role !== 'customer';
  const [spiceLevel, setSpiceLevel] = useState<'Tidak Pedas' | 'Sedang' | 'Pedas'>('Tidak Pedas');
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [submitting, setSubmitting] = useState(false);

  const toggleAddon = (name: string) => {
    setSelectedAddons((prev) => (prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name]));
  };

  const addonTotal = ADDONS.filter((a) => selectedAddons.includes(a.name)).reduce((s, a) => s + a.price, 0);
  const unitPrice = menu.price + addonTotal;
  const total = unitPrice * quantity;

  const handleSubmit = () => {
    if (!auth.user) {
      router.visit('/login');
      return;
    }

    setSubmitting(true);
    router.post(
      '/cart/add',
      {
        menu_id: menu.id,
        quantity,
        spice_level: spiceLevel,
        addons: selectedAddons,
      },
      {
        onFinish: () => setSubmitting(false),
      }
    );
  };

  return (
    <MainLayout>
      <Head title={menu.name} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-14">
        <Link
          href="/#katalog-menu"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#4f544b] hover:text-[#3d5a2e]"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Menu
        </Link>

        <div className="grid md:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="md:col-span-6 rounded-3xl overflow-hidden bg-[#ebe4d6] border border-[#e5dfd3] aspect-[4/3]">
            <img src={menu.image_url} alt={menu.name} className="w-full h-full object-cover" />
          </div>

          <div className="md:col-span-6 space-y-6">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-[#f2ece1] text-[#c85a32] text-xs font-semibold">
                {menu.category?.name}
              </span>
              <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[#1f241c] mt-2">{menu.name}</h1>
              <p className="text-xl font-bold text-[#3d5a2e] tabular-nums mt-2">{formatRupiah(unitPrice)}</p>
              <p className="text-sm text-[#575c52] leading-relaxed mt-3">{menu.description}</p>
            </div>

            <div className="flex flex-wrap gap-3 text-xs text-[#575c52]">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#e5dfd3]">
                <Clock className="w-3.5 h-3.5 text-[#3d5a2e]" />
                {menu.cook_time}–{menu.cook_time + 5} menit masak
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#e5dfd3]">
                <Check className="w-3.5 h-3.5 text-[#3d5a2e]" />
                Rempah Utuh Tanpa MSG
              </span>
            </div>

            {/* Spice */}
            <div>
              <label className="block text-xs font-semibold text-[#1f241c] mb-2">Tingkat Kepedasan</label>
              <div className="grid grid-cols-3 gap-2.5">
                {SPICE_LEVELS.map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setSpiceLevel(level)}
                    className={`py-2.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                      spiceLevel === level
                        ? 'bg-[#3d5a2e] text-white border-[#3d5a2e]'
                        : 'bg-white text-[#4f544b] border-[#dfd8ca] hover:border-[#3d5a2e]'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Addons */}
            <div>
              <label className="block text-xs font-semibold text-[#1f241c] mb-2">Tambahan Lauk</label>
              <div className="grid sm:grid-cols-2 gap-2.5">
                {ADDONS.map((addon) => {
                  const checked = selectedAddons.includes(addon.name);
                  return (
                    <button
                      key={addon.name}
                      type="button"
                      onClick={() => toggleAddon(addon.name)}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs border transition-colors cursor-pointer ${
                        checked
                          ? 'bg-[#3d5a2e]/10 border-[#3d5a2e] text-[#1f241c] font-semibold'
                          : 'bg-white border-[#dfd8ca] text-[#4f544b]'
                      }`}
                    >
                      <span>{addon.name}</span>
                      <span className="tabular-nums text-[#6b7066]">+{formatRupiah(addon.price)}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            {isStaff ? (
              <div className="p-4 border border-[#DFD8CA] bg-white text-xs text-[#575C52]">
                Mode Pratinjau Staff ({auth.user?.role_label}) — Pemesanan melalui keranjang hanya tersedia untuk akun Pelanggan.
              </div>
            ) : (
              <div className="flex items-center gap-3 pt-2">
                <div className="flex items-center border border-[#dfd8ca] rounded-full bg-white px-2.5 py-1.5">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-1.5 cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-9 text-center text-sm font-bold tabular-nums">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                    className="p-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleSubmit}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-[#3d5a2e] text-white text-sm font-semibold hover:bg-[#2c4221] disabled:opacity-60 transition-colors cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{submitting ? 'Menambahkan...' : `Tambah ke Keranjang — ${formatRupiah(total)}`}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="pt-8 border-t border-[#e5dfd3] space-y-5">
            <h2 className="font-editorial text-2xl font-bold text-[#1f241c]">Sempurnakan Hidanganmu</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {related.map((item) => (
                <Link
                  key={item.id}
                  href={`/menu/${item.slug}`}
                  className="rounded-2xl bg-white border border-[#e5dfd3] overflow-hidden hover:border-[#3d5a2e] transition-colors"
                >
                  <div className="aspect-[16/10] bg-[#ebe4d6]">
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-3.5">
                    <h3 className="font-editorial text-base font-bold text-[#1f241c]">{item.name}</h3>
                    <p className="text-xs font-bold text-[#3d5a2e] tabular-nums mt-1">{formatRupiah(item.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </MainLayout>
  );
}
