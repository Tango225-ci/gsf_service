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
 * Résidence d'un partenaire. Le prix partenaire n'est jamais envoyé à l'app client.
 */
#[Fillable([
    'partner_id', 'zone_id', 'name', 'address', 'bedrooms', 'capacity', 'amenities',
    'partner_price_per_night', 'client_price_per_night', 'active',
])]
#[Hidden(['partner_price_per_night'])]
class PartnerProperty extends Model
{
    use Audited, HasUuids;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'amenities' => 'array',
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
     * @return BelongsTo<Zone, $this>
     */
    public function zone(): BelongsTo
    {
        return $this->belongsTo(Zone::class);
    }

    /**
     * @return MorphMany<Attachment, $this>
     */
    public function photos(): MorphMany
    {
        return $this->morphMany(Attachment::class, 'owner');
    }
}
