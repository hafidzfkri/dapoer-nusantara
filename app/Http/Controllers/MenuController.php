<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Menu;
use App\Models\RestaurantTable;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MenuController extends Controller
{
    public function index(Request $request)
    {
        $categories     = Category::withCount('menus')->get();
        $activeCategory = $request->get('category', 'semua');
        $search         = $request->get('search', '');

        $allMenus = Menu::with('category')
            ->where('is_available', true)
            ->orderBy('category_id')
            ->orderBy('id')
            ->get();

        $signatureMenus = $allMenus->take(6)->values();
        $tables         = RestaurantTable::where('is_available', true)
            ->orderBy('table_number')
            ->get(['id', 'table_number', 'capacity']);

        return Inertia::render('Home', [
            'categories'     => $categories,
            'menus'          => $allMenus,
            'signatureMenus' => $signatureMenus,
            'tables'         => $tables,
            'activeCategory' => $activeCategory,
            'search'         => $search,
        ]);
    }

    public function show(string $slug)
    {
        $menu = Menu::with('category')->where('slug', $slug)->firstOrFail();
        $related = Menu::with('category')
            ->where('category_id', $menu->category_id)
            ->where('id', '!=', $menu->id)
            ->where('is_available', true)
            ->inRandomOrder()
            ->limit(4)
            ->get();

        return Inertia::render('Menu/Show', [
            'menu'    => $menu,
            'related' => $related,
        ]);
    }
}
