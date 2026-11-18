<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use App\Models\RestaurantTable;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ReservationController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Reservations/Index', [
            'reservations' => Reservation::with('table')->latest('reservation_date')->latest('id')->get(),
            'tables'       => RestaurantTable::where('is_available', true)->orderBy('table_number')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'table_id'         => 'required|exists:restaurant_tables,id',
            'customer_name'    => 'required|string|max:255',
            'customer_phone'   => 'required|string|max:25',
            'reservation_date' => 'required|date',
            'reservation_time' => 'required|date_format:H:i',
            'guest_count'      => 'required|integer|min:1|max:30',
            'notes'            => 'nullable|string|max:500',
        ]);

        $table = RestaurantTable::findOrFail($validated['table_id']);
        if ($validated['guest_count'] > $table->capacity) {
            return back()->with('error', "Jumlah tamu melebihi kapasitas meja ({$table->capacity} kursi).");
        }

        // Validasi bentrok jadwal reservasi aktif pada meja yang sama (window +/- 90 menit)
        $requestedAt = Carbon::createFromFormat('Y-m-d H:i', $validated['reservation_date'] . ' ' . $validated['reservation_time']);
        $existing = Reservation::where('table_id', $table->id)
            ->where('reservation_date', $validated['reservation_date'])
            ->whereIn('status', ['pending', 'confirmed', 'seated'])
            ->get();

        foreach ($existing as $res) {
            $resAt = Carbon::createFromFormat('Y-m-d H:i', $res->reservation_date . ' ' . $res->reservation_time);
            if (abs($requestedAt->diffInMinutes($resAt)) < 90) {
                return back()->with('error', "Meja {$table->table_number} sudah dipesan pada jam yang bertabrakan ({$res->reservation_time}).");
            }
        }

        Reservation::create([
            'user_id'          => Auth::id(),
            'table_id'         => $table->id,
            'customer_name'    => $validated['customer_name'],
            'customer_phone'   => $validated['customer_phone'],
            'reservation_date' => $validated['reservation_date'],
            'reservation_time' => $validated['reservation_time'],
            'guest_count'      => $validated['guest_count'],
            'status'           => 'confirmed',
            'notes'            => $validated['notes'] ?? null,
        ]);

        return back()->with('success', 'Reservasi berhasil dibuat.');
    }

    public function updateStatus(Request $request, Reservation $reservation)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,confirmed,seated,completed,cancelled',
        ]);

        $reservation->update(['status' => $validated['status']]);

        return back()->with('success', 'Status reservasi diperbarui.');
    }
}
