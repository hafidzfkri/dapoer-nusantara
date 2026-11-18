import React from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import { formatRupiah } from '@/utils/format';

interface SettingsProps {
  system: {
    app_name: string;
    app_env: string;
    app_debug: boolean;
    php_version: string;
    laravel_version: string;
    session_driver: string;
    tax_rate: string;
    delivery_fee: number;
  };
}

export default function AdminSettingsIndex({ system }: SettingsProps) {
  const rows = [
    ['Nama Aplikasi', system.app_name],
    ['Environment', system.app_env],
    ['Debug Mode', system.app_debug ? 'Aktif (Development)' : 'Nonaktif (Production)'],
    ['Versi PHP', system.php_version],
    ['Versi Laravel', system.laravel_version],
    ['Session Driver', system.session_driver],
    ['Pajak Restoran', system.tax_rate],
    ['Tarif Delivery Standar', formatRupiah(system.delivery_fee)],
  ];

  return (
    <AdminLayout title="Pengaturan Sistem">
      <Head title="Pengaturan Sistem" />

      <div className="max-w-2xl rounded-2xl bg-white border border-[#e5dfd3] p-6 space-y-4">
        <h2 className="font-editorial text-lg font-bold text-[#1f241c]">Konfigurasi Sistem &amp; Keamanan</h2>
        <div className="divide-y divide-[#f0ebe1] text-xs">
          {rows.map(([label, value]) => (
            <div key={label} className="py-3 flex justify-between gap-4">
              <span className="text-[#6b7066]">{label}</span>
              <span className="font-semibold text-[#1f241c]">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
