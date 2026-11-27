<?php

namespace App\Models;

use App\Enums\ServiceRequestStatus;
use App\Models\Concerns\Audited;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Un membre de GSF. Son rôle (agent, coordinateur, manager, admin) est porté par son compte User.
 * Un géomètre du cabinet GSF est un agent : job_title « Géomètre », compétence Foncier.
 */
#[Fillable(['user_id', 'job_title', 'active'])]
class Employee extends Model
{
    use Audited, HasUuids;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'active' => 'boolean',
        ];
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Compétences, pour les suggestions d'affectation.
     *
     * @return BelongsToMany<ServiceCategory, $this>
     */
    public function skills(): BelongsToMany
    {
        return $this->belongsToMany(ServiceCategory::class);
    }

    /**
     * @return BelongsToMany<Zone, $this>
     */
    public function zones(): BelongsToMany
    {
        return $this->belongsToMany(Zone::class);
    }

    /**
     * @return HasMany<ServiceRequest, $this>
     */
    public function assignedRequests(): HasMany
    {
        return $this->hasMany(ServiceRequest::class, 'assigned_agent_id');
    }

    /**
     * Charge de l'agent : nombre de demandes ouvertes qui lui sont affectées (calculée, jamais stockée).
     */
    public function openRequestsCount(): int
    {
        return $this->assignedRequests()
            ->whereNotIn('status', [
                ServiceRequestStatus::Completed,
                ServiceRequestStatus::Closed,
                ServiceRequestStatus::Cancelled,
                ServiceRequestStatus::Refunded,
            ])
            ->count();
    }
}
