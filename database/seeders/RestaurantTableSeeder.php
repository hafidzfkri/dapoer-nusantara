<?php

namespace Database\Seeders;

use App\Models\RestaurantTable;
use Illuminate\Database\Seeder;

class RestaurantTableSeeder extends Seeder
{
    public function run(): void
    {
        $tables = [
            ['table_number' => 'M-01', 'capacity' => 2, 'status' => 'available', 'is_available' => true],
            ['table_number' => 'M-02', 'capacity' => 2, 'status' => 'available', 'is_available' => true],
            ['table_number' => 'M-03', 'capacity' => 4, 'status' => 'available', 'is_available' => true],
            ['table_number' => 'M-04', 'capacity' => 4, 'status' => 'available', 'is_available' => true],
            ['table_number' => 'M-05', 'capacity' => 4, 'status' => 'available', 'is_available' => true],
            ['table_number' => 'M-06', 'capacity' => 6, 'status' => 'available', 'is_available' => true],
            ['table_number' => 'M-07', 'capacity' => 6, 'status' => 'available', 'is_available' => true],
            ['table_number' => 'VIP-01', 'capacity' => 10, 'status' => 'available', 'is_available' => true],
        ];

        foreach ($tables as $t) {
            RestaurantTable::firstOrCreate(
                ['table_number' => $t['table_number']],
                $t
            );
        }
    }
}
