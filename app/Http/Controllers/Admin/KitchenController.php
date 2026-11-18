<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KitchenController extends Controller
{
    public function index()
    {
        $orders = Order::with(['items', 'user:id,name'])
            ->whereIn('status', ['confirmed', 'preparing', 'ready'])
            ->orderBy('created_at')
            ->get();

        return Inertia::render('Admin/Kitchen/Index', [
            'orders' => $orders,
        ]);
    }

    public function updatePrepStatus(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status' => 'required|in:preparing,ready',
        ]);

        $newStatus = $validated['status'];

        if (!$order->canTransitionTo($newStatus)) {
            return back()->with('error', "Dapur tidak dapat mengubah status '{$order->status}' ke '{$newStatus}'.");
        }

        $order->update(['status' => $newStatus]);

        return back()->with('success', "Pesanan {$order->order_number} kini berstatus {$newStatus}.");
    }
}
