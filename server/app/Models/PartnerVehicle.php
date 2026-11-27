<?php

namespace App\Models;

use App\Models\Concerns\Audited;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;

/**
 * Véhicule d'un partenaire. Le prix partenaire n'est jamais envoyé à l'app client.
 */
#[Fillable([
    'partner_id', 'model', 'category', 'plate', 'seats', 'driver_available',
    'partner_price_per_day', 'client_price_per_day', 'driver_price_per_day', 'active',
])]
#[Hidden(['partner_price_per_day'])]
class PartnerVehicle extends Model
{
    use Audited, HasUuids;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'driver_available' => 'boolean',
            'active' => 'boolean',
        ];
    }

    /**
     * @return BelongsTo<Partner, $this>
     */
    public function partner(): BelongsTo
    {
        return $this->belongsTo(Partner::class);
    }

    /**
     * @return MorphMany<Attachment, $this>
     */
    public function photos(): MorphMany
    {
        return $this->morphMany(Attachment::class, 'owner');
    }
}
