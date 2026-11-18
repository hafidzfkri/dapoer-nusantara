import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Calendar, Clock, Users } from 'lucide-react';
import MainLayout from '@/layouts/MainLayout';

interface ReservationItem {
  id: number;
  booking_code: string | null;
  customer_name: string;
  customer_phone: string;
  reservation_date: string;
  reservation_time: string;
  guest_count: number;
  status: string;
  table?: { id: number; table_number: string; capacity: number } | null;
}

const STATUS_STYLE: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800',
  confirmed: 'bg-[#3D5A2E]/15 text-[#3D5A2E]',
  seated: 'bg-sky-100 text-sky-800',
  completed: 'bg-emerald-100 text-emerald-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function ReservationsIndex({ reservations }: { reservations: ReservationItem[] }) {
  return (
    <MainLayout>
      <Head title="Reservasi Saya" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#DFD8CA] pb-5">
          <div>
            <span className="text-[11px] uppercase tracking-[0.22em] text-[#C85A32]">Daftar Kunjungan</span>
            <h1 className="font-editorial text-4xl font-normal text-[#1F241C] mt-1">Reservasi Saya</h1>
          </div>
          <Link
            href="/#reservation"
            className="px-5 py-2.5 bg-[#1F241C] text-[#FAF7F2] text-xs font-semibold uppercase tracking-wider hover:bg-[#3D5A2E] transition-colors"
          >
            Buat Reservasi Baru
          </Link>
        </div>

        {reservations.length === 0 ? (
          <div className="bg-white border border-[#E5DFD3] p-12 text-center space-y-3">
            <h2 className="font-editorial text-2xl font-normal text-[#1F241C]">Belum Ada Reservasi</h2>
            <p className="text-xs text-[#6B7066]">
              Reservasi meja yang Anda buat saat login akan tampil beserta kode booking di halaman ini.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#DFD8CA] bg-white border border-[#E5DFD3]">
            {reservations.map((r) => (
              <div key={r.id} className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-[#3D5A2E]">
                      {r.booking_code ?? `#${r.id}`}
                    </span>
                    <span className="font-editorial text-xl text-[#1F241C]">
                      Meja {r.table?.table_number ?? '-'}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#575C52]">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> {r.reservation_date}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {r.reservation_time} WIB
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" /> {r.guest_count} Tamu
                    </span>
                  </div>
                </div>

                <span
                  className={`self-start sm:self-center px-3 py-1 text-[10px] font-semibold uppercase tracking-wider ${
                    STATUS_STYLE[r.status] ?? 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
