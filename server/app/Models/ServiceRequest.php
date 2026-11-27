<?php

namespace App\Models;

use App\Enums\ServiceRequestStatus;
use App\Models\Concerns\Audited;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

/**
 * Une demande du client (« Request » dans docs/SCHEMA-BDD.md), qui peut regrouper plusieurs services.
 * Un seul agent par demande, affecté par le coordinateur. Montants figés à l'acceptation.
 */
#[Fillable([
    'number', 'client_profile_id', 'beneficiary_id', 'assigned_agent_id', 'title', 'status',
    'on_hold', 'hold_reason', 'due_at', 'subtotal', 'fee_amount', 'total', 'deposit_amount',
    'balance_amount', 'submitted_at', 'closed_at',
])]
class ServiceRequest extends Model
{
    use Audited, HasUuids;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => ServiceRequestStatus::class,
            'on_hold' => 'boolean',
            'due_at' => 'datetime',
            'submitted_at' => 'datetime',
            'closed_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<ClientProfile, $this>
     */
    public function clientProfile(): BelongsTo
    {
        return $this->belongsTo(ClientProfile::class);
    }

    /**
     * @return BelongsTo<Beneficiary, $this>
     */
    public function beneficiary(): BelongsTo
    {
        return $this->belongsTo(Beneficiary::class);
    }

    /**
     * @return BelongsTo<Employee, $this>
     */
    public function assignedAgent(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'assigned_agent_id');
    }

    /**
     * @return HasMany<ServiceRequestItem, $this>
     */
    public function items(): HasMany
    {
        return $this->hasMany(ServiceRequestItem::class);
    }

    /**
     * @return HasMany<Assignment, $this>
     */
    public function assignments(): HasMany
    {
        return $this->hasMany(Assignment::class)->latest('assigned_at');
    }

    /**
     * @return HasMany<TimelineEvent, $this>
     */
    public function timeline(): HasMany
    {
        return $this->hasMany(TimelineEvent::class)->orderBy('occurred_at');
    }

    /**
     * @return HasMany<Message, $this>
     */
    public function messages(): HasMany
    {
        return $this->hasMany(Message::class)->orderBy('created_at');
    }

    /**
     * Notes du back-office, jamais envoyées à l'app client.
     *
     * @return HasMany<InternalNote, $this>
     */
    public function internalNotes(): HasMany
    {
        return $this->hasMany(InternalNote::class);
    }

    /**
     * @return HasMany<Payment, $this>
     */
    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    /**
     * @return HasOne<Review, $this>
     */
    public function review(): HasOne
    {
        return $this->hasOne(Review::class);
    }
}
