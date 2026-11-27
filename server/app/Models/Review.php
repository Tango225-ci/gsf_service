<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Avis du client à la clôture d'une demande (note de 1 à 5).
 */
#[Fillable(['service_request_id', 'client_profile_id', 'agent_id', 'rating', 'comment'])]
class Review extends Model
{
    use HasUuids;

    /**
     * @return BelongsTo<ServiceRequest, $this>
     */
    public function serviceRequest(): BelongsTo
    {
        return $this->belongsTo(ServiceRequest::class);
    }

    /**
     * @return BelongsTo<ClientProfile, $this>
     */
    public function clientProfile(): BelongsTo
    {
        return $this->belongsTo(ClientProfile::class);
    }

    /**
     * @return BelongsTo<Employee, $this>
     */
    public function agent(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'agent_id');
    }
}
