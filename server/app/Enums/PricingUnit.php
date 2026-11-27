<?php

namespace App\Enums;

enum PricingUnit: string
{
    case Night = 'night';
    case Day = 'day';
    case Hour = 'hour';
    case Month = 'month';

    public function label(): string
    {
        return match ($this) {
            self::Night => 'nuit',
            self::Day => 'jour',
            self::Hour => 'heure',
            self::Month => 'mois',
        };
    }
}
