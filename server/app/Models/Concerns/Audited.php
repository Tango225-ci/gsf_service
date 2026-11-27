<?php

namespace App\Models\Concerns;

use App\Models\AuditLog;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;

/**
 * Enregistre chaque création, modification et suppression du modèle dans audit_logs.
 * Les champs cachés du modèle (prix partenaires, mots de passe…) sont remplacés par « [masqué] ».
 */
trait Audited
{
    public static function bootAudited(): void
    {
        static::created(fn (Model $model) => $model->writeAuditLog('created', null, $model->auditableValues($model->getAttributes())));

        static::updated(function (Model $model): void {
            $changes = $model->getChanges();
            unset($changes['updated_at']);
            if ($changes === []) {
                return;
            }
            $before = array_intersect_key($model->getOriginal(), $changes);
            $model->writeAuditLog('updated', $model->auditableValues($before), $model->auditableValues($changes));
        });

        static::deleted(fn (Model $model) => $model->writeAuditLog('deleted', $model->auditableValues($model->getOriginal()), null));
    }

    /**
     * @param  array<string, mixed>  $values
     * @return array<string, mixed>
     */
    protected function auditableValues(array $values): array
    {
        foreach ($this->getHidden() as $hidden) {
            if (array_key_exists($hidden, $values)) {
                $values[$hidden] = '[masqué]';
            }
        }

        return $values;
    }

    /**
     * @param  array<string, mixed>|null  $before
     * @param  array<string, mixed>|null  $after
     */
    protected function writeAuditLog(string $action, ?array $before, ?array $after): void
    {
        AuditLog::query()->create([
            'actor_id' => Auth::id(),
            'action' => $action,
            'auditable_type' => $this->getMorphClass(),
            'auditable_id' => $this->getKey(),
            'before' => $before,
            'after' => $after,
            'ip_address' => app()->runningInConsole() ? null : Request::ip(),
        ]);
    }
}
