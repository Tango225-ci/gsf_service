<?php

namespace App\Models;

use App\Models\Concerns\Audited;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;

/**
 * Un bien du client (« Mes biens »), enregistré une fois et réutilisé par toutes ses demandes foncières.
 * type : land ou building. title_type : village_certificate, allocation_letter, acd, land_title ou none.
 */
#[Fillable([
    'client_profile_id', 'zone_id', 'type', 'label', 'locality', 'lot_number', 'block_number',
    'area_m2', 'gps_lat', 'gps_lng', 'title_type', 'notes',
])]
class ClientAsset extends Model
{
    use Audited, HasUuids;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'gps_lat' => 'decimal:7',
            'gps_lng' => 'decimal:7',
        ];
    }

    /**
     * @return BelongsTo<ClientProfile, $this>
     */
    public function clientProfile(): BelongsTo
    {
        return $this->belongsTo(ClientProfile::class);
    }

    /**
     * @return BelongsTo<Zone, $this>
     */
    public function zone(): BelongsTo
    {
        return $this->belongsTo(Zone::class);
    }

    /**
     * Documents du terrain (plan, attestation, ACD…), chiffrés.
     *
     * @return MorphMany<Attachment, $this>
     */
    public function attachments(): MorphMany
    {
        return $this->morphMany(Attachment::class, 'owner');
    }
}
