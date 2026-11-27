<?php

namespace Tests\Feature;

use App\Enums\Role;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

/**
 * Le back-office (/admin) est réservé au coordinateur, aux managers et aux admins.
 */
class BackOfficeAccessTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleSeeder::class);
    }

    /**
     * @return array<string, array{Role, int}>
     */
    public static function roles(): array
    {
        return [
            'admin' => [Role::Admin, 200],
            'manager' => [Role::Manager, 200],
            'coordinateur' => [Role::Coordinator, 200],
            'agent' => [Role::Agent, 403],
            'client' => [Role::Client, 403],
        ];
    }

    #[DataProvider('roles')]
    public function test_back_office_access_depends_on_role(Role $role, int $expectedStatus): void
    {
        $user = User::factory()->create();
        $user->assignRole($role->value);

        $this->actingAs($user)->get('/admin')->assertStatus($expectedStatus);
    }

    public function test_suspended_staff_cannot_access_back_office(): void
    {
        $user = User::factory()->create(['status' => 'suspended']);
        $user->assignRole(Role::Admin->value);

        $this->actingAs($user)->get('/admin')->assertForbidden();
    }

    public function test_guest_is_redirected_to_login(): void
    {
        $this->get('/admin')->assertRedirect('/admin/login');
    }
}
