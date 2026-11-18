<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CartController extends Controller
{
    private const ALLOWED_ADDONS = [
        'Telur Balado'  => 10000,
        'Tempe Goreng'  => 10000,
        'Pisang Goreng' => 12000,
        'Tahu Goreng'   => 10000,
    ];

    private function getCart(): array
    {
        return session()->get('cart', []);
    }

    private function saveCart(array $cart): void
    {
        session()->put('cart', $cart);
    }

    private function buildCartData(array $cart): array
    {
        $items    = [];
        $subtotal = 0;

        foreach ($cart as $key => $entry) {
            $menuId = $entry['menu_id'] ?? $key;
            $menu   = Menu::with('category')->find($menuId);
            if (!$menu || !$menu->is_available) {
                continue;
            }

            $addons      = $entry['addons'] ?? [];
            $addonTotal  = array_sum(array_column($addons, 'price'));
            $unitPrice   = $menu->price + $addonTotal;
            $qty         = (int) ($entry['quantity'] ?? 1);
            $itemSub     = $unitPrice * $qty;
            $subtotal   += $itemSub;

            $items[] = [
                'key'         => (string) $key,
                'menu_id'     => $menu->id,
                'menu'        => $menu,
                'quantity'    => $qty,
                'spice_level' => $entry['spice_level'] ?? 'Tidak Pedas',
                'addons'      => $addons,
                'unit_price'  => $unitPrice,
                'subtotal'    => $itemSub,
            ];
        }

        $deliveryType = session()->get('delivery_type', 'dine-in');
        $tax          = (int) round($subtotal * 0.10);
        $shipping     = (!empty($items) && $deliveryType === 'delivery') ? 12000 : 0;
        $total        = $subtotal + $tax + $shipping;

        return compact('items', 'subtotal', 'tax', 'shipping', 'total', 'deliveryType');
    }

    public function index()
    {
        $data = $this->buildCartData($this->getCart());
        return Inertia::render('Cart/Index', $data);
    }

    public function add(Request $request)
    {
        $validated = $request->validate([
            'menu_id'     => 'required|exists:menus,id',
            'quantity'    => 'required|integer|min:1|max:20',
            'spice_level' => 'nullable|in:Tidak Pedas,Sedang,Pedas',
            'addons'      => 'nullable|array',
            'addons.*'    => 'string',
        ]);

        $menu = Menu::findOrFail($validated['menu_id']);
        if (!$menu->is_available) {
            return back()->with('error', 'Maaf, menu ini sedang tidak tersedia.');
        }

        $spice  = $validated['spice_level'] ?? 'Tidak Pedas';
        $addons = [];
        foreach ($validated['addons'] ?? [] as $addonName) {
            if (isset(self::ALLOWED_ADDONS[$addonName])) {
                $addons[] = [
                    'name'  => $addonName,
                    'price' => self::ALLOWED_ADDONS[$addonName],
                ];
            }
        }
        usort($addons, fn ($a, $b) => strcmp($a['name'], $b['name']));

        $key  = $menu->id . '-' . md5($spice . json_encode($addons));
        $cart = $this->getCart();

        $existingQty = $cart[$key]['quantity'] ?? 0;
        $newQty      = min(20, $existingQty + (int) $validated['quantity']);

        $cart[$key] = [
            'menu_id'     => $menu->id,
            'quantity'    => $newQty,
            'spice_level' => $spice,
            'addons'      => $addons,
        ];

        $this->saveCart($cart);

        if ($request->wantsJson() && !$request->header('X-Inertia')) {
            return response()->json([
                'success'   => true,
                'message'   => $menu->name . ' ditambahkan ke keranjang!',
                'cartCount' => array_sum(array_column($cart, 'quantity')),
            ]);
        }

        return back()->with('success', $menu->name . ' ditambahkan ke keranjang!');
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'key'      => 'required|string',
            'quantity' => 'required|integer|min:1|max:20',
        ]);

        $cart = $this->getCart();
        $key  = $validated['key'];

        if (!isset($cart[$key])) {
            return back()->with('error', 'Item tidak ditemukan di keranjang.');
        }

        $cart[$key]['quantity'] = (int) $validated['quantity'];
        $this->saveCart($cart);

        return back();
    }

    public function remove(Request $request)
    {
        $validated = $request->validate([
            'key' => 'required|string',
        ]);

        $cart = $this->getCart();
        unset($cart[$validated['key']]);
        $this->saveCart($cart);

        return back()->with('success', 'Item dihapus dari keranjang.');
    }

    public function setDeliveryType(Request $request)
    {
        $validated = $request->validate([
            'delivery_type' => 'required|in:dine-in,delivery',
        ]);

        session()->put('delivery_type', $validated['delivery_type']);
        return back();
    }

    public function count()
    {
        $cart = $this->getCart();
        return response()->json([
            'count' => array_sum(array_column($cart, 'quantity')),
        ]);
    }
}
