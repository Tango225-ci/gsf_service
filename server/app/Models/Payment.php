<?php

namespace App\Models;

use App\Models\Concerns\Audited;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Un paiement : deposit (acompte), balance (solde), full (prix fixe, en totalité) ou refund.
 * L'encaissement (lot 5 du MVP) est mis de côté : ce modèle n'a pas encore de logique.
 */
#[Fillable([
    'service_request_id', 'collected_by_id', 'receipt_id', 'type', 'amount', 'fee_included', 'method',
    'channel', 'provider', 'provider_ref', 'status', 'exchange_rate_eur', 'paid_at',
])]
class Payment extends Model
{
    use Audited, HasUuids;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'exchange_rate_eur' => 'decimal:4',
            'paid_at' => 'datetime',
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
     * @return BelongsTo<Employee, $this>
     */
    public function collectedBy(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'collected_by_id');
    }

    /**
     * @return BelongsTo<Attachment, $this>
     */
    public function receipt(): BelongsTo
    {
        return $this->belongsTo(Attachment::class, 'receipt_id');
    }
}
