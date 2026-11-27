<?php

namespace App\Models;

use App\Models\Concerns\Audited;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Propriétaire de résidences (property_owner) ou loueur de véhicules (vehicle_renter).
 * Pas de partenaire pour le foncier : il est géré par le cabinet de géomètres de GSF.
 */
#[Fillable(['type', 'name', 'phone', 'email', 'payout_details', 'notes', 'active'])]
#[Hidden(['payout_details', 'notes'])]
class Partner extends Model
{
    use Audited, HasUuids;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'payout_details' => 'encrypted:array',
            'active' => 'boolean',
        ];
    }

    /**
     * @return HasMany<PartnerProperty, $this>
     */
    public function properties(): HasMany
    {
        return $this->hasMany(PartnerProperty::class);
    }

    /**
     * @return HasMany<PartnerVehicle, $this>
     */
    public function vehicles(): HasMany
    {
        return $this->hasMany(PartnerVehicle::class);
    }

    /**
     * @return HasMany<Payout, $this>
     */
    public function payouts(): HasMany
    {
        return $this->hasMany(Payout::class);
    }
}
