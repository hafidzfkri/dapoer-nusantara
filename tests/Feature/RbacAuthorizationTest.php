<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\Role;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class RbacAuthorizationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
    }

    public function test_public_registration_always_assigns_customer_role_even_if_role_is_injected(): void
    {
        $adminRole = Role::where('name', 'admin')->firstOrFail();

        $this->post('/register', [
            'name'                  => 'Attacker',
            'email'                 => 'attacker@example.com',
            'phone'                 => '08123456789',
            'password'              => 'Password123!',
            'password_confirmation' => 'Password123!',
            'terms'                 => '1',
            'role'                  => 'admin',
            'role_id'               => $adminRole->id,
        ])->assertRedirect('/login');

        $user = User::where('email', 'attacker@example.com')->firstOrFail();
        $this->assertTrue($user->hasRole('customer'));
        $this->assertFalse($user->hasRole('admin'));
    }

    public function test_inactive_user_cannot_login(): void
    {
        $role = Role::where('name', 'customer')->firstOrFail();
        $user = User::create([
            'name'     => 'Suspended User',
            'email'    => 'suspended@example.com',
            'phone'    => '08123456789',
            'password' => Hash::make('Password123!'),
        ]);
        $user->role_id = $role->id;
        $user->is_active = false;
        $user->save();

        $response = $this->post('/login', [
            'email'    => 'suspended@example.com',
            'password' => 'Password123!',
        ]);

        $response->assertSessionHasErrors('email');
        $this->assertGuest();
    }

    public function test_role_permissions_are_enforced_accurately(): void
    {
        $admin   = User::where('email', 'admin@dapoernusantara.test')->firstOrFail();
        $manager = User::where('email', 'manager@dapoernusantara.test')->firstOrFail();
        $cashier = User::where('email', 'cashier@dapoernusantara.test')->firstOrFail();
        $kitchen = User::where('email', 'kitchen@dapoernusantara.test')->firstOrFail();
        $cust    = User::where('email', 'customer@dapoernusantara.test')->firstOrFail();

        $this->assertTrue($admin->hasPermission('role.manage'));
        $this->assertTrue($manager->hasPermission('menu.manage'));
        $this->assertFalse($manager->hasPermission('role.manage'));
        $this->assertTrue($cashier->hasPermission('payment.confirm'));
        $this->assertFalse($cashier->hasPermission('user.manage'));
        $this->assertTrue($kitchen->hasPermission('kitchen.manage'));
        $this->assertFalse($kitchen->hasPermission('payment.confirm'));
        $this->assertFalse($cust->hasPermission('dashboard.view'));
    }

    public function test_customer_cannot_view_another_customers_order(): void
    {
        $cust1 = User::where('email', 'customer@dapoernusantara.test')->firstOrFail();
        $cust2 = User::create([
            'name'     => 'Other Customer',
            'email'    => 'other@example.com',
            'phone'    => '0819999999',
            'password' => Hash::make('Password123!'),
        ]);

        $order = Order::create([
            'user_id'        => $cust1->id,
            'order_number'   => 'DN-TEST01',
            'subtotal'       => 25000,
            'tax'            => 2500,
            'shipping'       => 0,
            'total_price'    => 27500,
            'payment_method' => 'qris',
            'delivery_type'  => 'dine-in',
            'address'        => 'Dine-In',
            'city'           => 'Resto',
            'phone'          => '08123456789',
            'status'         => 'pending',
        ]);

        $this->actingAs($cust2)
            ->get("/payment-success/{$order->id}")
            ->assertStatus(403);
    }

    public function test_staff_roles_cannot_access_customer_cart_or_checkout(): void
    {
        foreach (['admin', 'manager', 'cashier', 'waiter', 'kitchen'] as $role) {
            $staff = User::where('email', "{$role}@dapoernusantara.test")->firstOrFail();

            $this->actingAs($staff)->get('/cart')->assertStatus(403);
            $this->actingAs($staff)->get('/checkout')->assertStatus(403);
        }
    }
}
