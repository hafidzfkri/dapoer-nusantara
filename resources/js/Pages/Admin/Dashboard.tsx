import React from 'react';
import { Head } from '@inertiajs/react';
import { TrendingUp, ShoppingBag, Clock, ChefHat, Users, Award } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';
import { formatRupiah } from '@/utils/format';

interface DashboardProps {
  stats: {
    total_sales: number;
    total_orders: number;
    pending_orders: number;
    processing_orders: number;
    total_customers: number;
  };
  topMenus: Array<{
    menu_name: string;
    total_qty: number;
    total_revenue: number;
  }>;
  salesChart: Array<{
    date: string;
    orders_count: number;
    revenue: number;
  }>;
  recentOrders: Array<{
    id: number;
    order_number: string;
    customer_name: string;
    total_price: number;
    delivery_type: string;
    status: string;
    created_at: string | null;
  }>;
}

const STATUS_STYLE: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800',
  confirmed: 'bg-sky-100 text-sky-800',
  preparing: 'bg-indigo-100 text-indigo-800',
  processing: 'bg-[#3d5a2e]/15 text-[#3d5a2e]',
  ready: 'bg-teal-100 text-teal-800',
  completed: 'bg-emerald-100 text-emerald-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function AdminDashboard({ stats, topMenus, salesChart, recentOrders }: DashboardProps) {
  const maxRevenue = Math.max(1, ...salesChart.map((d) => d.revenue));

  const kpis = [
    { label: 'Total Penjualan', value: formatRupiah(stats.total_sales), icon: TrendingUp, accent: 'text-[#3d5a2e]' },
    { label: 'Total Pesanan', value: stats.total_orders.toString(), icon: ShoppingBag, accent: 'text-[#1f241c]' },
    { label: 'Pesanan Pending', value: stats.pending_orders.toString(), icon: Clock, accent: 'text-[#c85a32]' },
    { label: 'Pesanan Diproses', value: stats.processing_orders.toString(), icon: ChefHat, accent: 'text-[#d99b26]' },
    { label: 'Total Pelanggan', value: stats.total_customers.toString(), icon: Users, accent: 'text-[#3d5a2e]' },
  ];

  return (
    <AdminLayout title="Dashboard Overview">
      <Head title="Admin Dashboard" />

      <div className="space-y-6">
        {/* KPI Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {kpis.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <div key={kpi.label} className="rounded-2xl bg-white border border-[#e5dfd3] p-5 space-y-2">
                <div className="flex items-center justify-between text-xs text-[#6b7066]">
                  <span>{kpi.label}</span>
                  <Icon className={`w-4 h-4 ${kpi.accent}`} />
                </div>
                <div className={`text-xl font-bold tabular-nums ${kpi.accent}`}>{kpi.value}</div>
              </div>
            );
          })}
        </div>

        {/* Chart + Top Menus */}
        <div className="grid lg:grid-cols-12 gap-6">
          {/* 7-Day Sales Chart */}
          <div className="lg:col-span-8 rounded-2xl bg-white border border-[#e5dfd3] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-editorial text-lg font-bold text-[#1f241c]">Penjualan 7 Hari Terakhir</h2>
                <p className="text-xs text-[#6b7066]">Data omzet harian berdasarkan transaksi aktual di database</p>
              </div>
            </div>

            <div className="h-56 flex items-end gap-3 pt-4">
              {salesChart.map((day) => {
                const heightPct = Math.round((day.revenue / maxRevenue) * 100);
                return (
                  <div key={day.date} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <div className="text-[10px] font-semibold text-[#3d5a2e] tabular-nums opacity-0 group-hover:opacity-100 transition-opacity">
                      {formatRupiah(day.revenue)}
                    </div>
                    <div className="w-full max-w-[44px] flex-1 flex items-end bg-[#faf7f2] rounded-xl overflow-hidden border border-[#efe9dc]">
                      <div
                        style={{ height: `${Math.max(day.revenue > 0 ? 8 : 0, heightPct)}%` }}
                        className="w-full bg-[#3d5a2e] group-hover:bg-[#c85a32] transition-all duration-300 rounded-t-lg"
                        title={`${day.date}: ${formatRupiah(day.revenue)} (${day.orders_count} pesanan)`}
                      />
                    </div>
                    <div className="text-[11px] font-medium text-[#575c52]">{day.date}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Selling Menus */}
          <div className="lg:col-span-4 rounded-2xl bg-white border border-[#e5dfd3] p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[#d99b26]" />
              <h2 className="font-editorial text-lg font-bold text-[#1f241c]">Menu Terlaris</h2>
            </div>

            {topMenus.length === 0 ? (
              <p className="text-xs text-[#6b7066] py-8 text-center">Belum ada data penjualan menu.</p>
            ) : (
              <div className="space-y-3">
                {topMenus.map((item, idx) => (
                  <div key={item.menu_name} className="flex items-center justify-between gap-3 pb-2.5 border-b border-[#f0ebe1] last:border-0">
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-[#1f241c] truncate">
                        {idx + 1}. {item.menu_name}
                      </div>
                      <div className="text-[11px] text-[#6b7066] tabular-nums">{item.total_qty} porsi terjual</div>
                    </div>
                    <span className="text-xs font-bold text-[#3d5a2e] tabular-nums shrink-0">
                      {formatRupiah(item.total_revenue)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="rounded-2xl bg-white border border-[#e5dfd3] p-6 space-y-4">
          <h2 className="font-editorial text-lg font-bold text-[#1f241c]">Pesanan Terbaru</h2>

          {recentOrders.length === 0 ? (
            <p className="text-xs text-[#6b7066] py-6 text-center">Belum ada pesanan yang masuk.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#e5dfd3] text-[#6b7066]">
                    <th className="py-2.5 pr-4 font-semibold">No. Pesanan</th>
                    <th className="py-2.5 pr-4 font-semibold">Pelanggan</th>
                    <th className="py-2.5 pr-4 font-semibold">Layanan</th>
                    <th className="py-2.5 pr-4 font-semibold">Total</th>
                    <th className="py-2.5 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0ebe1]">
                  {recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="py-3 pr-4 font-bold text-[#1f241c]">{order.order_number}</td>
                      <td className="py-3 pr-4 text-[#4f544b]">{order.customer_name}</td>
                      <td className="py-3 pr-4 capitalize text-[#4f544b]">{order.delivery_type}</td>
                      <td className="py-3 pr-4 font-semibold tabular-nums text-[#3d5a2e]">
                        {formatRupiah(order.total_price)}
                      </td>
                      <td className="py-3">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                            STATUS_STYLE[order.status] ?? 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
