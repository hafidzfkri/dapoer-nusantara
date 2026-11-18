<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\RestaurantTable;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class TableController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Tables/Index', [
            'tables' => RestaurantTable::orderBy('table_number')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'table_number' => 'required|string|max:20|unique:restaurant_tables,table_number',
            'capacity'     => 'required|integer|min:1|max:30',
            'status'       => 'required|in:available,occupied,reserved',
            'is_available' => 'boolean',
        ]);

        RestaurantTable::create([
            'table_number' => $validated['table_number'],
            'capacity'     => $validated['capacity'],
            'status'       => $validated['status'],
            'is_available' => $request->boolean('is_available', true),
        ]);

        return back()->with('success', 'Meja berhasil ditambahkan.');
    }

    public function update(Request $request, RestaurantTable $table)
    {
        $validated = $request->validate([
            'table_number' => ['required', 'string', 'max:20', Rule::unique('restaurant_tables', 'table_number')->ignore($table->id)],
            'capacity'     => 'required|integer|min:1|max:30',
            'status'       => 'required|in:available,occupied,reserved',
            'is_available' => 'boolean',
        ]);

        $table->update([
            'table_number' => $validated['table_number'],
            'capacity'     => $validated['capacity'],
            'status'       => $validated['status'],
            'is_available' => $request->boolean('is_available', true),
        ]);

        return back()->with('success', 'Data meja diperbarui.');
    }

    public function destroy(RestaurantTable $table)
    {
        if ($table->reservations()->whereIn('status', ['pending', 'confirmed', 'seated'])->exists()) {
            return back()->with('error', 'Meja masih memiliki reservasi aktif.');
        }

        $table->delete();
        return back()->with('success', 'Meja dihapus.');
    }
}
