<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Payment;
use App\Models\PaymentLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function index()
    {
        $payments = Payment::with([
            'order.user:id,name,email',
            'order.items',
            'confirmer:id,name',
            'logs.actor:id,name',
        ])
            ->latest()
            ->get();

        return Inertia::render('Admin/Payments/Index', [
            'payments' => $payments,
        ]);
    }

    public function confirm(Request $request, Payment $payment)
    {
        $validated = $request->validate([
            'reference_number' => 'nullable|string|max:100',
        ]);

        if ($payment->status === 'paid') {
            return back()->with('error', 'Pembayaran ganda ditolak: transaksi ini sudah berstatus Lunas (Paid).');
        }

        if (!in_array($payment->status, ['unpaid', 'pending_verification'], true)) {
            return back()->with('error', 'Status pembayaran saat ini tidak dapat dikonfirmasi.');
        }

        DB::transaction(function () use ($payment, $validated) {
            $locked = Payment::whereKey($payment->id)->lockForUpdate()->firstOrFail();

            if ($locked->status === 'paid') {
                throw new \RuntimeException('Pembayaran sudah dikonfirmasi.');
            }

            $oldStatus = $locked->status;
            $locked->update([
                'status'           => 'paid',
                'confirmed_by'     => Auth::id(),
                'paid_at'          => now(),
                'reference_number' => $validated['reference_number'] ?? ('REF-' . strtoupper(uniqid())),
            ]);

            PaymentLog::create([
                'payment_id'  => $locked->id,
                'changed_by'  => Auth::id(),
                'from_status' => $oldStatus,
                'to_status'   => 'paid',
                'note'        => 'Dikonfirmasi oleh kasir/admin.',
            ]);

            $order = $locked->order;
            if ($order && $order->status === 'pending') {
                $order->update(['status' => 'confirmed']);
            }
        });

        ActivityLog::record('payment.confirmed', "Konfirmasi pembayaran untuk order #{$payment->order_id}.", ['payment_id' => $payment->id, 'amount' => $payment->amount]);

        return back()->with('success', 'Pembayaran berhasil dikonfirmasi.');
    }
}
