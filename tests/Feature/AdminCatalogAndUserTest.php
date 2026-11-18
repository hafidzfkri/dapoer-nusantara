<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Menu;
use App\Models\Role;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminCatalogAndUserTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
    }

    public function test_manager_can_manage_categories_and_menus_but_cannot_manage_users(): void
    {
        $manager = User::where('email', 'manager@dapoernusantara.test')->firstOrFail();

        $this->actingAs($manager)
            ->post('/admin/categories', ['name' => 'Paket Spesial'])
            ->assertRedirect();

        $category = Category::where('name', 'Paket Spesial')->firstOrFail();

        $this->actingAs($manager)
            ->post('/admin/menus', [
                'category_id'  => $category->id,
                'name'         => 'Nasi Bogana',
                'description'  => 'Nasi khas Nusantara lengkap dengan lauk pauk.',
                'price'        => 32000,
                'cook_time'    => 25,
                'is_available' => true,
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('menus', ['name' => 'Nasi Bogana']);

        // Kategori yang masih dipakai menu tidak boleh terhapus
        $this->actingAs($manager)
            ->delete("/admin/categories/{$category->id}")
            ->assertSessionHas('error');

        $this->assertDatabaseHas('categories', ['id' => $category->id]);

        // Manager tidak boleh mengakses User Management
        $this->actingAs($manager)
            ->get('/admin/users')
            ->assertStatus(403);
    }

    public function test_admin_cannot_deactivate_themselves_or_downgrade_sole_admin(): void
    {
        $admin = User::where('email', 'admin@dapoernusantara.test')->firstOrFail();
        $customerRole = Role::where('name', 'customer')->firstOrFail();

        $this->actingAs($admin)
            ->patch("/admin/users/{$admin->id}/toggle")
            ->assertSessionHas('error');

        $this->assertTrue($admin->fresh()->is_active);

        $this->actingAs($admin)
            ->patch("/admin/users/{$admin->id}/role", ['role_id' => $customerRole->id])
            ->assertSessionHas('error');

        $this->assertTrue($admin->fresh()->hasRole('admin'));
    }
}
