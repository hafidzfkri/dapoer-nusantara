<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Permission;
use App\Models\Role;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoleController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Roles/Index', [
            'roles' => Role::with('permissions:id,name')->orderBy('id')->get()->map(fn ($r) => [
                'id'           => $r->id,
                'name'         => $r->name,
                'display_name' => $r->display_name,
                'description'  => $r->description,
                'permissions'  => $r->permissions->pluck('id')->all(),
            ]),
            'permissions' => Permission::orderBy('group')->orderBy('id')->get(),
        ]);
    }

    public function syncPermissions(Request $request, Role $role)
    {
        if ($role->name === 'admin') {
            return back()->with('error', 'Hak akses Administrator selalu penuh dan tidak dapat dibatasi.');
        }

        $validated = $request->validate([
            'permission_ids'   => 'array',
            'permission_ids.*' => 'exists:permissions,id',
        ]);

        $role->permissions()->sync($validated['permission_ids'] ?? []);

        return back()->with('success', "Permission untuk role {$role->display_name} berhasil diperbarui.");
    }
}
