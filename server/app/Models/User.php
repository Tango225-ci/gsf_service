<?php

namespace App\Models;

use App\Enums\Role;
use App\Models\Concerns\Audited;
use Database\Factories\UserFactory;
use Filament\Models\Contracts\FilamentUser;
use Filament\Models\Contracts\HasName;
use Filament\Panel;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

/**
 * Compte de connexion, quel que soit le rôle. Le rôle est porté par spatie/laravel-permission
 * (voir App\Enums\Role) ; les détails sont dans ClientProfile ou Employee.
 */
#[Fillable(['first_name', 'last_name', 'phone', 'email', 'password', 'locale', 'google_id', 'apple_id', 'two_factor_enabled', 'status'])]
#[Hidden(['password', 'remember_token', 'google_id', 'apple_id'])]
class User extends Authenticatable implements FilamentUser, HasName
{
    /** @use HasFactory<UserFactory> */
    use Audited, HasApiTokens, HasFactory, HasRoles, HasUuids, Notifiable, SoftDeletes;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_enabled' => 'boolean',
        ];
    }

    public function fullName(): string
    {
        return trim("{$this->first_name} {$this->last_name}");
    }

    /**
     * Le back-office est réservé au coordinateur, aux managers et aux admins.
     */
    public function canAccessPanel(Panel $panel): bool
    {
        return $this->status === 'active'
            && $this->hasAnyRole(array_map(fn (Role $role): string => $role->value, Role::backOffice()));
    }

    public function getFilamentName(): string
    {
        return $this->fullName();
    }

    /**
     * @return HasOne<ClientProfile, $this>
     */
    public function clientProfile(): HasOne
    {
        return $this->hasOne(ClientProfile::class);
    }

    /**
     * @return HasOne<Employee, $this>
     */
    public function employee(): HasOne
    {
        return $this->hasOne(Employee::class);
    }

    /**
     * @return HasMany<Device, $this>
     */
    public function devices(): HasMany
    {
        return $this->hasMany(Device::class);
    }
}
