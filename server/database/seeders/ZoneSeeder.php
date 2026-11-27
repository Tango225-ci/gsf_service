<?php

namespace Database\Seeders;

use App\Models\Zone;
use Illuminate\Database\Seeder;

/**
 * Zones de départ : Abidjan et ses communes, puis les villes proches. GSF pourra en ajouter.
 */
class ZoneSeeder extends Seeder
{
    public function run(): void
    {
        $abidjan = Zone::query()->firstOrCreate(['name' => 'Abidjan'], ['region' => 'Abidjan']);

        foreach (['Cocody', 'Plateau', 'Marcory', 'Treichville', 'Yopougon', 'Abobo', 'Adjamé', 'Koumassi', 'Port-Bouët', 'Attécoubé'] as $commune) {
            Zone::query()->firstOrCreate(['name' => "Abidjan · {$commune}"], ['region' => 'Abidjan', 'parent_id' => $abidjan->id]);
        }

        foreach ([
            'Bingerville' => 'Abidjan',
            'Anyama' => 'Abidjan',
            'Grand-Bassam' => 'Sud-Comoé',
            'Assinie' => 'Sud-Comoé',
            'Jacqueville' => 'Grands-Ponts',
            'Yamoussoukro' => 'Yamoussoukro',
            'Bouaké' => 'Gbêkê',
            'San-Pédro' => 'San-Pédro',
        ] as $ville => $region) {
            Zone::query()->firstOrCreate(['name' => $ville], ['region' => $region]);
        }
    }
}
