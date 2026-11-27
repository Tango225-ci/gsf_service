<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * Reversement à un partenaire, enregistré à la main au lancement.
 */
#[Fillable(['partner_id', 'amount', 'period_start', 'period_end', 'status', 'reference', 'paid_at'])]
class Payout extends Model
{
    use HasUuids;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'period_start' => 'date',
            'period_end' => 'date',
            'paid_at' => 'datetime',
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
     * @return BelongsToMany<ServiceRequestItem, $this>
     */
    public function items(): BelongsToMany
    {
        return $this->belongsToMany(ServiceRequestItem::class);
    }
}
