import React, { useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import type { PageProps } from '@/types';

export default function Register() {
  const { errors } = usePage<PageProps>().props;
  const [showPassword, setShowPassword] = useState(false);

  const { data, setData, post, processing } = useForm({
    name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
    terms: false,
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/register');
  };

  return (
    <>
      <Head title="Daftar Akun" />

      <div className="min-h-screen grid lg:grid-cols-12 bg-[#FAF7F2] text-[#1F241C]">
        {/* Col 1: Vertical Editorial Index Rail */}
        <aside className="hidden lg:flex lg:col-span-1 border-r border-[#DFD8CA] flex-col items-center justify-between py-8">
          <Link href="/" className="text-xs text-[#575C52] hover:text-[#1F241C]" title="Kembali">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <span className="-rotate-90 whitespace-nowrap text-[10px] uppercase tracking-[0.34em] text-[#6B7066]">
            Dapoer Nusantara — Daftar
          </span>
          <span className="font-mono text-[10px] text-[#3D5A2E]">02</span>
        </aside>

        {/* Col 2: Main Minimalist Form Stage */}
        <main className="lg:col-span-7 flex flex-col justify-between px-6 sm:px-14 lg:px-20 py-10">
          <div className="flex items-center justify-between">
            <Link href="/" className="font-editorial text-lg tracking-tight text-[#1F241C]">
              Dapoer<span className="italic text-[#3D5A2E]">Nusantara</span>
            </Link>
            <Link
              href="/login"
              className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#575C52] hover:text-[#C85A32] border-b border-transparent hover:border-[#C85A32] pb-0.5 transition-colors"
            >
              Sudah Punya Akun →
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-lg my-auto py-8 space-y-8"
          >
            <h1 className="font-editorial text-5xl sm:text-6xl font-normal tracking-tight text-[#1F241C]">
              Daftar<span className="text-[#3D5A2E]">.</span>
            </h1>

            <form onSubmit={submit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.24em] text-[#6B7066] mb-1">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    className="w-full bg-transparent border-b border-[#CFC7B8] py-2 text-sm focus:outline-none focus:border-[#1F241C]"
                    required
                  />
                  {errors.name && <p className="text-[11px] text-[#C85A32] mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-[0.24em] text-[#6B7066] mb-1">
                    Telepon
                  </label>
                  <input
                    type="tel"
                    value={data.phone}
                    onChange={(e) => setData('phone', e.target.value)}
                    className="w-full bg-transparent border-b border-[#CFC7B8] py-2 text-sm focus:outline-none focus:border-[#1F241C]"
                    required
                  />
                  {errors.phone && <p className="text-[11px] text-[#C85A32] mt-1">{errors.phone}</p>}
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.24em] text-[#6B7066] mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={data.email}
                  onChange={(e) => setData('email', e.target.value)}
                  className="w-full bg-transparent border-b border-[#CFC7B8] py-2 text-sm focus:outline-none focus:border-[#1F241C]"
                  required
                />
                {errors.email && <p className="text-[11px] text-[#C85A32] mt-1">{errors.email}</p>}
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.24em] text-[#6B7066] mb-1">
                    Kata Sandi (Min. 8)
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      minLength={8}
                      value={data.password}
                      onChange={(e) => setData('password', e.target.value)}
                      className="w-full bg-transparent border-b border-[#CFC7B8] py-2 pr-8 text-sm focus:outline-none focus:border-[#1F241C]"
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
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-[0.24em] text-[#6B7066] mb-1">
                    Konfirmasi
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    minLength={8}
                    value={data.password_confirmation}
                    onChange={(e) => setData('password_confirmation', e.target.value)}
                    className="w-full bg-transparent border-b border-[#CFC7B8] py-2 text-sm focus:outline-none focus:border-[#1F241C]"
                    required
                  />
                </div>
              </div>
              {errors.password && <p className="text-[11px] text-[#C85A32]">{errors.password}</p>}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                <label className="flex items-start gap-2 text-xs text-[#575C52] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.terms}
                    onChange={(e) => setData('terms', e.target.checked)}
                    className="accent-[#3D5A2E] mt-0.5"
                    required
                  />
                  <span>Setuju dengan syarat &amp; ketentuan.</span>
                </label>

                <button
                  type="submit"
                  disabled={processing}
                  className="px-9 py-3.5 bg-[#3D5A2E] text-[#FAF7F2] text-xs font-semibold uppercase tracking-[0.2em] hover:bg-[#1F241C] disabled:opacity-60 transition-colors cursor-pointer"
                >
                  {processing ? 'Mendaftarkan...' : 'Buat Akun'}
                </button>
              </div>
              {errors.terms && <p className="text-[11px] text-[#C85A32]">{errors.terms}</p>}
            </form>
          </motion.div>

          <div className="flex items-center justify-between text-[11px] text-[#8F9687] border-t border-[#E5DFD3] pt-4">
            <span>Registrasi Pelanggan</span>
            <Link href="/" className="hover:text-[#1F241C]">Beranda</Link>
          </div>
        </main>

        {/* Col 3: Narrow Bleed Culinary Strip (Slow Scale-Out Curtain Reveal) */}
        <div className="hidden lg:block lg:col-span-4 relative overflow-hidden bg-[#161914]">
          <motion.img
            initial={{ scale: 1.14, opacity: 0.35 }}
            animate={{ scale: 1, opacity: 0.92 }}
            transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }}
            src="/images/nasiliwet.jpg"
            alt="Nasi Liwet Dapoer Nusantara"
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
