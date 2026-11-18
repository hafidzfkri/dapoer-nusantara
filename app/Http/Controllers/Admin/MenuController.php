<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Category;
use App\Models\Menu;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class MenuController extends Controller
{
    public function index(Request $request)
    {
        $search = (string) $request->query('search', '');
        $categoryId = $request->query('category_id', '');

        $query = Menu::with('category')->orderByDesc('id');

        if ($search !== '') {
            $query->where('name', 'like', "%{$search}%");
        }
        if ($categoryId !== '') {
            $query->where('category_id', $categoryId);
        }

        return Inertia::render('Admin/Menus/Index', [
            'menus'      => $query->get(),
            'categories' => Category::orderBy('name')->get(),
            'filters'    => [
                'search'      => $search,
                'category_id' => $categoryId,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id'  => 'required|exists:categories,id',
            'name'         => 'required|string|max:255',
            'subcategory'  => 'nullable|string|max:100',
            'description'  => 'required|string|max:2000',
            'price'        => 'required|integer|min:1000|max:10000000',
            'cook_time'    => 'required|integer|min:1|max:240',
            'is_available' => 'boolean',
            'image'        => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('menus', 'public');
        }

        $menu = Menu::create([
            'category_id'  => $validated['category_id'],
            'name'         => $validated['name'],
            'slug'         => Str::slug($validated['name']) . '-' . Str::lower(Str::random(4)),
            'subcategory'  => $validated['subcategory'] ?? null,
            'description'  => $validated['description'],
            'price'        => $validated['price'],
            'cook_time'    => $validated['cook_time'],
            'is_available' => $request->boolean('is_available', true),
            'image'        => $imagePath,
        ]);

        ActivityLog::record('menu.created', "Menambahkan menu {$menu->name}.", ['menu_id' => $menu->id, 'price' => $menu->price]);

        return back()->with('success', 'Menu baru berhasil ditambahkan.');
    }

    public function update(Request $request, Menu $menu)
    {
        $validated = $request->validate([
            'category_id'  => 'required|exists:categories,id',
            'name'         => 'required|string|max:255',
            'subcategory'  => 'nullable|string|max:100',
            'description'  => 'required|string|max:2000',
            'price'        => 'required|integer|min:1000|max:10000000',
            'cook_time'    => 'required|integer|min:1|max:240',
            'is_available' => 'boolean',
            'image'        => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        $imagePath = $menu->image;
        if ($request->hasFile('image')) {
            if ($menu->image && str_starts_with($menu->image, 'menus/')) {
                Storage::disk('public')->delete($menu->image);
            }
            $imagePath = $request->file('image')->store('menus', 'public');
        }

        $menu->update([
            'category_id'  => $validated['category_id'],
            'name'         => $validated['name'],
            'subcategory'  => $validated['subcategory'] ?? null,
            'description'  => $validated['description'],
            'price'        => $validated['price'],
            'cook_time'    => $validated['cook_time'],
            'is_available' => $request->boolean('is_available', true),
            'image'        => $imagePath,
        ]);

        return back()->with('success', 'Menu berhasil diperbarui.');
    }

    public function toggleAvailability(Menu $menu)
    {
        $menu->update(['is_available' => !$menu->is_available]);

        return back()->with('success', 'Status ketersediaan menu diperbarui.');
    }

    public function destroy(Menu $menu)
    {
        if ($menu->orderItems()->exists()) {
            return back()->with('error', 'Menu sudah memiliki riwayat transaksi. Nonaktifkan ketersediaannya saja agar riwayat pesanan tetap terjaga.');
        }

        if ($menu->image && str_starts_with($menu->image, 'menus/')) {
            Storage::disk('public')->delete($menu->image);
        }

        $menu->delete();

        return back()->with('success', 'Menu berhasil dihapus.');
    }
}
