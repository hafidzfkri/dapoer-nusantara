<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class ActivityLog extends Model
{
    public $timestamps = false;

    protected $fillable = ['user_id', 'activity', 'description', 'properties', 'ip_address', 'created_at'];

    protected function casts(): array
    {
        return [
            'properties' => 'array',
            'created_at' => 'datetime',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public static function record(string $activity, string $description, array $properties = [], ?int $userId = null): void
    {
        self::create([
            'user_id'     => $userId ?? Auth::id(),
            'activity'    => $activity,
            'description' => $description,
            'properties'  => $properties ?: null,
            'ip_address'  => request()?->ip(),
            'created_at'  => now(),
        ]);
    }
}
