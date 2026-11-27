<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

/**
 * Paramètres globaux. Pas de frais GSF par défaut : ils ne sont jamais en pourcentage.
 */
class SettingSeeder extends Seeder
{
    public function run(): void
    {
        Setting::put('default_deposit_percent', 30);
        // 1 EUR = 655,957 FCFA (parité fixe). USD et CAD : valeurs indicatives, à tenir à jour dans le back-office.
        Setting::put('exchange_rates', ['EUR' => 655.957, 'USD' => 600, 'CAD' => 440]);
    }
}
