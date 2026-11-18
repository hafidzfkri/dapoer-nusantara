<?php

namespace Tests\Feature;

use App\Models\ActivityLog;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ActivityLogAndSecurityTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
    }

    public function test_security_headers_are_present_on_responses(): void
    {
        $response = $this->get('/');

        $response->assertHeader('X-Content-Type-Options', 'nosniff');
        $response->assertHeader('X-Frame-Options', 'SAMEORIGIN');
        $response->assertHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
        $response->assertHeader('Content-Security-Policy');
    }

    public function test_customer_can_view_own_reservations_and_honeypot_blocks_bots(): void
    {
        $customer = User::where('email', 'customer@dapoernusantara.test')->firstOrFail();

        $this->post('/reservations', [
            'website'        => 'https://spam-bot.test',
            'customer_name'  => 'Bot',
            'customer_phone' => '0000',
        ])->assertRedirect();

        $this->assertDatabaseMissing('reservations', ['customer_name' => 'Bot']);

        $this->actingAs($customer)->get('/reservations')->assertStatus(200);
    }

    public function test_login_and_failed_login_are_recorded_in_activity_logs(): void
    {
        $this->post('/login', [
            'email'    => 'admin@dapoernusantara.test',
            'password' => 'WrongPassword123',
        ]);

        $this->assertDatabaseHas('activity_logs', [
            'activity' => 'auth.login_failed',
        ]);

        $this->post('/login', [
            'email'    => 'admin@dapoernusantara.test',
            'password' => 'Password123!',
        ]);

        $this->assertDatabaseHas('activity_logs', [
            'activity' => 'auth.login',
        ]);

        $admin = User::where('email', 'admin@dapoernusantara.test')->firstOrFail();
        $this->actingAs($admin)->get('/admin/activity-logs')->assertStatus(200);
    }

    public function test_non_admin_cannot_access_activity_logs_or_settings(): void
    {
        $manager = User::where('email', 'manager@dapoernusantara.test')->firstOrFail();

        $this->actingAs($manager)->get('/admin/activity-logs')->assertStatus(403);
        $this->actingAs($manager)->get('/admin/settings')->assertStatus(403);
        $this->actingAs($manager)->get('/admin/reports')->assertStatus(200);
    }
}
