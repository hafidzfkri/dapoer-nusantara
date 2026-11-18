<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaymentLog extends Model
{
    public $timestamps = false;

    protected $fillable = ['payment_id', 'changed_by', 'from_status', 'to_status', 'note', 'created_at'];

    public function payment()
    {
        return $this->belongsTo(Payment::class);
    }

    public function actor()
    {
        return $this->belongsTo(User::class, 'changed_by');
    }
}
