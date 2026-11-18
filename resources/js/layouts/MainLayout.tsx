import React, { useEffect, useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import {
  ShoppingBag,
  User as UserIcon,
  LogOut,
  ClipboardList,
  Calendar,
  LayoutDashboard,
  Menu as MenuIcon,
  X,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import type { PageProps } from '@/types';

interface MainLayoutProps {
  children: React.ReactNode;
}

const NAV_LINKS = [
  { id: 'hero', label: 'Home', href: '/#hero' },
  { id: 'our-story', label: 'Our Story', href: '/#our-story' },
  { id: 'explore-menu', label: 'Menu', href: '/#explore-menu' },
  { id: 'dining-experience', label: 'Experience', href: '/#dining-experience' },
  { id: 'location-contact', label: 'Contact', href: '/#location-contact' },
];

export default function MainLayout({ children }: MainLayoutProps) {
  const { auth, cartCount, flash } = usePage<PageProps>().props;
  const isStaff = !!auth.user && auth.user.role !== 'customer';
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 180, damping: 28, restDelta: 0.001 });

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 18);

      const ids = NAV_LINKS.map((l) => l.id);
      for (let i = ids.length - 1; i >= 0; i--) {
        const el = document.getElementById(ids[i]);
        if (el && el.getBoundingClientRect().top <= 160) {
          setActiveSection(ids[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (flash.success) {
      setToast({ message: flash.success, type: 'success' });
    } else if (flash.error) {
      setToast({ message: flash.error, type: 'error' });
    }
  }, [flash.success, flash.error]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  const handleLogout = () => {
    setDropdownOpen(false);
    router.post('/logout');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1F241C] relative">
      {/* Subtle Analog Film Grain Overlay */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-50 opacity-[0.028]"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=%270 0 200 200%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27n%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.85%27 numOctaves=%272%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23n)%27/%3E%3C/svg%3E")',
        }}
      />

      {/* Sticky Editorial Navbar */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-[#FAF7F2]/92 backdrop-blur-md border-b border-[#E5DFD3] shadow-xs'
            : 'bg-[#FAF7F2]/75 backdrop-blur-xs border-b border-transparent'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3D5A2E] group-hover:bg-[#C85A32] transition-colors" />
            <span className="font-editorial text-xl font-bold tracking-tight text-[#1F241C]">
              Dapoer<span className="text-[#3D5A2E]">Nusantara</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold tracking-wide text-[#4F544B]">
            {NAV_LINKS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`relative py-1 transition-colors ${
                    isActive ? 'text-[#3D5A2E]' : 'hover:text-[#1F241C]'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.span
                      layoutId="navActiveBar"
                      className="absolute left-0 right-0 -bottom-0.5 h-0.5 bg-[#C85A32]"
                      transition={{ type: 'spring', stiffness: 360, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2.5">
            {isStaff ? (
              <Link
                href="/admin"
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-sm bg-[#3D5A2E] text-white text-xs font-semibold tracking-wide hover:bg-[#2C4221] transition-colors"
              >
                <LayoutDashboard className="w-3.5 h-3.5" /> Admin Dashboard
              </Link>
            ) : (
              <Link
                href="/#explore-menu"
                className="hidden sm:inline-flex items-center px-4 py-2 rounded-sm bg-[#C85A32] text-white text-xs font-semibold tracking-wide hover:bg-[#AE4A25] transition-colors"
              >
                Order Now
              </Link>
            )}

            {auth.user ? (
              <>
                {!isStaff && (
                  <Link
                    href="/cart"
                    className="relative inline-flex items-center gap-2 px-3.5 py-2 rounded-sm bg-[#3D5A2E] text-white text-xs font-semibold hover:bg-[#2C4221] transition-colors"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Cart</span>
                    <AnimatePresence mode="popLayout">
                      {cartCount > 0 && (
                        <motion.span
                          key={cartCount}
                          initial={{ scale: 0.6, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.6, opacity: 0 }}
                          className="px-1.5 py-0.5 rounded-sm bg-[#D99B26] text-[#1F241C] text-[11px] font-bold leading-none tabular-nums"
                        >
                          {cartCount}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>
                )}

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setDropdownOpen((v) => !v)}
                    className="p-2 rounded-sm border border-[#DFD8CA] hover:bg-[#F2ECE1] transition-colors cursor-pointer"
                    aria-label="Menu Pengguna"
                  >
                    <UserIcon className="w-4 h-4 text-[#1F241C]" />
                  </button>

                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.96 }}
                        transition={{ duration: 0.16 }}
                        className="absolute right-0 mt-2 w-56 rounded-md bg-white border border-[#E5DFD3] shadow-lg py-2 z-50"
                      >
                        <div className="px-4 py-2 border-b border-[#F0EBE1]">
                          <p className="text-sm font-semibold text-[#1F241C] truncate">{auth.user.name}</p>
                          <p className="text-xs text-[#6B7066] truncate">{auth.user.email}</p>
                        </div>
                        {(auth.user.role === 'admin' || auth.user.permissions?.includes('dashboard.view')) && (
                          <Link
                            href="/admin"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-[#3D5A2E] hover:bg-[#FAF7F2]"
                          >
                            <LayoutDashboard className="w-3.5 h-3.5" />
                            Admin Dashboard
                          </Link>
                        )}
                        {!isStaff && (
                          <>
                            <Link
                              href="/orders"
                              onClick={() => setDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-[#1F241C] hover:bg-[#FAF7F2]"
                            >
                              <ClipboardList className="w-3.5 h-3.5 text-[#3D5A2E]" />
                              Riwayat Pesanan
                            </Link>
                            <Link
                              href="/reservations"
                              onClick={() => setDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-[#1F241C] hover:bg-[#FAF7F2]"
                            >
                              <Calendar className="w-3.5 h-3.5 text-[#C85A32]" />
                              Reservasi Saya
                            </Link>
                          </>
                        )}
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-[#C85A32] hover:bg-[#FAF7F2] cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          Keluar
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3.5 py-2 rounded-sm border border-[#D6CFC0] text-xs font-semibold text-[#1F241C] hover:bg-[#F2ECE1] transition-colors"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="px-3.5 py-2 rounded-sm bg-[#3D5A2E] text-white text-xs font-semibold hover:bg-[#2C4221] transition-colors"
                >
                  Daftar
                </Link>
              </div>
            )}

            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden p-2 rounded-sm border border-[#DFD8CA] text-[#1F241C]"
              aria-label="Toggle Menu"
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <MenuIcon className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Living Scroll Progress Line */}
        <motion.div
          style={{ scaleX, transformOrigin: '0% 50%' }}
          className="h-[2px] w-full bg-[#C85A32]"
        />

        {/* Mobile Drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden overflow-hidden border-t border-[#E5DFD3] bg-[#FAF7F2]"
            >
              <div className="px-4 py-4 flex flex-col gap-3 text-sm font-medium">
                {NAV_LINKS.map((item) => (
                  <Link key={item.id} href={item.href} onClick={() => setMobileOpen(false)}>
                    {item.label}
                  </Link>
                ))}
                {!isStaff && (
                  <Link
                    href="/#explore-menu"
                    onClick={() => setMobileOpen(false)}
                    className="inline-flex justify-center py-2 rounded-sm bg-[#C85A32] text-white text-xs font-semibold"
                  >
                    Order Now
                  </Link>
                )}
                {auth.user ? (
                  <>
                    {!isStaff && (
                      <Link href="/orders" onClick={() => setMobileOpen(false)}>
                        Riwayat Pesanan
                      </Link>
                    )}
                    {(auth.user.role === 'admin' || auth.user.permissions?.includes('dashboard.view')) && (
                      <Link href="/admin" onClick={() => setMobileOpen(false)} className="text-[#3D5A2E] font-semibold">
                        Admin Dashboard
                      </Link>
                    )}
                    <button type="button" onClick={handleLogout} className="text-left text-[#C85A32]">
                      Keluar
                    </button>
                  </>
                ) : (
                  <div className="flex gap-2 pt-2">
                    <Link href="/login" className="px-4 py-2 rounded-sm border border-[#D6CFC0] text-xs font-semibold">
                      Masuk
                    </Link>
                    <Link href="/register" className="px-4 py-2 rounded-sm bg-[#3D5A2E] text-white text-xs font-semibold">
                      Daftar
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.96 }}
            className="fixed top-20 right-4 z-50 max-w-sm flex items-center gap-2.5 px-4 py-3 rounded-md bg-white border border-[#E5DFD3] shadow-lg text-xs font-medium text-[#1F241C]"
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-[#3D5A2E] shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-[#C85A32] shrink-0" />
            )}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 relative z-10">{children}</main>

      {/* Section 10 Footer */}
      <footer className="relative z-10 border-t border-[#E5DFD3] bg-[#191D16] text-[#FAF7F2]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-5 space-y-3">
            <span className="font-editorial text-2xl font-bold">
              Dapoer<span className="text-[#D99B26]">Nusantara</span>
            </span>
            <p className="text-xs text-[#C6CBB9] max-w-sm leading-relaxed">
              Perjalanan cita rasa Nusantara yang dimasak dengan rempah pilihan dan penyajian hangat setiap hari.
            </p>
            <p className="text-[11px] text-[#8F9687] pt-2">
              © 2026 Dapoer Nusantara. All rights reserved.
            </p>
          </div>

          <div className="md:col-span-4 space-y-2 text-xs">
            <div className="font-semibold uppercase tracking-widest text-[#D99B26] text-[11px]">Navigasi</div>
            <div className="grid grid-cols-2 gap-2 text-[#D8DDD1]">
              {NAV_LINKS.map((item) => (
                <Link key={item.id} href={item.href} className="hover:text-white transition-colors">
                  {item.label}
                </Link>
              ))}
              {auth.user && (
                <Link href="/orders" className="hover:text-white transition-colors">
                  Riwayat Pesanan
                </Link>
              )}
            </div>
          </div>

          <div className="md:col-span-3 space-y-2 text-xs text-[#D8DDD1]">
            <div className="font-semibold uppercase tracking-widest text-[#D99B26] text-[11px]">Kontak &amp; Lokasi</div>
            <p>Jl. Jenderal Sudirman No. 88, Kambang Iwak, Ilir Barat I, Palembang 30135</p>
            <p>Telp / WA: (0711) 358-890 / +62 812-7890-4560</p>
            <p>Instagram: @dapoernusantara.plg</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
