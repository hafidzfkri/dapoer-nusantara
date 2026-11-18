import React, { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import {
  LayoutDashboard,
  UtensilsCrossed,
  Tags,
  ClipboardList,
  ChefHat,
  CreditCard,
  CalendarClock,
  Armchair,
  Users,
  ShieldCheck,
  BarChart3,
  History,
  Settings,
  Store,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import type { PageProps } from '@/types';

interface AdminLayoutProps {
  title: string;
  children: React.ReactNode;
}

interface NavItem {
  label: string;
  href: string;
  permission: string;
  icon: React.ComponentType<{ className?: string }>;
  ready: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Overview', href: '/admin', permission: 'dashboard.view', icon: LayoutDashboard, ready: true },
  { label: 'Menu', href: '/admin/menus', permission: 'menu.manage', icon: UtensilsCrossed, ready: true },
  { label: 'Kategori', href: '/admin/categories', permission: 'category.manage', icon: Tags, ready: true },
  { label: 'Pesanan', href: '/admin/orders', permission: 'order.view', icon: ClipboardList, ready: true },
  { label: 'Dapur (KDS)', href: '/admin/kitchen', permission: 'kitchen.manage', icon: ChefHat, ready: true },
  { label: 'Pembayaran', href: '/admin/payments', permission: 'payment.view', icon: CreditCard, ready: true },
  { label: 'Reservasi', href: '/admin/reservations', permission: 'reservation.manage', icon: CalendarClock, ready: true },
  { label: 'Meja', href: '/admin/tables', permission: 'table.manage', icon: Armchair, ready: true },
  { label: 'Pengguna', href: '/admin/users', permission: 'user.manage', icon: Users, ready: true },
  { label: 'Role & Izin', href: '/admin/roles', permission: 'role.manage', icon: ShieldCheck, ready: true },
  { label: 'Laporan', href: '/admin/reports', permission: 'report.view', icon: BarChart3, ready: true },
  { label: 'Activity Log', href: '/admin/activity-logs', permission: 'activity_log.view', icon: History, ready: true },
  { label: 'Pengaturan', href: '/admin/settings', permission: 'settings.manage', icon: Settings, ready: true },
];

export default function AdminLayout({ title, children }: AdminLayoutProps) {
  const { auth, flash } = usePage<PageProps>().props;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const permissions = auth.user?.permissions ?? [];
  const isAdmin = auth.user?.role === 'admin';
  const canAccess = (perm: string) => isAdmin || permissions.includes(perm);

  const visibleItems = NAV_ITEMS.filter((item) => canAccess(item.permission));

  return (
    <div className="min-h-screen flex bg-[#faf7f2] text-[#1f241c]">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#1f241c] text-[#faf7f2] flex flex-col justify-between transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-5 space-y-6 overflow-y-auto">
          <div className="flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#d99b26]" />
              <span className="font-editorial text-lg font-bold tracking-tight">
                Dapoer<span className="text-[#8cb876]">Admin</span>
              </span>
            </Link>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 text-[#c6cbbd]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <nav className="space-y-1">
            {visibleItems.map((item) => {
              const Icon = item.icon;
              const active = typeof window !== 'undefined' && window.location.pathname === item.href;

              if (!item.ready) {
                return (
                  <div
                    key={item.href}
                    className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-[#8f9687] cursor-not-allowed"
                    title="Tersedia pada tahap berikutnya"
                  >
                    <span className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5">Soon</span>
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                    active
                      ? 'bg-[#3d5a2e] text-white'
                      : 'text-[#d8ddd1] hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-white/10 space-y-2 text-xs">
          <div className="px-2 py-1">
            <div className="font-semibold text-white truncate">{auth.user?.name}</div>
            <div className="text-[11px] text-[#9ea695] uppercase tracking-wider">
              {auth.user?.role_label ?? auth.user?.role}
            </div>
          </div>
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-[#d8ddd1] hover:bg-white/10 transition-colors"
          >
            <Store className="w-4 h-4" /> Lihat Storefront
          </Link>
          <button
            type="button"
            onClick={() => router.post('/logout')}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[#f29b7e] hover:bg-white/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Keluar
          </button>
        </div>
      </aside>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white/85 backdrop-blur-md border-b border-[#e5dfd3] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg border border-[#dfd8ca]"
              aria-label="Buka Sidebar"
            >
              <Menu className="w-4 h-4" />
            </button>
            <h1 className="font-editorial text-xl font-bold text-[#1f241c]">{title}</h1>
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-[#f2ece1] text-[#3d5a2e] font-semibold">
            {auth.user?.role_label ?? auth.user?.role}
          </span>
        </header>

        <main className="p-4 sm:p-6 lg:p-8 flex-1 space-y-4">
          {flash?.success && (
            <div className="px-4 py-3 rounded-xl bg-[#3d5a2e]/10 border border-[#3d5a2e]/30 text-[#2c4221] text-xs font-semibold">
              {flash.success}
            </div>
          )}
          {flash?.error && (
            <div className="px-4 py-3 rounded-xl bg-[#c85a32]/10 border border-[#c85a32]/30 text-[#913718] text-xs font-semibold">
              {flash.error}
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
