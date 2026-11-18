<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    public const STATUS_TRANSITIONS = [
        'pending'    => ['confirmed', 'cancelled'],
        'processing' => ['confirmed', 'preparing', 'ready', 'completed', 'cancelled'],
        'confirmed'  => ['preparing', 'cancelled'],
        'preparing'  => ['ready', 'cancelled'],
        'ready'      => ['completed'],
        'completed'  => [],
        'cancelled'  => [],
    ];

    protected $fillable = [
        'user_id', 'order_number', 'subtotal', 'tax', 'shipping',
        'total_price', 'payment_method', 'delivery_type',
        'address', 'city', 'phone', 'notes', 'status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function payment()
    {
        return $this->hasOne(Payment::class);
    }

    public function canTransitionTo(string $newStatus): bool
    {
        $allowed = self::STATUS_TRANSITIONS[$this->status] ?? [];
        return in_array($newStatus, $allowed, true);
    }

    public static function generateOrderNumber(): string
    {
        return 'PG-' . strtoupper(substr(uniqid(), -5));
    }
}
