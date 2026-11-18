<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthSecurityTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register_with_valid_data_and_password_is_hashed(): void
    {
        $response = $this->post('/register', [
            'name'                  => 'Budi Santoso',
            'email'                 => 'budi@example.com',
            'phone'                 => '081234567890',
            'password'              => 'Rahasia123!',
            'password_confirmation' => 'Rahasia123!',
            'terms'                 => '1',
        ]);

        $response->assertRedirect('/login');
        $user = User::where('email', 'budi@example.com')->first();
        $this->assertNotNull($user);
        $this->assertTrue(Hash::check('Rahasia123!', $user->password));
    }

    public function test_register_rejects_password_shorter_than_8_characters(): void
    {
        $response = $this->post('/register', [
            'name'                  => 'Budi Santoso',
            'email'                 => 'short@example.com',
            'phone'                 => '081234567890',
            'password'              => '1234567',
            'password_confirmation' => '1234567',
            'terms'                 => '1',
        ]);

        $response->assertSessionHasErrors('password');
        $this->assertDatabaseMissing('users', ['email' => 'short@example.com']);
    }

    public function test_register_rejects_duplicate_email(): void
    {
        User::create([
            'name'     => 'Existing',
            'email'    => 'dup@example.com',
            'phone'    => '0811111111',
            'password' => Hash::make('Password123!'),
        ]);

        $response = $this->post('/register', [
            'name'                  => 'Duplicate',
            'email'                 => 'dup@example.com',
            'phone'                 => '0822222222',
            'password'              => 'Password123!',
            'password_confirmation' => 'Password123!',
            'terms'                 => '1',
        ]);

        $response->assertSessionHasErrors('email');
    }

    public function test_login_rate_limiting_blocks_brute_force_attempts(): void
    {
        User::create([
            'name'     => 'Target User',
            'email'    => 'target@example.com',
            'phone'    => '08123456789',
            'password' => Hash::make('CorrectPass123'),
        ]);

        for ($i = 0; $i < 5; $i++) {
            $this->post('/login', [
                'email'    => 'target@example.com',
                'password' => 'WrongPass123',
            ]);
        }

        $response = $this->post('/login', [
            'email'    => 'target@example.com',
            'password' => 'CorrectPass123',
        ]);

        $response->assertSessionHasErrors('email');
        $this->assertGuest();
    }

    public function test_user_can_login_and_logout_with_session_invalidation(): void
    {
        User::create([
            'name'     => 'Valid User',
            'email'    => 'valid@example.com',
            'phone'    => '08123456789',
            'password' => Hash::make('ValidPass123'),
        ]);

        $loginResponse = $this->post('/login', [
            'email'    => 'valid@example.com',
            'password' => 'ValidPass123',
        ]);

        $loginResponse->assertRedirect('/menu');
        $this->assertAuthenticated();

        $logoutResponse = $this->post('/logout');
        $logoutResponse->assertRedirect('/menu');
        $this->assertGuest();
    }
}
