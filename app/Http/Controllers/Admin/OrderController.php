<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $status = (string) $request->query('status', '');

        $query = Order::with(['user:id,name,email', 'items', 'payment'])
            ->latest();

        if ($status !== '') {
            $query->where('status', $status);
        }

        return Inertia::render('Admin/Orders/Index', [
            'orders'  => $query->get(),
            'filters' => ['status' => $status],
        ]);
    }

    public function updateStatus(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,confirmed,preparing,ready,completed,cancelled',
        ]);

        $newStatus = $validated['status'];

        if (!$order->canTransitionTo($newStatus)) {
            return back()->with('error', "Transisi status dari '{$order->status}' ke '{$newStatus}' tidak valid.");
        }

        $oldStatus = $order->status;
        $order->update(['status' => $newStatus]);
        ActivityLog::record('order.status_updated', "Pesanan {$order->order_number}: {$oldStatus} -> {$newStatus}.", ['order_id' => $order->id]);

        return back()->with('success', "Status pesanan {$order->order_number} diubah menjadi {$newStatus}.");
    }
}
