<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Option ou supplément d'un service. kind : supplement, checkbox ou switch_to_quote.
 */
#[Fillable(['service_id', 'label', 'kind', 'amount'])]
class ServiceOption extends Model
{
    use HasUuids;

    /**
     * @return BelongsTo<Service, $this>
     */
    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }
}
