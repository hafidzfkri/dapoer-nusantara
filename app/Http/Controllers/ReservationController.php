<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\Reservation;
use App\Models\RestaurantTable;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ReservationController extends Controller
{
    public function index()
    {
        $reservations = Reservation::with('table:id,table_number,capacity')
            ->where('user_id', Auth::id())
            ->latest('reservation_date')
            ->latest('id')
            ->get();

        return Inertia::render('Reservations/Index', [
            'reservations' => $reservations,
        ]);
    }

    public function store(Request $request)
    {
        // Honeypot anti-spam bot: field tersembunyi harus tetap kosong
        if ($request->filled('website')) {
            return back()->with('success', 'Permintaan reservasi Anda telah dicatat.');
        }

        $validated = $request->validate([
            'table_id'         => 'required|exists:restaurant_tables,id',
            'customer_name'    => 'required|string|max:255',
            'customer_phone'   => 'required|string|max:25',
            'reservation_date' => 'required|date|after_or_equal:today',
            'reservation_time' => 'required|date_format:H:i',
            'guest_count'      => 'required|integer|min:1|max:30',
            'notes'            => 'nullable|string|max:500',
        ], [
            'table_id.required'               => 'Silakan pilih meja terlebih dahulu.',
            'customer_name.required'          => 'Nama pemesan wajib diisi.',
            'customer_phone.required'         => 'Nomor telepon wajib diisi.',
            'reservation_date.after_or_equal' => 'Tanggal reservasi tidak boleh di masa lalu.',
        ]);

        $table = RestaurantTable::where('is_available', true)->findOrFail($validated['table_id']);

        if ($validated['guest_count'] > $table->capacity) {
            return back()->withErrors([
                'guest_count' => "Jumlah tamu melebihi kapasitas meja {$table->table_number} (maks {$table->capacity} kursi).",
            ]);
        }

        $requestedAt = Carbon::createFromFormat('Y-m-d H:i', $validated['reservation_date'] . ' ' . $validated['reservation_time']);
        $existing = Reservation::where('table_id', $table->id)
            ->where('reservation_date', $validated['reservation_date'])
            ->whereIn('status', ['pending', 'confirmed', 'seated'])
            ->get();

        foreach ($existing as $res) {
            $resAt = Carbon::createFromFormat('Y-m-d H:i', $res->reservation_date . ' ' . $res->reservation_time);
            if (abs($requestedAt->diffInMinutes($resAt)) < 90) {
                return back()->withErrors([
                    'reservation_time' => "Meja {$table->table_number} sudah dipesan pada jam yang bertabrakan ({$res->reservation_time}).",
                ]);
            }
        }

        $bookingCode = 'RES-' . strtoupper(Str::random(6));

        $reservation = Reservation::create([
            'booking_code'     => $bookingCode,
            'user_id'          => Auth::id(),
            'table_id'         => $table->id,
            'customer_name'    => $validated['customer_name'],
            'customer_phone'   => $validated['customer_phone'],
            'reservation_date' => $validated['reservation_date'],
            'reservation_time' => $validated['reservation_time'],
            'guest_count'      => $validated['guest_count'],
            'status'           => 'pending',
            'notes'            => $validated['notes'] ?? null,
        ]);

        ActivityLog::record(
            'reservation.created',
            "Reservasi baru {$bookingCode} untuk meja {$table->table_number}.",
            ['reservation_id' => $reservation->id, 'table_id' => $table->id]
        );

        return back()->with('success', "Reservasi meja {$table->table_number} berhasil dikirim! Kode Booking: {$bookingCode}");
    }
}
