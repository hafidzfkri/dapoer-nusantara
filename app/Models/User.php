<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use Notifiable;

    // role_id dan is_active sengaja tidak masuk $fillable untuk mencegah mass-assignment privilege escalation.
    protected $fillable = ['name', 'email', 'phone', 'password'];

    protected $hidden = ['password', 'remember_token'];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',
            'is_active'         => 'boolean',
        ];
    }

    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function hasRole(string|array $roles): bool
    {
        $roleName = $this->role?->name;
        if (!$roleName) {
            return false;
        }
        return in_array($roleName, (array) $roles, true);
    }

    public function hasPermission(string $permission): bool
    {
        if (!$this->role) {
            return false;
        }
        if ($this->role->name === 'admin') {
            return true;
        }
        return $this->role->permissions()->where('name', $permission)->exists();
    }

    public function isStaff(): bool
    {
        return $this->hasRole(['admin', 'manager', 'cashier', 'waiter', 'kitchen']);
    }
}
