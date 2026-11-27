<?php

namespace App\Models;

use App\Enums\PricingMode;
use App\Enums\PricingUnit;
use App\Models\Concerns\Audited;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Un service du catalogue, configuré dans le back-office sans développement.
 * Frais de service GSF : jamais en pourcentage. Montant fixe ici pour les services à prix fixe,
 * sinon fixé par l'agent dans chaque proposition.
 */
#[Fillable([
    'service_category_id', 'slug', 'name', 'description', 'included', 'pricing_mode', 'unit',
    'display_price', 'deposit_percent', 'fixed_service_fee', 'requires_asset', 'requires_mandate',
    'published', 'sort_order',
])]
class Service extends Model
{
    use Audited, HasUuids;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'pricing_mode' => PricingMode::class,
            'unit' => PricingUnit::class,
            'requires_asset' => 'boolean',
            'requires_mandate' => 'boolean',
            'published' => 'boolean',
        ];
    }

    /**
     * @return BelongsTo<ServiceCategory, $this>
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(ServiceCategory::class, 'service_category_id');
    }

    /**
     * @return HasMany<ServiceField, $this>
     */
    public function fields(): HasMany
    {
        return $this->hasMany(ServiceField::class)->orderBy('sort_order');
    }

    /**
     * @return HasMany<ServiceStep, $this>
     */
    public function steps(): HasMany
    {
        return $this->hasMany(ServiceStep::class)->orderBy('sort_order');
    }

    /**
     * @return HasMany<PriceRule, $this>
     */
    public function priceRules(): HasMany
    {
        return $this->hasMany(PriceRule::class);
    }

    /**
     * @return HasMany<ServiceOption, $this>
     */
    public function options(): HasMany
    {
        return $this->hasMany(ServiceOption::class);
    }

    /**
     * @return HasMany<OfficialFee, $this>
     */
    public function officialFees(): HasMany
    {
        return $this->hasMany(OfficialFee::class);
    }

    /**
     * @return HasMany<SeasonRule, $this>
     */
    public function seasonRules(): HasMany
    {
        return $this->hasMany(SeasonRule::class);
    }
}
