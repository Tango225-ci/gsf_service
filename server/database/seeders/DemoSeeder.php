<?php

namespace Database\Seeders;

use App\Enums\Role;
use App\Enums\ServiceRequestStatus;
use App\Models\ClientProfile;
use App\Models\Employee;
use App\Models\Partner;
use App\Models\Service;
use App\Models\ServiceCategory;
use App\Models\ServiceRequest;
use App\Models\User;
use App\Models\Zone;
use Illuminate\Database\Seeder;

/**
 * Données de démonstration, reprises des maquettes. Développement uniquement (APP_ENV=local).
 * Mot de passe de tous les comptes du personnel : gsf-demo (back-office sur /admin).
 */
class DemoSeeder extends Seeder
{
    public const PASSWORD = 'gsf-demo';

    public function run(): void
    {
        $sejour = ServiceCategory::query()->where('name', 'Séjour et mobilité')->value('id');
        $demarches = ServiceCategory::query()->where('name', 'Démarches administratives')->value('id');
        $foncier = ServiceCategory::query()->where('name', 'Foncier')->value('id');
        $zone = fn (string $nom): string => Zone::query()->where('name', $nom)->value('id');

        // Équipe GSF
        $this->employe('Admin', 'GSF', 'admin@gsf.test', Role::Admin, 'Administrateur');
        $this->employe('Koffi', 'N.', 'manager@gsf.test', Role::Manager, 'Manager');
        $coordinateur = $this->employe('Mariam', 'C.', 'coordinateur@gsf.test', Role::Coordinator, 'Coordinatrice');
        $yao = $this->employe('Yao', 'K.', 'yao@gsf.test', Role::Agent, 'Agent', [$sejour, $demarches], [$zone('Abidjan · Cocody'), $zone('Abidjan · Plateau')]);
        $this->employe('Awa', 'D.', 'awa.d@gsf.test', Role::Agent, 'Agent', [$sejour, $demarches], [$zone('Abidjan · Marcory'), $zone('Abidjan · Yopougon')]);
        $this->employe('Didier', 'K.', 'didier@gsf.test', Role::Agent, 'Géomètre', [$foncier], [$zone('Bingerville'), $zone('Grand-Bassam')]);
        $this->employe('Awa', 'S.', 'awa.s@gsf.test', Role::Agent, 'Géomètre', [$foncier], [$zone('Abidjan · Yopougon'), $zone('Anyama')]);

        // Clients
        $aicha = $this->client('Aïcha', 'Koné', 'aicha@client.test', 'France', 'Paris');
        $diallo = $this->client('Moussa', 'Diallo', 'diallo@client.test', 'France', 'Paris');
        $this->client('Mamadou', 'Traoré', 'traore@client.test', 'Canada', 'Montréal', 'CAD');

        $terrain = $diallo->assets()->create([
            'zone_id' => $zone('Bingerville'), 'type' => 'land', 'label' => 'Mon terrain de Bingerville',
            'lot_number' => '112', 'area_m2' => 500, 'title_type' => 'allocation_letter',
        ]);

        // Partenaires
        $bamba = Partner::query()->create(['type' => 'property_owner', 'name' => 'M. Bamba', 'phone' => '+225 07 00 00 00 01']);
        $bamba->properties()->create([
            'zone_id' => $zone('Abidjan · Cocody'), 'name' => 'Villa Riviera 3', 'bedrooms' => 3, 'capacity' => 6,
            'amenities' => ['Climatisation', 'Groupe électrogène', 'Gardien'],
            'partner_price_per_night' => 42000, 'client_price_per_night' => 55000,
        ]);
        $loueur = Partner::query()->create(['type' => 'vehicle_renter', 'name' => 'Abidjan Auto Location', 'phone' => '+225 07 00 00 00 02']);
        $loueur->vehicles()->create([
            'model' => 'Toyota RAV4', 'category' => 'SUV', 'seats' => 5, 'driver_available' => true,
            'partner_price_per_day' => 25000, 'client_price_per_day' => 35000, 'driver_price_per_day' => 15000,
        ]);

        // Demandes
        $sejourAbidjan = $this->demande('GSF-2026-0142', $aicha, 'Séjour à Abidjan', ServiceRequestStatus::Preparing, $yao, $coordinateur);
        foreach (['residence-meublee', 'location-vehicule', 'accueil-aeroport'] as $slug) {
            $sejourAbidjan->items()->create(['service_id' => Service::query()->where('slug', $slug)->value('id'), 'start_date' => '2026-12-18', 'end_date' => '2026-12-30']);
        }

        $acd = $this->demande('GSF-2026-0164', $diallo, 'Dossier ACD', ServiceRequestStatus::Submitted);
        $acd->items()->create(['service_id' => Service::query()->where('slug', 'dossier-acd')->value('id'), 'client_asset_id' => $terrain->id]);

        $accueil = $this->demande('GSF-2026-0163', $aicha, "Accueil à l'aéroport", ServiceRequestStatus::Submitted);
        $accueil->items()->create(['service_id' => Service::query()->where('slug', 'accueil-aeroport')->value('id'), 'answers' => ['vol' => 'AF702']]);
    }

    /**
     * @param  list<string>  $competences
     * @param  list<string>  $zones
     */
    private function employe(string $prenom, string $nom, string $email, Role $role, string $poste, array $competences = [], array $zones = []): Employee
    {
        $user = User::factory()->create([
            'first_name' => $prenom, 'last_name' => $nom, 'email' => $email, 'password' => self::PASSWORD,
        ]);
        $user->assignRole($role->value);
        $employe = $user->employee()->create(['job_title' => $poste]);
        $employe->skills()->sync($competences);
        $employe->zones()->sync($zones);

        return $employe;
    }

    private function client(string $prenom, string $nom, string $email, string $pays, string $ville, string $devise = 'EUR'): ClientProfile
    {
        $user = User::factory()->create(['first_name' => $prenom, 'last_name' => $nom, 'email' => $email, 'password' => null]);
        $user->assignRole(Role::Client->value);

        return $user->clientProfile()->create(['country_of_residence' => $pays, 'city' => $ville, 'display_currency' => $devise]);
    }

    private function demande(string $numero, ClientProfile $client, string $titre, ServiceRequestStatus $statut, ?Employee $agent = null, ?Employee $coordinateur = null): ServiceRequest
    {
        $demande = $client->serviceRequests()->create([
            'number' => $numero, 'title' => $titre, 'status' => $statut,
            'assigned_agent_id' => $agent?->id, 'submitted_at' => now(),
        ]);

        if ($agent && $coordinateur) {
            $demande->assignments()->create([
                'agent_id' => $agent->id, 'assigned_by_id' => $coordinateur->id, 'assigned_at' => now(),
                'note' => 'Client joignable sur WhatsApp, préfère les échanges le soir.',
            ]);
        }

        return $demande;
    }
}
