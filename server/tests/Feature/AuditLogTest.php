<?php

namespace Tests\Feature;

use App\Models\AuditLog;
use App\Models\Partner;
use App\Models\PartnerProperty;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Journal des actions (tâche 0.7) : chaque création, modification et suppression est enregistrée,
 * avec l'auteur, et les champs cachés (prix partenaire…) sont masqués.
 */
class AuditLogTest extends TestCase
{
    use RefreshDatabase;

    private function property(): PartnerProperty
    {
        $partner = Partner::query()->create(['type' => 'property_owner', 'name' => 'M. Bamba']);

        return $partner->properties()->create([
            'name' => 'Villa Riviera 3', 'partner_price_per_night' => 42000, 'client_price_per_night' => 55000,
        ]);
    }

    public function test_creation_is_logged_with_hidden_fields_masked(): void
    {
        $property = $this->property();

        $log = AuditLog::query()->where('auditable_id', $property->id)->sole();

        $this->assertSame('created', $log->action);
        $this->assertSame(55000, $log->after['client_price_per_night']);
        $this->assertSame('[masqué]', $log->after['partner_price_per_night']);
    }

    public function test_update_logs_before_and_after_with_actor(): void
    {
        $property = $this->property();
        $staff = User::factory()->create();

        $this->actingAs($staff);
        $property->update(['client_price_per_night' => 60000]);

        $log = AuditLog::query()->where('auditable_id', $property->id)->where('action', 'updated')->sole();

        $this->assertSame(['client_price_per_night' => 55000], $log->before);
        $this->assertSame(['client_price_per_night' => 60000], $log->after);
        $this->assertSame($staff->id, $log->actor_id);
    }

    public function test_deletion_is_logged(): void
    {
        $property = $this->property();
        $property->delete();

        $this->assertDatabaseHas('audit_logs', ['auditable_id' => $property->id, 'action' => 'deleted']);
    }
}
