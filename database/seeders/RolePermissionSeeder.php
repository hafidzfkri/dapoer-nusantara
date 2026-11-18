<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            ['name' => 'dashboard.view', 'display_name' => 'Lihat Dashboard', 'group' => 'dashboard'],
            ['name' => 'menu.manage', 'display_name' => 'Kelola Menu', 'group' => 'catalog'],
            ['name' => 'category.manage', 'display_name' => 'Kelola Kategori', 'group' => 'catalog'],
            ['name' => 'order.view', 'display_name' => 'Lihat Semua Pesanan', 'group' => 'order'],
            ['name' => 'order.create', 'display_name' => 'Buat Pesanan Staff', 'group' => 'order'],
            ['name' => 'order.update_status', 'display_name' => 'Ubah Status Pesanan', 'group' => 'order'],
            ['name' => 'kitchen.manage', 'display_name' => 'Kelola Persiapan Dapur', 'group' => 'kitchen'],
            ['name' => 'payment.view', 'display_name' => 'Lihat Pembayaran', 'group' => 'payment'],
            ['name' => 'payment.confirm', 'display_name' => 'Konfirmasi Pembayaran', 'group' => 'payment'],
            ['name' => 'reservation.manage', 'display_name' => 'Kelola Reservasi', 'group' => 'operation'],
            ['name' => 'table.manage', 'display_name' => 'Kelola Meja', 'group' => 'operation'],
            ['name' => 'user.manage', 'display_name' => 'Kelola Pengguna', 'group' => 'access'],
            ['name' => 'role.manage', 'display_name' => 'Kelola Role & Permission', 'group' => 'access'],
            ['name' => 'report.view', 'display_name' => 'Lihat Laporan Penjualan', 'group' => 'report'],
            ['name' => 'activity_log.view', 'display_name' => 'Lihat Activity Log', 'group' => 'system'],
            ['name' => 'settings.manage', 'display_name' => 'Pengaturan Sistem', 'group' => 'system'],
        ];

        $permissionModels = [];
        foreach ($permissions as $perm) {
            $permissionModels[$perm['name']] = Permission::firstOrCreate(
                ['name' => $perm['name']],
                ['display_name' => $perm['display_name'], 'group' => $perm['group']]
            );
        }

        $rolesConfig = [
            'admin' => [
                'display_name' => 'Administrator',
                'description'  => 'Akses penuh seluruh sistem restoran.',
                'permissions'  => array_keys($permissionModels),
            ],
            'manager' => [
                'display_name' => 'Manager',
                'description'  => 'Mengelola menu, kategori, pesanan, reservasi, dan laporan.',
                'permissions'  => [
                    'dashboard.view', 'menu.manage', 'category.manage',
                    'order.view', 'order.update_status', 'reservation.manage',
                    'table.manage', 'report.view',
                ],
            ],
            'cashier' => [
                'display_name' => 'Cashier',
                'description'  => 'Melihat pesanan, mengonfirmasi pembayaran, dan mencetak struk.',
                'permissions'  => ['dashboard.view', 'order.view', 'payment.view', 'payment.confirm'],
            ],
            'waiter' => [
                'display_name' => 'Waiter',
                'description'  => 'Membuat pesanan, mengelola meja, dan memantau pesanan.',
                'permissions'  => ['dashboard.view', 'order.view', 'order.create', 'order.update_status', 'table.manage', 'reservation.manage'],
            ],
            'kitchen' => [
                'display_name' => 'Kitchen',
                'description'  => 'Melihat pesanan masuk dan memperbarui status persiapan makanan.',
                'permissions'  => ['dashboard.view', 'order.view', 'kitchen.manage'],
            ],
            'customer' => [
                'display_name' => 'Customer',
                'description'  => 'Pelanggan Dapoer Nusantara.',
                'permissions'  => [],
            ],
        ];

        $roleModels = [];
        foreach ($rolesConfig as $name => $cfg) {
            $role = Role::firstOrCreate(
                ['name' => $name],
                ['display_name' => $cfg['display_name'], 'description' => $cfg['description']]
            );
            $permIds = collect($cfg['permissions'])->map(fn ($p) => $permissionModels[$p]->id)->all();
            $role->permissions()->syncWithoutDetaching($permIds);
            $roleModels[$name] = $role;
        }

        // Pastikan user existing yang belum punya role mendapat role customer
        User::whereNull('role_id')->update(['role_id' => $roleModels['customer']->id]);

        // Akun awal untuk setiap role (dibuat pada local/testing atau saat database cloud baru masih kosong)
        if (app()->environment(['local', 'testing']) || User::count() === 0) {
            $dummyUsers = [
                ['email' => 'admin@dapoernusantara.test', 'name' => 'Admin Dapoer', 'role' => 'admin'],
                ['email' => 'manager@dapoernusantara.test', 'name' => 'Manager Dapoer', 'role' => 'manager'],
                ['email' => 'cashier@dapoernusantara.test', 'name' => 'Kasir Dapoer', 'role' => 'cashier'],
                ['email' => 'waiter@dapoernusantara.test', 'name' => 'Pelayan Dapoer', 'role' => 'waiter'],
                ['email' => 'kitchen@dapoernusantara.test', 'name' => 'Chef Dapoer', 'role' => 'kitchen'],
                ['email' => 'customer@dapoernusantara.test', 'name' => 'Pelanggan Dapoer', 'role' => 'customer'],
            ];

            foreach ($dummyUsers as $u) {
                $user = User::firstOrNew(['email' => $u['email']]);
                if (!$user->exists) {
                    $user->name = $u['name'];
                    $user->phone = '081200000000';
                    $user->password = Hash::make('Password123!');
                }
                $user->role_id = $roleModels[$u['role']]->id;
                $user->is_active = true;
                $user->save();
            }
        }
    }
}
