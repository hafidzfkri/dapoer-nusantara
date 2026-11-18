import React, { useState } from 'react';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';
import type { Category, PageProps } from '@/types';

interface CategoriesProps {
  categories: Array<Category & { menus_count: number }>;
}

export default function AdminCategoriesIndex({ categories }: CategoriesProps) {
  const { errors } = usePage<PageProps>().props;
  const [editing, setEditing] = useState<Category | null>(null);
  const form = useForm({ name: '', icon: 'utensils' });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      form.put(`/admin/categories/${editing.id}`, {
        onSuccess: () => {
          setEditing(null);
          form.reset();
        },
      });
    } else {
      form.post('/admin/categories', {
        onSuccess: () => form.reset(),
      });
    }
  };

  return (
    <AdminLayout title="Manajemen Kategori">
      <Head title="Manajemen Kategori" />

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        <form onSubmit={submit} className="lg:col-span-4 rounded-2xl bg-white border border-[#e5dfd3] p-5 space-y-4 text-xs">
          <h2 className="font-editorial text-lg font-bold">
            {editing ? 'Edit Kategori' : 'Tambah Kategori'}
          </h2>
          <div>
            <label className="block font-semibold mb-1">Nama Kategori</label>
            <input
              type="text"
              value={form.data.name}
              onChange={(e) => form.setData('name', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#dfd8ca]"
              required
            />
            {errors.name && <p className="text-[#c85a32] mt-1">{errors.name}</p>}
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={form.processing}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#3d5a2e] text-white font-semibold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> {editing ? 'Perbarui' : 'Simpan'}
            </button>
            {editing && (
              <button
                type="button"
                onClick={() => {
                  setEditing(null);
                  form.reset();
                }}
                className="px-4 py-2 rounded-full border border-[#dfd8ca] cursor-pointer"
              >
                Batal
              </button>
            )}
          </div>
        </form>

        <div className="lg:col-span-8 rounded-2xl bg-white border border-[#e5dfd3] overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#faf7f2] border-b border-[#e5dfd3] text-[#6b7066]">
                <th className="p-3.5 font-semibold">Nama</th>
                <th className="p-3.5 font-semibold">Slug</th>
                <th className="p-3.5 font-semibold">Jumlah Menu</th>
                <th className="p-3.5 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0ebe1]">
              {categories.map((cat) => (
                <tr key={cat.id}>
                  <td className="p-3.5 font-bold text-[#1f241c]">{cat.name}</td>
                  <td className="p-3.5 text-[#6b7066]">{cat.slug}</td>
                  <td className="p-3.5 tabular-nums">{cat.menus_count}</td>
                  <td className="p-3.5 text-right space-x-1">
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(cat);
                        form.setData({ name: cat.name, icon: cat.icon ?? 'utensils' });
                      }}
                      className="p-1.5 rounded-lg border border-[#dfd8ca] cursor-pointer"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Hapus kategori "${cat.name}"?`)) {
                          router.delete(`/admin/categories/${cat.id}`);
                        }
                      }}
                      className="p-1.5 rounded-lg border border-[#dfd8ca] text-[#c85a32] cursor-pointer"
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
    </AdminLayout>
  );
}
