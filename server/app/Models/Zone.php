<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Commune ou ville : sert aux tarifs, aux zones des agents et aux terrains.
 */
#[Fillable(['parent_id', 'name', 'region'])]
class Zone extends Model
{
    use HasUuids;

    /**
     * @return BelongsTo<Zone, $this>
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(Zone::class, 'parent_id');
    }

    /**
     * @return HasMany<Zone, $this>
     */
    public function children(): HasMany
    {
        return $this->hasMany(Zone::class, 'parent_id');
    }
}
