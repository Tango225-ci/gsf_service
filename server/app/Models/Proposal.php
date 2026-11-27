<?php

namespace App\Models;

use App\Models\Concerns\Audited;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Une option envoyée par l'agent (résidence, véhicule) ou un devis.
 * service_fee : frais de service GSF fixés par l'agent selon le volume de la prestation (jamais un pourcentage).
 * status : sent, accepted, declined ou expired.
 */
#[Fillable([
    'service_request_item_id', 'created_by_id', 'partner_property_id', 'partner_vehicle_id', 'label',
    'description', 'unit_price', 'quantity', 'total', 'partner_cost', 'service_fee', 'deposit_percent',
    'valid_until', 'status',
])]
#[Hidden(['partner_cost'])]
class Proposal extends Model
{
    use Audited, HasUuids;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'valid_until' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<ServiceRequestItem, $this>
     */
    public function item(): BelongsTo
    {
        return $this->belongsTo(ServiceRequestItem::class, 'service_request_item_id');
    }

    /**
     * @return BelongsTo<Employee, $this>
     */
    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'created_by_id');
    }

    /**
     * @return BelongsTo<PartnerProperty, $this>
     */
    public function property(): BelongsTo
    {
        return $this->belongsTo(PartnerProperty::class, 'partner_property_id');
    }

    /**
     * @return BelongsTo<PartnerVehicle, $this>
     */
    public function vehicle(): BelongsTo
    {
        return $this->belongsTo(PartnerVehicle::class, 'partner_vehicle_id');
    }

    /**
     * @return HasMany<ProposalLine, $this>
     */
    public function lines(): HasMany
    {
        return $this->hasMany(ProposalLine::class);
    }
}
