import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';

interface LogRow {
  id: number;
  activity: string;
  description: string;
  ip_address: string | null;
  created_at: string;
  user?: { id: number; name: string; email: string } | null;
}

export default function AdminActivityLogsIndex({ logs, filters }: { logs: LogRow[]; filters: { activity: string } }) {
  const [activity, setActivity] = useState(filters.activity);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    router.get('/admin/activity-logs', { activity }, { preserveState: true });
  };

  return (
    <AdminLayout title="Activity Log">
      <Head title="Activity Log" />

      <div className="space-y-5">
        <form onSubmit={submit} className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#6b7066] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              placeholder="Filter aktivitas (misal: auth, payment)..."
              className="pl-9 pr-3 py-2 rounded-xl bg-white border border-[#dfd8ca] text-xs w-64"
            />
          </div>
          <button type="submit" className="px-4 py-2 rounded-xl bg-[#f2ece1] text-xs font-semibold cursor-pointer">
            Filter
          </button>
        </form>

        <div className="rounded-2xl bg-white border border-[#e5dfd3] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#faf7f2] border-b border-[#e5dfd3] text-[#6b7066]">
                  <th className="p-3.5 font-semibold">Waktu</th>
                  <th className="p-3.5 font-semibold">Pengguna</th>
                  <th className="p-3.5 font-semibold">Aktivitas</th>
                  <th className="p-3.5 font-semibold">Deskripsi</th>
                  <th className="p-3.5 font-semibold">IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0ebe1]">
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td className="p-3.5 tabular-nums text-[#6b7066]">
                      {new Date(log.created_at).toLocaleString('id-ID')}
                    </td>
                    <td className="p-3.5 font-semibold text-[#1f241c]">{log.user?.email ?? 'Guest/System'}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded bg-[#f2ece1] text-[#3d5a2e] font-mono text-[11px]">
                        {log.activity}
                      </span>
                    </td>
                    <td className="p-3.5 text-[#4f544b]">{log.description}</td>
                    <td className="p-3.5 font-mono text-[11px] text-[#6b7066]">{log.ip_address ?? '-'}</td>
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
