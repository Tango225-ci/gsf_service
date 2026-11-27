<?php

namespace App\Models;

use App\Models\Concerns\Audited;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Procuration signée dans l'app, pour une démarche administrative.
 */
#[Fillable(['service_request_item_id', 'client_profile_id', 'signature_id', 'document_id', 'signed_at'])]
class Mandate extends Model
{
    use Audited, HasUuids;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'signed_at' => 'datetime',
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
     * @return BelongsTo<ClientProfile, $this>
     */
    public function clientProfile(): BelongsTo
    {
        return $this->belongsTo(ClientProfile::class);
    }

    /**
     * @return BelongsTo<Attachment, $this>
     */
    public function signature(): BelongsTo
    {
        return $this->belongsTo(Attachment::class, 'signature_id');
    }

    /**
     * @return BelongsTo<Attachment, $this>
     */
    public function document(): BelongsTo
    {
        return $this->belongsTo(Attachment::class, 'document_id');
    }
}
