<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'order_id', 'payment_method', 'amount', 'status',
        'confirmed_by', 'paid_at', 'reference_number',
    ];

    protected function casts(): array
    {
        return [
            'amount'  => 'integer',
            'paid_at' => 'datetime',
        ];
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function confirmer()
    {
        return $this->belongsTo(User::class, 'confirmed_by');
    }

    public function logs()
    {
        return $this->hasMany(PaymentLog::class);
    }
}
