import React, { useEffect, useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import type { MenuItem, PageProps } from '@/types';
import { formatRupiah } from '@/utils/format';

interface MenuCustomizeModalProps {
  menu: MenuItem | null;
  onClose: () => void;
}

const SPICE_LEVELS: Array<'Tidak Pedas' | 'Sedang' | 'Pedas'> = ['Tidak Pedas', 'Sedang', 'Pedas'];

const AVAILABLE_ADDONS = [
  { name: 'Telur Balado', price: 10000 },
  { name: 'Tempe Goreng', price: 10000 },
  { name: 'Tahu Goreng', price: 10000 },
  { name: 'Pisang Goreng', price: 12000 },
];

export default function MenuCustomizeModal({ menu, onClose }: MenuCustomizeModalProps) {
  const { auth } = usePage<PageProps>().props;
  const [spiceLevel, setSpiceLevel] = useState<'Tidak Pedas' | 'Sedang' | 'Pedas'>('Tidak Pedas');
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (menu) {
      setSpiceLevel('Tidak Pedas');
      setSelectedAddons([]);
      setQuantity(1);
    }
  }, [menu]);

  const toggleAddon = (name: string) => {
    setSelectedAddons((prev) => (prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]));
  };

  const addonTotal = AVAILABLE_ADDONS.filter((a) => selectedAddons.includes(a.name)).reduce((s, a) => s + a.price, 0);
  const total = menu ? (menu.price + addonTotal) * quantity : 0;

  const handleAdd = () => {
    if (!menu) return;
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
        preserveScroll: true,
        onFinish: () => {
          setSubmitting(false);
          onClose();
        },
      }
    );
  };

  return (
    <AnimatePresence>
      {menu && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 360, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-[#FAF7F2] border border-[#E5DFD3] overflow-hidden shadow-xl"
          >
            <div className="relative h-48 bg-[#ebe4d6]">
              <img src={menu.image_url} alt={menu.name} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={onClose}
                className="absolute top-3 right-3 p-2 rounded-full bg-white/90 text-[#1f241c] hover:bg-white shadow-xs cursor-pointer"
                aria-label="Tutup"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <span className="text-[11px] uppercase tracking-wider font-semibold text-[#c85a32]">
                  {menu.category?.name}
                </span>
                <div className="flex items-baseline justify-between gap-3 mt-0.5">
                  <h3 className="font-editorial text-2xl font-bold text-[#1f241c]">{menu.name}</h3>
                  <span className="text-base font-bold text-[#3d5a2e] tabular-nums">{formatRupiah(menu.price)}</span>
                </div>
                <p className="text-xs text-[#575c52] mt-1.5 leading-relaxed">{menu.description}</p>
              </div>

              {/* Spice Level */}
              <div>
                <label className="block text-xs font-semibold text-[#1f241c] mb-2">Tingkat Kepedasan</label>
                <div className="grid grid-cols-3 gap-2">
                  {SPICE_LEVELS.map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setSpiceLevel(level)}
                      className={`py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
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

              {/* Add-ons */}
              <div>
                <label className="block text-xs font-semibold text-[#1f241c] mb-2">Tambahan Lauk (Opsional)</label>
                <div className="grid grid-cols-2 gap-2">
                  {AVAILABLE_ADDONS.map((addon) => {
                    const checked = selectedAddons.includes(addon.name);
                    return (
                      <button
                        key={addon.name}
                        type="button"
                        onClick={() => toggleAddon(addon.name)}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs border transition-colors cursor-pointer ${
                          checked
                            ? 'bg-[#3d5a2e]/10 border-[#3d5a2e] text-[#1f241c] font-semibold'
                            : 'bg-white border-[#dfd8ca] text-[#4f544b]'
                        }`}
                      >
                        <span>{addon.name}</span>
                        <span className="text-[11px] tabular-nums text-[#6b7066]">+{formatRupiah(addon.price)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Qty + Submit */}
              <div className="flex items-center gap-3 pt-2">
                <div className="flex items-center border border-[#dfd8ca] rounded-full bg-white px-2 py-1">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-1.5 text-[#1f241c] cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-xs font-bold tabular-nums">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                    className="p-1.5 text-[#1f241c] cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleAdd}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-[#3d5a2e] text-white text-xs font-semibold hover:bg-[#2c4221] disabled:opacity-60 transition-colors cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{submitting ? 'Menambahkan...' : `Tambah — ${formatRupiah(total)}`}</span>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
