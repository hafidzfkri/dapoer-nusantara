import React from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import MainLayout from '@/layouts/MainLayout';
import type { PageProps } from '@/types';

interface ResetPasswordProps {
  token: string;
  email: string;
}

export default function ResetPassword({ token, email }: ResetPasswordProps) {
  const { errors } = usePage<PageProps>().props;
  const { data, setData, post, processing } = useForm({
    token,
    email,
    password: '',
    password_confirmation: '',
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/reset-password');
  };

  return (
    <MainLayout>
      <Head title="Reset Kata Sandi" />

      <div className="max-w-md mx-auto px-4 py-14">
        <div className="rounded-3xl bg-white border border-[#e5dfd3] p-7 sm:p-8 space-y-6 shadow-xs">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#c85a32] font-semibold">Keamanan Akun</span>
            <h1 className="font-editorial text-3xl font-bold text-[#1f241c] mt-1">Atur Ulang Kata Sandi</h1>
            <p className="text-xs text-[#6b7066] mt-1">Gunakan minimal 8 karakter untuk kata sandi baru Anda.</p>
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

            <div>
              <label className="block text-xs font-semibold mb-1.5">Kata Sandi Baru (Min. 8)</label>
              <input
                type="password"
                minLength={8}
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#dfd8ca] text-xs focus:outline-none focus:border-[#3d5a2e]"
                required
              />
              {errors.password && <p className="text-[11px] text-[#c85a32] mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5">Konfirmasi Kata Sandi</label>
              <input
                type="password"
                minLength={8}
                value={data.password_confirmation}
                onChange={(e) => setData('password_confirmation', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#dfd8ca] text-xs focus:outline-none focus:border-[#3d5a2e]"
                required
              />
            </div>

            <button
              type="submit"
              disabled={processing}
              className="w-full py-3 rounded-full bg-[#3d5a2e] text-white text-xs font-semibold hover:bg-[#2c4221] disabled:opacity-60 transition-colors cursor-pointer"
            >
              {processing ? 'Menyimpan...' : 'Simpan Kata Sandi Baru'}
            </button>
          </form>
        </div>
      </div>
    </MainLayout>
  );
}
