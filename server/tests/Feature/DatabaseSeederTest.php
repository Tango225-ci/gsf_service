<?php

namespace Tests\Feature;

use App\Enums\Role;
use App\Models\Service;
use App\Models\Setting;
use Database\Seeders\CatalogSeeder;
use Database\Seeders\RoleSeeder;
use Database\Seeders\SettingSeeder;
use Database\Seeders\ZoneSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role as SpatieRole;
use Tests\TestCase;

/**
 * Les données de référence se chargent et respectent les décisions du cadrage.
 */
class DatabaseSeederTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed([RoleSeeder::class, SettingSeeder::class, ZoneSeeder::class, CatalogSeeder::class]);
    }

    public function test_the_five_roles_exist(): void
    {
        $this->assertEqualsCanonicalizing(
            array_map(fn (Role $role): string => $role->value, Role::cases()),
            SpatieRole::query()->pluck('name')->all(),
        );
    }

    public function test_acd_has_the_validated_steps(): void
    {
        $steps = Service::query()->where('slug', 'dossier-acd')->sole()->steps()->pluck('name')->all();

        $this->assertSame([
            'Collecte des pièces', 'Constitution du dossier', 'Dépôt de la demande au ministère',
            "Suivi de l'instruction", "Signature de l'ACD", 'Retrait et remise au client',
        ], $steps);
    }

    public function test_services_without_proposal_have_a_fixed_service_fee(): void
    {
        foreach (Service::query()->get() as $service) {
            if ($service->pricing_mode->needsProposal()) {
                $this->assertNull($service->fixed_service_fee, "{$service->slug} : frais fixés par l'agent dans la proposition");
            } else {
                $this->assertGreaterThan(0, $service->fixed_service_fee, "{$service->slug} : frais GSF fixes attendus");
            }
        }
    }

    public function test_default_deposit_is_thirty_percent_and_no_percentage_fee_exists(): void
    {
        $this->assertSame(30, Setting::get('default_deposit_percent'));
        $this->assertNull(Setting::get('default_fee_percent'));
    }
}
