import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';

interface RoleData {
  id: number;
  name: string;
  display_name: string;
  description: string | null;
  permissions: number[];
}

interface PermissionData {
  id: number;
  name: string;
  display_name: string;
  group: string;
}

interface RolesProps {
  roles: RoleData[];
  permissions: PermissionData[];
}

export default function AdminRolesIndex({ roles, permissions }: RolesProps) {
  const [selectedRoleId, setSelectedRoleId] = useState<number>(roles[1]?.id ?? roles[0]?.id ?? 0);
  const currentRole = roles.find((r) => r.id === selectedRoleId) ?? roles[0];
  const [checkedIds, setCheckedIds] = useState<number[]>(currentRole?.permissions ?? []);

  const selectRole = (role: RoleData) => {
    setSelectedRoleId(role.id);
    setCheckedIds(role.permissions);
  };

  const togglePerm = (id: number) => {
    if (currentRole?.name === 'admin') return;
    setCheckedIds((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
  };

  const savePermissions = () => {
    if (!currentRole || currentRole.name === 'admin') return;
    router.put(`/admin/roles/${currentRole.id}/permissions`, { permission_ids: checkedIds });
  };

  return (
    <AdminLayout title="Role & Permission">
      <Head title="Role & Permission" />

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-4 space-y-2">
          {roles.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => selectRole(r)}
              className={`w-full text-left p-4 rounded-2xl border transition-colors cursor-pointer ${
                currentRole?.id === r.id
                  ? 'bg-[#3d5a2e] text-white border-[#3d5a2e]'
                  : 'bg-white text-[#1f241c] border-[#e5dfd3] hover:border-[#3d5a2e]'
              }`}
            >
              <div className="font-bold text-sm">{r.display_name}</div>
              <div className={`text-xs mt-0.5 ${currentRole?.id === r.id ? 'text-white/80' : 'text-[#6b7066]'}`}>
                {r.description}
              </div>
            </button>
          ))}
        </div>

        <div className="lg:col-span-8 rounded-2xl bg-white border border-[#e5dfd3] p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-[#f0ebe1] pb-3">
            <div>
              <h2 className="font-editorial text-xl font-bold">{currentRole?.display_name}</h2>
              <p className="text-xs text-[#6b7066]">
                {currentRole?.name === 'admin'
                  ? 'Administrator memiliki seluruh hak akses secara permanen.'
                  : 'Centang permission yang diizinkan untuk role ini.'}
              </p>
            </div>
            {currentRole?.name !== 'admin' && (
              <button
                type="button"
                onClick={savePermissions}
                className="px-4 py-2 rounded-full bg-[#3d5a2e] text-white text-xs font-semibold cursor-pointer"
              >
                Simpan Izin
              </button>
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-2.5 text-xs">
            {permissions.map((perm) => {
              const checked = currentRole?.name === 'admin' || checkedIds.includes(perm.id);
              return (
                <label
                  key={perm.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-[#e5dfd3] cursor-pointer"
                >
                  <div>
                    <div className="font-semibold text-[#1f241c]">{perm.display_name}</div>
                    <div className="text-[11px] text-[#6b7066]">{perm.name}</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={checked}
                    disabled={currentRole?.name === 'admin'}
                    onChange={() => togglePerm(perm.id)}
                    className="accent-[#3d5a2e]"
                  />
                </label>
              );
            })}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
