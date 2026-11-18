<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $from = (string) $request->query('from', Carbon::now()->startOfMonth()->format('Y-m-d'));
        $to   = (string) $request->query('to', Carbon::now()->format('Y-m-d'));

        $ordersQuery = Order::whereBetween(DB::raw('DATE(created_at)'), [$from, $to]);

        $totalRevenue = (int) (clone $ordersQuery)->where('status', '!=', 'cancelled')->sum('total_price');
        $totalOrders  = (clone $ordersQuery)->count();
        $paidRevenue  = (int) Payment::where('status', 'paid')
            ->whereBetween(DB::raw('DATE(paid_at)'), [$from, $to])
            ->sum('amount');

        $byMethod = Order::select('payment_method', DB::raw('COUNT(*) as count'), DB::raw('SUM(total_price) as total'))
            ->where('status', '!=', 'cancelled')
            ->whereBetween(DB::raw('DATE(created_at)'), [$from, $to])
            ->groupBy('payment_method')
            ->get();

        $topItems = OrderItem::select('menu_name', DB::raw('SUM(quantity) as qty'), DB::raw('SUM(subtotal) as revenue'))
            ->whereHas('order', fn ($q) => $q->where('status', '!=', 'cancelled')->whereBetween(DB::raw('DATE(created_at)'), [$from, $to]))
            ->groupBy('menu_name')
            ->orderByDesc('qty')
            ->limit(10)
            ->get();

        return Inertia::render('Admin/Reports/Index', [
            'filters' => ['from' => $from, 'to' => $to],
            'summary' => [
                'total_revenue' => $totalRevenue,
                'paid_revenue'  => $paidRevenue,
                'total_orders'  => $totalOrders,
            ],
            'byMethod' => $byMethod,
            'topItems' => $topItems,
        ]);
    }
}
