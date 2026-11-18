<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Menu Nasi', 'slug' => 'menu-nasi', 'icon' => 'bowl-rice'],
            ['name' => 'Lauk Pauk', 'slug' => 'lauk-pauk', 'icon' => 'drumstick-bite'],
            ['name' => 'Minuman',   'slug' => 'minuman',   'icon' => 'glass-water'],
            ['name' => 'Dessert',   'slug' => 'dessert',   'icon' => 'ice-cream'],
        ];

        foreach ($categories as $cat) {
            Category::firstOrCreate(
                ['slug' => $cat['slug']],
                $cat
            );
        }
    }
}
