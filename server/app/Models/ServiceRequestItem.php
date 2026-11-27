<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Une prestation dans la demande : un service choisi, avec les réponses au formulaire.
 */
#[Fillable([
    'service_request_id', 'service_id', 'client_asset_id', 'price_rule_id', 'current_step_id',
    'accepted_proposal_id', 'answers', 'start_date', 'end_date', 'quantity', 'amount', 'official_fees',
])]
class ServiceRequestItem extends Model
{
    use HasUuids;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'answers' => 'array',
            'start_date' => 'date',
            'end_date' => 'date',
        ];
    }

    /**
     * @return BelongsTo<ServiceRequest, $this>
     */
    public function serviceRequest(): BelongsTo
    {
        return $this->belongsTo(ServiceRequest::class);
    }

    /**
     * @return BelongsTo<Service, $this>
     */
    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    /**
     * Le terrain concerné, pour un service foncier.
     *
     * @return BelongsTo<ClientAsset, $this>
     */
    public function asset(): BelongsTo
    {
        return $this->belongsTo(ClientAsset::class, 'client_asset_id');
    }

    /**
     * @return BelongsTo<PriceRule, $this>
     */
    public function priceRule(): BelongsTo
    {
        return $this->belongsTo(PriceRule::class);
    }

    /**
     * @return BelongsTo<ServiceStep, $this>
     */
    public function currentStep(): BelongsTo
    {
        return $this->belongsTo(ServiceStep::class, 'current_step_id');
    }

    /**
     * @return BelongsTo<Proposal, $this>
     */
    public function acceptedProposal(): BelongsTo
    {
        return $this->belongsTo(Proposal::class, 'accepted_proposal_id');
    }

    /**
     * @return BelongsToMany<ServiceOption, $this>
     */
    public function selectedOptions(): BelongsToMany
    {
        return $this->belongsToMany(ServiceOption::class);
    }

    /**
     * @return HasMany<Proposal, $this>
     */
    public function proposals(): HasMany
    {
        return $this->hasMany(Proposal::class);
    }

    /**
     * @return HasMany<Inspection, $this>
     */
    public function inspections(): HasMany
    {
        return $this->hasMany(Inspection::class);
    }
}
