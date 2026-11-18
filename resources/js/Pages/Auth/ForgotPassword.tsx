import React from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import MainLayout from '@/layouts/MainLayout';
import type { PageProps } from '@/types';

export default function ForgotPassword() {
  const { errors } = usePage<PageProps>().props;
  const { data, setData, post, processing } = useForm({
    email: '',
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/forgot-password');
  };

  return (
    <MainLayout>
      <Head title="Lupa Kata Sandi" />

      <div className="max-w-md mx-auto px-4 py-14">
        <div className="rounded-3xl bg-white border border-[#e5dfd3] p-7 sm:p-8 space-y-6 shadow-xs">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#c85a32] font-semibold">Pemulihan Akun</span>
            <h1 className="font-editorial text-3xl font-bold text-[#1f241c] mt-1">Lupa Kata Sandi</h1>
            <p className="text-xs text-[#6b7066] mt-1">
              Masukkan email terdaftar untuk menerima tautan reset kata sandi.
            </p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5">Email</label>
              <input
                type="email"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#dfd8ca] text-xs focus:outline-none focus:border-[#3d5a2e]"
                required
              />
              {errors.email && <p className="text-[11px] text-[#c85a32] mt-1">{errors.email}</p>}
            </div>

            <button
              type="submit"
              disabled={processing}
              className="w-full py-3 rounded-full bg-[#3d5a2e] text-white text-xs font-semibold hover:bg-[#2c4221] disabled:opacity-60 transition-colors cursor-pointer"
            >
              {processing ? 'Mengirim...' : 'Kirim Tautan Reset'}
            </button>
          </form>

          <p className="text-center text-xs text-[#6b7066]">
            Ingat kata sandi Anda?{' '}
            <Link href="/login" className="font-semibold text-[#3d5a2e] hover:underline">
              Kembali ke Login
            </Link>
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
