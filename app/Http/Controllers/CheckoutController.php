<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\PaymentLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    private function buildCartItems(array $cart): array
    {
        $items    = [];
        $subtotal = 0;

        foreach ($cart as $key => $entry) {
            $menuId = $entry['menu_id'] ?? $key;
            $menu   = Menu::find($menuId);
            if (!$menu || !$menu->is_available) {
                continue;
            }

            $addons     = $entry['addons'] ?? [];
            $addonTotal = array_sum(array_column($addons, 'price'));
            $unitPrice  = $menu->price + $addonTotal;
            $qty        = (int) ($entry['quantity'] ?? 1);
            $itemSub    = $unitPrice * $qty;
            $subtotal  += $itemSub;

            $items[] = [
                'menu'        => $menu,
                'quantity'    => $qty,
                'spice_level' => $entry['spice_level'] ?? 'Tidak Pedas',
                'addons'      => $addons,
                'unit_price'  => $unitPrice,
                'subtotal'    => $itemSub,
            ];
        }

        return ['items' => $items, 'subtotal' => $subtotal];
    }

    public function index()
    {
        $cart = session()->get('cart', []);

        if (empty($cart)) {
            return redirect()->route('cart.index')->with('error', 'Keranjang Anda kosong!');
        }

        ['items' => $items, 'subtotal' => $subtotal] = $this->buildCartItems($cart);
        if (empty($items)) {
            return redirect()->route('cart.index')->with('error', 'Keranjang Anda kosong!');
        }

        $deliveryType = session()->get('delivery_type', 'dine-in');
        $tax          = (int) round($subtotal * 0.10);
        $shipping     = $deliveryType === 'delivery' ? 12000 : 0;
        $total        = $subtotal + $tax + $shipping;

        return Inertia::render('Checkout/Index', [
            'items'        => $items,
            'subtotal'     => $subtotal,
            'tax'          => $tax,
            'shipping'     => $shipping,
            'total'        => $total,
            'deliveryType' => $deliveryType,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'           => 'required|string|max:255',
            'phone'          => 'required|string|max:20',
            'delivery_type'  => 'required|in:dine-in,delivery',
            'address'        => 'required_if:delivery_type,delivery|nullable|string|max:500',
            'city'           => 'required_if:delivery_type,delivery|nullable|string|max:100',
            'payment_method' => 'required|in:qris,transfer',
            'notes'          => 'nullable|string|max:500',
        ], [
            'name.required'           => 'Nama pemesan wajib diisi.',
            'phone.required'          => 'Nomor telepon wajib diisi.',
            'address.required_if'     => 'Alamat wajib diisi untuk pengiriman.',
            'city.required_if'        => 'Kota wajib diisi untuk pengiriman.',
            'payment_method.required' => 'Pilih metode pembayaran.',
        ]);

        $cart = session()->get('cart', []);
        if (empty($cart)) {
            return redirect()->route('cart.index')->with('error', 'Keranjang Anda kosong!');
        }

        ['items' => $items, 'subtotal' => $subtotal] = $this->buildCartItems($cart);
        if (empty($items)) {
            return redirect()->route('cart.index')->with('error', 'Keranjang Anda kosong!');
        }

        $tax      = (int) round($subtotal * 0.10);
        $shipping = $request->delivery_type === 'delivery' ? 12000 : 0;
        $total    = $subtotal + $tax + $shipping;

        DB::beginTransaction();
        try {
            $order = Order::create([
                'user_id'        => Auth::id(),
                'order_number'   => 'DN-' . strtoupper(Str::random(6)),
                'subtotal'       => $subtotal,
                'tax'            => $tax,
                'shipping'       => $shipping,
                'total_price'    => $total,
                'payment_method' => $request->payment_method,
                'delivery_type'  => $request->delivery_type,
                'address'        => $request->delivery_type === 'delivery' ? $request->address : 'Makan di Tempat (Dine-In)',
                'city'           => $request->delivery_type === 'delivery' ? $request->city : 'Restoran Dapoer Nusantara',
                'phone'          => $request->phone,
                'notes'          => $request->notes,
                'status'         => 'pending',
            ]);

            $payment = Payment::create([
                'order_id'       => $order->id,
                'payment_method' => $request->payment_method,
                'amount'         => $total,
                'status'         => 'unpaid',
            ]);

            PaymentLog::create([
                'payment_id'  => $payment->id,
                'changed_by'  => Auth::id(),
                'from_status' => null,
                'to_status'   => 'unpaid',
                'note'        => 'Pembayaran simulasi dibuat saat checkout.',
            ]);

            foreach ($items as $item) {
                $addonNames = array_column($item['addons'], 'name');
                $label      = $item['menu']->name
                    . ($item['spice_level'] !== 'Tidak Pedas' ? " ({$item['spice_level']})" : '')
                    . (!empty($addonNames) ? ' + ' . implode(', ', $addonNames) : '');

                OrderItem::create([
                    'order_id'  => $order->id,
                    'menu_id'   => $item['menu']->id,
                    'menu_name' => $label,
                    'quantity'  => $item['quantity'],
                    'price'     => $item['unit_price'],
                    'subtotal'  => $item['subtotal'],
                ]);
            }

            session()->forget(['cart', 'delivery_type']);
            DB::commit();

            return redirect()->route('payment.success', ['order' => $order->id]);
        } catch (\Throwable $e) {
            DB::rollBack();
            return back()->with('error', 'Terjadi kesalahan saat memproses pesanan. Silakan coba lagi.');
        }
    }

    public function success(Order $order)
    {
        abort_if($order->user_id !== Auth::id(), 403);
        $order->load('items');

        return Inertia::render('Checkout/Success', [
            'order' => $order,
        ]);
    }
}
