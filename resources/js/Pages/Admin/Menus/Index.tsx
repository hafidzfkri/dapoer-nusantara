import React, { useState } from 'react';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { Plus, Pencil, Trash2, Search, X } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';
import type { Category, MenuItem, PageProps } from '@/types';
import { formatRupiah } from '@/utils/format';

interface MenusIndexProps {
  menus: MenuItem[];
  categories: Category[];
  filters: {
    search: string;
    category_id: string;
  };
}

export default function AdminMenusIndex({ menus, categories, filters }: MenusIndexProps) {
  const { errors } = usePage<PageProps>().props;
  const [search, setSearch] = useState(filters.search);
  const [categoryId, setCategoryId] = useState(filters.category_id);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState<MenuItem | null>(null);

  const form = useForm<{
    category_id: string;
    name: string;
    subcategory: string;
    description: string;
    price: string;
    cook_time: string;
    is_available: boolean;
    image: File | null;
  }>({
    category_id: categories[0]?.id ? String(categories[0].id) : '',
    name: '',
    subcategory: '',
    description: '',
    price: '',
    cook_time: '20',
    is_available: true,
    image: null,
  });

  const applyFilter = (e: React.FormEvent) => {
    e.preventDefault();
    router.get('/admin/menus', { search, category_id: categoryId }, { preserveState: true });
  };

  const openCreate = () => {
    setEditingMenu(null);
    form.setData({
      category_id: categories[0]?.id ? String(categories[0].id) : '',
      name: '',
      subcategory: '',
      description: '',
      price: '',
      cook_time: '20',
      is_available: true,
      image: null,
    });
    setModalOpen(true);
  };

  const openEdit = (menu: MenuItem) => {
    setEditingMenu(menu);
    form.setData({
      category_id: String(menu.category_id),
      name: menu.name,
      subcategory: menu.subcategory ?? '',
      description: menu.description,
      price: String(menu.price),
      cook_time: String(menu.cook_time),
      is_available: menu.is_available,
      image: null,
    });
    setModalOpen(true);
  };

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMenu) {
      router.post(
        `/admin/menus/${editingMenu.id}`,
        { _method: 'PUT', ...form.data },
        { forceFormData: true, onSuccess: () => setModalOpen(false) }
      );
    } else {
      form.post('/admin/menus', {
        forceFormData: true,
        onSuccess: () => setModalOpen(false),
      });
    }
  };

  return (
    <AdminLayout title="Manajemen Menu">
      <Head title="Manajemen Menu" />

      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <form onSubmit={applyFilter} className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#6b7066] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari menu..."
                className="pl-9 pr-3 py-2 rounded-xl bg-white border border-[#dfd8ca] text-xs"
              />
            </div>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white border border-[#dfd8ca] text-xs"
            >
              <option value="">Semua Kategori</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#f2ece1] text-xs font-semibold text-[#1f241c] cursor-pointer"
            >
              Filter
            </button>
          </form>

          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#3d5a2e] text-white text-xs font-semibold hover:bg-[#2c4221] cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Tambah Menu
          </button>
        </div>

        <div className="rounded-2xl bg-white border border-[#e5dfd3] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#faf7f2] border-b border-[#e5dfd3] text-[#6b7066]">
                  <th className="p-3.5 font-semibold">Menu</th>
                  <th className="p-3.5 font-semibold">Kategori</th>
                  <th className="p-3.5 font-semibold">Harga</th>
                  <th className="p-3.5 font-semibold">Status</th>
                  <th className="p-3.5 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0ebe1]">
                {menus.map((menu) => (
                  <tr key={menu.id}>
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={menu.image_url}
                          alt={menu.name}
                          className="w-11 h-11 rounded-lg object-cover bg-[#ebe4d6] shrink-0"
                        />
                        <div>
                          <div className="font-bold text-[#1f241c]">{menu.name}</div>
                          <div className="text-[11px] text-[#6b7066]">{menu.subcategory || '-'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5 text-[#4f544b]">{menu.category?.name}</td>
                    <td className="p-3.5 font-semibold tabular-nums text-[#3d5a2e]">{formatRupiah(menu.price)}</td>
                    <td className="p-3.5">
                      <button
                        type="button"
                        onClick={() => router.patch(`/admin/menus/${menu.id}/toggle`)}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-semibold cursor-pointer ${
                          menu.is_available
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {menu.is_available ? 'Tersedia' : 'Habis'}
                      </button>
                    </td>
                    <td className="p-3.5 text-right space-x-1">
                      <button
                        type="button"
                        onClick={() => openEdit(menu)}
                        className="p-1.5 rounded-lg border border-[#dfd8ca] hover:bg-[#faf7f2] cursor-pointer"
                        title="Edit"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Hapus menu "${menu.name}"?`)) {
                            router.delete(`/admin/menus/${menu.id}`);
                          }
                        }}
                        className="p-1.5 rounded-lg border border-[#dfd8ca] text-[#c85a32] hover:bg-[#c85a32]/10 cursor-pointer"
                        title="Hapus"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Create/Edit */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-[#e5dfd3] p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="font-editorial text-xl font-bold">
                {editingMenu ? 'Edit Menu' : 'Tambah Menu Baru'}
              </h2>
              <button type="button" onClick={() => setModalOpen(false)} className="p-1 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={submitForm} className="space-y-3 text-xs">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Nama Menu</label>
                  <input
                    type="text"
                    value={form.data.name}
                    onChange={(e) => form.setData('name', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#dfd8ca]"
                    required
                  />
                  {errors.name && <p className="text-[#c85a32] mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block font-semibold mb-1">Kategori</label>
                  <select
                    value={form.data.category_id}
                    onChange={(e) => form.setData('category_id', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#dfd8ca]"
                    required
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Subkategori</label>
                  <input
                    type="text"
                    value={form.data.subcategory}
                    onChange={(e) => form.setData('subcategory', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#dfd8ca]"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Harga (Rp)</label>
                  <input
                    type="number"
                    min={1000}
                    value={form.data.price}
                    onChange={(e) => form.setData('price', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#dfd8ca]"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Waktu Masak (mnt)</label>
                  <input
                    type="number"
                    min={1}
                    value={form.data.cook_time}
                    onChange={(e) => form.setData('cook_time', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#dfd8ca]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Deskripsi</label>
                <textarea
                  rows={3}
                  value={form.data.description}
                  onChange={(e) => form.setData('description', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#dfd8ca]"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Gambar (JPG/PNG/WebP, maks 2MB)</label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => form.setData('image', e.target.files?.[0] ?? null)}
                  className="w-full text-xs"
                />
                {errors.image && <p className="text-[#c85a32] mt-1">{errors.image}</p>}
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.data.is_available}
                  onChange={(e) => form.setData('is_available', e.target.checked)}
                  className="accent-[#3d5a2e]"
                />
                <span>Menu tersedia untuk dipesan</span>
              </label>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-[#dfd8ca] cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#3d5a2e] text-white font-semibold cursor-pointer"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
