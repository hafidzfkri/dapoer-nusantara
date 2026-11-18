<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $cart = $request->session()->get('cart', []);
        $cartCount = 0;
        foreach ($cart as $item) {
            $cartCount += (int) ($item['quantity'] ?? 0);
        }

        $user = $request->user()?->loadMissing('role.permissions');

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user ? [
                    'id'          => $user->id,
                    'name'        => $user->name,
                    'email'       => $user->email,
                    'phone'       => $user->phone,
                    'role'        => $user->role?->name ?? 'customer',
                    'role_label'  => $user->role?->display_name ?? 'Customer',
                    'permissions' => $user->role
                        ? $user->role->permissions->pluck('name')->values()->all()
                        : [],
                ] : null,
            ],
            'cartCount'    => $cartCount,
            'deliveryType' => $request->session()->get('delivery_type', 'dine-in'),
            'flash'        => [
                'success' => fn () => $request->session()->get('success'),
                'error'   => fn () => $request->session()->get('error'),
            ],
        ];
    }
}
