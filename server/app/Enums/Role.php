<?php

namespace App\Enums;

/**
 * Les cinq rôles (docs/CADRAGE.md § 3). Ce sont les noms des rôles spatie/laravel-permission.
 */
enum Role: string
{
    case Client = 'client';
    case Agent = 'agent';
    case Coordinator = 'coordinator';
    case Manager = 'manager';
    case Admin = 'admin';

    /**
     * Rôles qui utilisent l'app mobile.
     *
     * @return list<self>
     */
    public static function mobile(): array
    {
        return [self::Client, self::Agent, self::Coordinator];
    }

    /**
     * Rôles qui ont accès au back-office web.
     *
     * @return list<self>
     */
    public static function backOffice(): array
    {
        return [self::Coordinator, self::Manager, self::Admin];
    }

    public function label(): string
    {
        return match ($this) {
            self::Client => 'Client',
            self::Agent => 'Agent',
            self::Coordinator => 'Coordinateur',
            self::Manager => 'Manager',
            self::Admin => 'Admin',
        };
    }
}
