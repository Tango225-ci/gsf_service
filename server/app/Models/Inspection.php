<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;

/**
 * Visite de terrain, état des lieux ou remise de véhicule.
 * type : land_visit, check_in, check_out, vehicle_handover ou vehicle_return.
 */
#[Fillable([
    'service_request_item_id', 'agent_id', 'client_signature_id', 'report_pdf_id', 'type', 'gps_lat',
    'gps_lng', 'gps_accuracy_m', 'checklist', 'answers', 'mileage_km', 'fuel_level', 'observations',
])]
class Inspection extends Model
{
    use HasUuids;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'checklist' => 'array',
            'answers' => 'array',
            'gps_lat' => 'decimal:7',
            'gps_lng' => 'decimal:7',
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
     * @return BelongsTo<Employee, $this>
     */
    public function agent(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'agent_id');
    }

    /**
     * @return BelongsTo<Attachment, $this>
     */
    public function clientSignature(): BelongsTo
    {
        return $this->belongsTo(Attachment::class, 'client_signature_id');
    }

    /**
     * @return BelongsTo<Attachment, $this>
     */
    public function reportPdf(): BelongsTo
    {
        return $this->belongsTo(Attachment::class, 'report_pdf_id');
    }

    /**
     * Photos et vidéos prises pendant l'inspection.
     *
     * @return MorphMany<Attachment, $this>
     */
    public function attachments(): MorphMany
    {
        return $this->morphMany(Attachment::class, 'owner');
    }
}
