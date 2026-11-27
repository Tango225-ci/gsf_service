<?php

namespace Tests\Feature;

use App\Models\Partner;
use App\Support\EncryptedFiles;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

/**
 * Chiffrement des données sensibles (tâche 0.7).
 */
class EncryptionTest extends TestCase
{
    use RefreshDatabase;

    public function test_partner_payout_details_are_encrypted_in_database(): void
    {
        $partner = Partner::query()->create([
            'type' => 'property_owner', 'name' => 'M. Bamba',
            'payout_details' => ['mobile_money' => '+225 07 00 00 00 01'],
        ]);

        $raw = DB::table('partners')->where('id', $partner->id)->value('payout_details');

        $this->assertStringNotContainsString('07 00 00 00 01', $raw);
        $this->assertSame(['mobile_money' => '+225 07 00 00 00 01'], $partner->fresh()->payout_details);
    }

    public function test_sensitive_files_are_stored_encrypted(): void
    {
        Storage::fake();

        EncryptedFiles::put('documents/piece-identite.txt', 'Passeport n° 12AB34567');

        $this->assertStringNotContainsString('12AB34567', Storage::get('documents/piece-identite.txt'));
        $this->assertSame('Passeport n° 12AB34567', EncryptedFiles::get('documents/piece-identite.txt'));
    }
}
