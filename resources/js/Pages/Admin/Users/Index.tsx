import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';

interface AdminUserRow {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  is_active: boolean;
  role_id: number | null;
  role_name: string;
  role_label: string;
}

interface UsersProps {
  users: AdminUserRow[];
  roles: Array<{ id: number; name: string; display_name: string }>;
  filters: { search: string; role: string };
}

export default function AdminUsersIndex({ users, roles, filters }: UsersProps) {
  const [search, setSearch] = useState(filters.search);
  const [role, setRole] = useState(filters.role);

  const applyFilter = (e: React.FormEvent) => {
    e.preventDefault();
    router.get('/admin/users', { search, role }, { preserveState: true });
  };

  return (
    <AdminLayout title="Manajemen Pengguna">
      <Head title="Manajemen Pengguna" />

      <div className="space-y-5">
        <form onSubmit={applyFilter} className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#6b7066] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama atau email..."
              className="pl-9 pr-3 py-2 rounded-xl bg-white border border-[#dfd8ca] text-xs"
            />
          </div>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white border border-[#dfd8ca] text-xs"
          >
            <option value="">Semua Role</option>
            {roles.map((r) => (
              <option key={r.id} value={r.name}>
                {r.display_name}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-[#f2ece1] text-xs font-semibold cursor-pointer"
          >
            Filter
          </button>
        </form>

        <div className="rounded-2xl bg-white border border-[#e5dfd3] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#faf7f2] border-b border-[#e5dfd3] text-[#6b7066]">
                  <th className="p-3.5 font-semibold">Pengguna</th>
                  <th className="p-3.5 font-semibold">Telepon</th>
                  <th className="p-3.5 font-semibold">Role</th>
                  <th className="p-3.5 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0ebe1]">
                {users.map((u) => (
                  <tr key={u.id}>
                    <td className="p-3.5">
                      <div className="font-bold text-[#1f241c]">{u.name}</div>
                      <div className="text-[11px] text-[#6b7066]">{u.email}</div>
                    </td>
                    <td className="p-3.5 text-[#4f544b]">{u.phone || '-'}</td>
                    <td className="p-3.5">
                      <select
                        value={u.role_id ?? ''}
                        onChange={(e) =>
                          router.patch(`/admin/users/${u.id}/role`, { role_id: Number(e.target.value) })
                        }
                        className="px-2.5 py-1.5 rounded-lg border border-[#dfd8ca] bg-white text-xs"
                      >
                        {roles.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.display_name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-3.5">
                      <button
                        type="button"
                        onClick={() => router.patch(`/admin/users/${u.id}/toggle`)}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-semibold cursor-pointer ${
                          u.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {u.is_active ? 'Aktif' : 'Nonaktif'}
                      </button>
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
