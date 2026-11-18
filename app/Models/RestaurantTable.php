<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RestaurantTable extends Model
{
    protected $fillable = ['table_number', 'capacity', 'status', 'is_available'];

    protected function casts(): array
    {
        return [
            'capacity'     => 'integer',
            'is_available' => 'boolean',
        ];
    }

    public function reservations()
    {
        return $this->hasMany(Reservation::class, 'table_id');
    }
}
