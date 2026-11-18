<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $search = (string) $request->query('search', '');
        $roleFilter = (string) $request->query('role', '');

        $query = User::with('role')->orderBy('id');

        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($roleFilter !== '') {
            $query->whereHas('role', fn ($q) => $q->where('name', $roleFilter));
        }

        return Inertia::render('Admin/Users/Index', [
            'users' => $query->get()->map(fn (User $u) => [
                'id'         => $u->id,
                'name'       => $u->name,
                'email'      => $u->email,
                'phone'      => $u->phone,
                'is_active'  => (bool) $u->is_active,
                'role_id'    => $u->role_id,
                'role_name'  => $u->role?->name ?? 'customer',
                'role_label' => $u->role?->display_name ?? 'Customer',
                'created_at' => $u->created_at?->toISOString(),
            ]),
            'roles'   => Role::orderBy('id')->get(['id', 'name', 'display_name']),
            'filters' => [
                'search' => $search,
                'role'   => $roleFilter,
            ],
        ]);
    }

    public function updateRole(Request $request, User $user)
    {
        $validated = $request->validate([
            'role_id' => 'required|exists:roles,id',
        ]);

        $activeAdminCount = User::whereHas('role', fn ($q) => $q->where('name', 'admin'))
            ->where('is_active', true)
            ->count();

        $newRole = Role::findOrFail($validated['role_id']);

        if ($user->id === Auth::id() && $newRole->name !== 'admin') {
            return back()->with('error', 'Anda tidak dapat menurunkan role akun Anda sendiri.');
        }

        if ($user->hasRole('admin') && $user->is_active && $newRole->name !== 'admin' && $activeAdminCount <= 1) {
            return back()->with('error', 'Tidak dapat mengubah role satu-satunya Admin aktif.');
        }

        $oldRole = $user->role?->name;
        $user->role_id = $newRole->id;
        $user->save();

        ActivityLog::record('user.role_updated', "Role {$user->email} diubah dari {$oldRole} ke {$newRole->name}.", ['target_user_id' => $user->id]);

        return back()->with('success', "Role {$user->name} berhasil diubah menjadi {$newRole->display_name}.");
    }

    public function toggleStatus(User $user)
    {
        if ($user->id === Auth::id()) {
            return back()->with('error', 'Anda tidak dapat menonaktifkan akun Anda sendiri.');
        }

        $activeAdminCount = User::whereHas('role', fn ($q) => $q->where('name', 'admin'))
            ->where('is_active', true)
            ->count();

        if ($user->hasRole('admin') && $user->is_active && $activeAdminCount <= 1) {
            return back()->with('error', 'Tidak dapat menonaktifkan satu-satunya Admin aktif.');
        }

        $user->is_active = !$user->is_active;
        $user->save();

        return back()->with('success', 'Status akun berhasil diperbarui.');
    }
}
