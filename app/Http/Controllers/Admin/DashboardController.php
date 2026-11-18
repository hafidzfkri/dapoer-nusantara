<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $totalSales = (int) Order::where('status', '!=', 'cancelled')->sum('total_price');
        $totalOrders = Order::count();
        $pendingOrders = Order::where('status', 'pending')->count();
        $processingOrders = Order::whereIn('status', ['confirmed', 'preparing', 'processing'])->count();
        $totalCustomers = User::whereHas('role', fn ($q) => $q->where('name', 'customer'))->count();

        $topMenus = OrderItem::select(
            'menu_name',
            DB::raw('SUM(quantity) as total_qty'),
            DB::raw('SUM(subtotal) as total_revenue')
        )
            ->groupBy('menu_name')
            ->orderByDesc('total_qty')
            ->limit(5)
            ->get()
            ->map(fn ($row) => [
                'menu_name'     => $row->menu_name,
                'total_qty'     => (int) $row->total_qty,
                'total_revenue' => (int) $row->total_revenue,
            ]);

        $startDate = Carbon::today()->subDays(6);
        $rawDaily = Order::select(
            DB::raw('DATE(created_at) as date'),
            DB::raw('COUNT(*) as orders_count'),
            DB::raw('SUM(total_price) as revenue')
        )
            ->where('status', '!=', 'cancelled')
            ->where('created_at', '>=', $startDate)
            ->groupBy(DB::raw('DATE(created_at)'))
            ->get()
            ->keyBy('date');

        $salesChart = [];
        for ($i = 0; $i < 7; $i++) {
            $day = $startDate->copy()->addDays($i);
            $key = $day->format('Y-m-d');
            $entry = $rawDaily->get($key);

            $salesChart[] = [
                'date'         => $day->format('d M'),
                'orders_count' => $entry ? (int) $entry->orders_count : 0,
                'revenue'      => $entry ? (int) $entry->revenue : 0,
            ];
        }

        $recentOrders = Order::with('user:id,name,email')
            ->latest()
            ->limit(8)
            ->get()
            ->map(fn ($order) => [
                'id'            => $order->id,
                'order_number'  => $order->order_number,
                'customer_name' => $order->user?->name ?? 'Tamu',
                'total_price'   => (int) $order->total_price,
                'delivery_type' => $order->delivery_type,
                'status'        => $order->status,
                'created_at'    => $order->created_at?->toISOString(),
            ]);

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'total_sales'       => $totalSales,
                'total_orders'      => $totalOrders,
                'pending_orders'    => $pendingOrders,
                'processing_orders' => $processingOrders,
                'total_customers'   => $totalCustomers,
            ],
            'topMenus'     => $topMenus,
            'salesChart'   => $salesChart,
            'recentOrders' => $recentOrders,
        ]);
    }
}
