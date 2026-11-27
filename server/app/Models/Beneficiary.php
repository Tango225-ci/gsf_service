<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Un proche du client sur place.
 */
#[Fillable(['client_profile_id', 'full_name', 'phone', 'relation', 'city'])]
class Beneficiary extends Model
{
    use HasUuids;

    /**
     * @return BelongsTo<ClientProfile, $this>
     */
    public function clientProfile(): BelongsTo
    {
        return $this->belongsTo(ClientProfile::class);
    }
}
