<?php

namespace App\Policies;

use App\Models\Order;
use App\Models\User;

class OrderPolicy
{
    public function view(User $user, Order $order): bool
    {
        if ($order->user_id === $user->id) {
            return true;
        }

        return $user->hasPermission('order.view');
    }

    public function updateStatus(User $user): bool
    {
        return $user->hasPermission('order.update_status') || $user->hasPermission('kitchen.manage');
    }
}
