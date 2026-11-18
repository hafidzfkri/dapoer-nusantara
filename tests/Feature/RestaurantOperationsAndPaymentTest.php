<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Menu;
use App\Models\Order;
use App\Models\Payment;
use App\Models\RestaurantTable;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RestaurantOperationsAndPaymentTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
    }

    public function test_checkout_recalculates_totals_and_creates_unpaid_payment(): void
    {
        $customer = User::where('email', 'customer@dapoernusantara.test')->firstOrFail();
        $cat = Category::create(['name' => 'Menu Nasi', 'slug' => 'menu-nasi']);
        $menu = Menu::create([
            'category_id'  => $cat->id,
            'name'         => 'Nasi Liwet',
            'slug'         => 'nasi-liwet',
            'description'  => 'Nasi liwet gurih',
            'price'        => 28000,
            'cook_time'    => 25,
            'is_available' => true,
        ]);

        $this->actingAs($customer)->post('/cart/add', [
            'menu_id'     => $menu->id,
            'quantity'    => 2,
            'spice_level' => 'Sedang',
            'addons'      => ['Telur Balado'],
        ])->assertRedirect();

        // Kirim field total_price palsu dari frontend — harus diabaikan backend
        $this->actingAs($customer)->post('/checkout', [
            'name'           => $customer->name,
            'phone'          => '08123456789',
            'delivery_type'  => 'dine-in',
            'payment_method' => 'qris',
            'total_price'    => 100,
        ])->assertRedirect();

        // (28000 + 10000) * 2 = 76000; tax 10% = 7600; total = 83600
        $order = Order::firstOrFail();
        $this->assertEquals(76000, $order->subtotal);
        $this->assertEquals(7600, $order->tax);
        $this->assertEquals(83600, $order->total_price);
        $this->assertEquals('pending', $order->status);

        $payment = Payment::where('order_id', $order->id)->firstOrFail();
        $this->assertEquals('unpaid', $payment->status);
        $this->assertEquals(83600, $payment->amount);
    }

    public function test_cashier_can_confirm_payment_once_and_double_payment_is_rejected(): void
    {
        $customer = User::where('email', 'customer@dapoernusantara.test')->firstOrFail();
        $cashier  = User::where('email', 'cashier@dapoernusantara.test')->firstOrFail();
        $kitchen  = User::where('email', 'kitchen@dapoernusantara.test')->firstOrFail();

        $order = Order::create([
            'user_id'        => $customer->id,
            'order_number'   => 'DN-PAY01',
            'subtotal'       => 50000,
            'tax'            => 5000,
            'shipping'       => 0,
            'total_price'    => 55000,
            'payment_method' => 'qris',
            'delivery_type'  => 'dine-in',
            'phone'          => '08123456789',
            'status'         => 'pending',
        ]);

        $payment = Payment::create([
            'order_id'       => $order->id,
            'payment_method' => 'qris',
            'amount'         => 55000,
            'status'         => 'unpaid',
        ]);

        // Kitchen & Customer tidak boleh konfirmasi pembayaran
        $this->actingAs($kitchen)->post("/admin/payments/{$payment->id}/confirm")->assertStatus(403);
        $this->actingAs($customer)->post("/admin/payments/{$payment->id}/confirm")->assertStatus(403);

        // Cashier konfirmasi pembayaran pertama -> berhasil
        $this->actingAs($cashier)->post("/admin/payments/{$payment->id}/confirm")->assertSessionHas('success');
        $this->assertEquals('paid', $payment->fresh()->status);
        $this->assertEquals('confirmed', $order->fresh()->status);

        // Pembayaran ganda ditolak
        $this->actingAs($cashier)->post("/admin/payments/{$payment->id}/confirm")->assertSessionHas('error');
    }

    public function test_reservation_conflict_on_same_table_and_time_is_rejected(): void
    {
        $waiter = User::where('email', 'waiter@dapoernusantara.test')->firstOrFail();
        $table  = RestaurantTable::create([
            'table_number' => 'M-01',
            'capacity'     => 4,
            'status'       => 'available',
            'is_available' => true,
        ]);

        $this->actingAs($waiter)->post('/admin/reservations', [
            'table_id'         => $table->id,
            'customer_name'    => 'Tamu Pertama',
            'customer_phone'   => '0811111111',
            'reservation_date' => '2026-12-01',
            'reservation_time' => '19:00',
            'guest_count'      => 3,
        ])->assertSessionHas('success');

        // Bentrok pada jam 19:30 di meja yang sama
        $this->actingAs($waiter)->post('/admin/reservations', [
            'table_id'         => $table->id,
            'customer_name'    => 'Tamu Kedua',
            'customer_phone'   => '0822222222',
            'reservation_date' => '2026-12-01',
            'reservation_time' => '19:30',
            'guest_count'      => 2,
        ])->assertSessionHas('error');
    }

    public function test_public_homepage_reservation_saves_and_prevents_conflicts(): void
    {
        $table = RestaurantTable::create([
            'table_number' => 'M-02',
            'capacity'     => 4,
            'status'       => 'available',
            'is_available' => true,
        ]);

        $this->post('/reservations', [
            'table_id'         => $table->id,
            'customer_name'    => 'Pelanggan Publik',
            'customer_phone'   => '081234567890',
            'reservation_date' => '2026-12-05',
            'reservation_time' => '19:00',
            'guest_count'      => 2,
        ])->assertSessionHas('success');

        $this->assertDatabaseHas('reservations', [
            'table_id'      => $table->id,
            'customer_name' => 'Pelanggan Publik',
            'status'        => 'pending',
        ]);

        // Bentrok pada jam 19:30
        $this->post('/reservations', [
            'table_id'         => $table->id,
            'customer_name'    => 'Pelanggan Bentrok',
            'customer_phone'   => '081299999999',
            'reservation_date' => '2026-12-05',
            'reservation_time' => '19:30',
            'guest_count'      => 2,
        ])->assertSessionHasErrors('reservation_time');
    }
}
