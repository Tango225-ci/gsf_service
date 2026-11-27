<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

/**
 * Tout fichier : photo, vidéo, document, note vocale, PDF.
 * kind : photo, video, document, audio ou pdf. Les pièces d'identité et documents fonciers sont chiffrés.
 */
#[Fillable([
    'owner_type', 'owner_id', 'uploaded_by_id', 'kind', 'storage_key', 'mime_type', 'size_bytes',
    'encrypted', 'taken_at', 'gps_lat', 'gps_lng',
])]
class Attachment extends Model
{
    use HasUuids;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'encrypted' => 'boolean',
            'taken_at' => 'datetime',
            'gps_lat' => 'decimal:7',
            'gps_lng' => 'decimal:7',
        ];
    }

    /**
     * @return MorphTo<Model, $this>
     */
    public function owner(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function uploadedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by_id');
    }
}
