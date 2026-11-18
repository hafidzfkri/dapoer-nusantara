import React, { useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import type { PageProps } from '@/types';

export default function Login() {
  const { errors, flash } = usePage<PageProps>().props;
  const [showPassword, setShowPassword] = useState(false);

  const { data, setData, post, processing } = useForm({
    email: '',
    password: '',
    remember: false,
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/login');
  };

  return (
    <>
      <Head title="Masuk" />

      <div className="min-h-screen grid lg:grid-cols-12 bg-[#FAF7F2] text-[#1F241C]">
        {/* Col 1: Vertical Editorial Index Rail */}
        <aside className="hidden lg:flex lg:col-span-1 border-r border-[#DFD8CA] flex-col items-center justify-between py-8">
          <Link href="/" className="text-xs text-[#575C52] hover:text-[#1F241C]" title="Kembali">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <span className="-rotate-90 whitespace-nowrap text-[10px] uppercase tracking-[0.34em] text-[#6B7066]">
            Dapoer Nusantara — Masuk
          </span>
          <span className="font-mono text-[10px] text-[#C85A32]">01</span>
        </aside>

        {/* Col 2: Main Minimalist Form Stage */}
        <main className="lg:col-span-7 flex flex-col justify-between px-6 sm:px-14 lg:px-20 py-10">
          <div className="flex items-center justify-between">
            <Link href="/" className="font-editorial text-lg tracking-tight text-[#1F241C]">
              Dapoer<span className="italic text-[#3D5A2E]">Nusantara</span>
            </Link>
            <Link
              href="/register"
              className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#575C52] hover:text-[#C85A32] border-b border-transparent hover:border-[#C85A32] pb-0.5 transition-colors"
            >
              Daftar Akun →
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-md my-auto py-12 space-y-10"
          >
            <h1 className="font-editorial text-5xl sm:text-6xl font-normal tracking-tight text-[#1F241C]">
              Masuk<span className="text-[#C85A32]">.</span>
            </h1>

            {flash?.success && (
              <div className="py-2.5 border-l-2 border-[#3D5A2E] pl-3 text-xs text-[#2C4221]">
                {flash.success}
              </div>
            )}

            <form onSubmit={submit} className="space-y-7">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.24em] text-[#6B7066] mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={data.email}
                  onChange={(e) => setData('email', e.target.value)}
                  className="w-full bg-transparent border-b border-[#CFC7B8] py-2.5 text-sm focus:outline-none focus:border-[#1F241C] transition-colors"
                  required
                />
                {errors.email && <p className="text-[11px] text-[#C85A32] mt-1.5">{errors.email}</p>}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[10px] uppercase tracking-[0.24em] text-[#6B7066]">
                    Kata Sandi
                  </label>
                  <Link href="/forgot-password" className="text-[11px] text-[#3D5A2E] hover:underline">
                    Lupa kata sandi?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    minLength={8}
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    className="w-full bg-transparent border-b border-[#CFC7B8] py-2.5 pr-8 text-sm focus:outline-none focus:border-[#1F241C] transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-[#6B7066] cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-[11px] text-[#C85A32] mt-1.5">{errors.password}</p>}
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 text-xs text-[#575C52] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.remember}
                    onChange={(e) => setData('remember', e.target.checked)}
                    className="accent-[#1F241C]"
                  />
                  Ingat saya
                </label>

                <button
                  type="submit"
                  disabled={processing}
                  className="px-9 py-3.5 bg-[#1F241C] text-[#FAF7F2] text-xs font-semibold uppercase tracking-[0.2em] hover:bg-[#3D5A2E] disabled:opacity-60 transition-colors cursor-pointer"
                >
                  {processing ? 'Memproses...' : 'Masuk'}
                </button>
              </div>
            </form>
          </motion.div>

          <div className="flex items-center justify-between text-[11px] text-[#8F9687] border-t border-[#E5DFD3] pt-4">
            <span>Dapoer Nusantara</span>
            <Link href="/" className="hover:text-[#1F241C]">Beranda</Link>
          </div>
        </main>

        {/* Col 3: Narrow Bleed Culinary Strip (Slow Scale-Out Curtain Reveal) */}
        <div className="hidden lg:block lg:col-span-4 relative overflow-hidden bg-[#161914]">
          <motion.img
            initial={{ scale: 1.14, opacity: 0.35 }}
            animate={{ scale: 1, opacity: 0.92 }}
            transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }}
            src="/images/nasirendang.jpg"
            alt="Rendang Dapoer Nusantara"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = '/images/dapoernusantara.jpg';
            }}
          />
        </div>
      </div>
    </>
  );
}
