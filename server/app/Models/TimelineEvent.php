<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;

/**
 * Un événement du fil de suivi. type : status, step, payment, assignment ou note.
 * occurred_at garde l'heure réelle, même pour une mise à jour envoyée plus tard (hors réseau).
 */
#[Fillable([
    'service_request_id', 'service_request_item_id', 'service_step_id', 'author_id', 'type',
    'comment', 'visible_to_client', 'occurred_at',
])]
class TimelineEvent extends Model
{
    use HasUuids;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'visible_to_client' => 'boolean',
            'occurred_at' => 'datetime',
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
     * @return BelongsTo<ServiceStep, $this>
     */
    public function step(): BelongsTo
    {
        return $this->belongsTo(ServiceStep::class, 'service_step_id');
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    /**
     * Preuves : photos, récépissés.
     *
     * @return MorphMany<Attachment, $this>
     */
    public function attachments(): MorphMany
    {
        return $this->morphMany(Attachment::class, 'owner');
    }
}
