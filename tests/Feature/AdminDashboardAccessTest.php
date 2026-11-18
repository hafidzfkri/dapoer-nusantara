<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminDashboardAccessTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
    }

    public function test_guest_is_redirected_to_login_from_admin(): void
    {
        $this->get('/admin')->assertRedirect('/login');
    }

    public function test_customer_cannot_access_admin_dashboard(): void
    {
        $customer = User::where('email', 'customer@dapoernusantara.test')->firstOrFail();

        $this->actingAs($customer)
            ->get('/admin')
            ->assertStatus(403);
    }

    public function test_staff_roles_can_access_admin_dashboard(): void
    {
        foreach (['admin', 'manager', 'cashier', 'waiter', 'kitchen'] as $role) {
            $user = User::where('email', "{$role}@dapoernusantara.test")->firstOrFail();

            $this->actingAs($user)
                ->get('/admin')
                ->assertStatus(200);
        }
    }
}
