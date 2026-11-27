<?php

namespace Database\Seeders;

use App\Enums\PricingMode;
use App\Enums\PricingUnit;
use App\Models\Service;
use App\Models\ServiceCategory;
use App\Models\Zone;
use Illuminate\Database\Seeder;

/**
 * Catalogue de départ (docs/CADRAGE.md § 4). Les montants sont des EXEMPLES tirés des maquettes :
 * GSF saisira ses vrais tarifs dans le back-office. Frais de service GSF : montant fixe pour les
 * services sans proposition, jamais de pourcentage.
 */
class CatalogSeeder extends Seeder
{
    public function run(): void
    {
        $categories = [];
        foreach (['Séjour et mobilité', 'Démarches administratives', 'Foncier', 'Autre demande'] as $ordre => $nom) {
            $categories[$nom] = ServiceCategory::query()->firstOrCreate(['name' => $nom], ['sort_order' => $ordre]);
        }

        foreach ($this->services() as $ordre => $donnees) {
            $service = Service::query()->updateOrCreate(['slug' => $donnees['slug']], [
                'service_category_id' => $categories[$donnees['categorie']]->id,
                'name' => $donnees['nom'],
                'description' => $donnees['description'],
                'included' => $donnees['inclus'] ?? null,
                'pricing_mode' => $donnees['mode'],
                'unit' => $donnees['unite'] ?? null,
                'display_price' => $donnees['des'] ?? null,
                'fixed_service_fee' => $donnees['frais_gsf'] ?? null,
                'requires_asset' => $donnees['categorie'] === 'Foncier',
                'requires_mandate' => $donnees['categorie'] === 'Démarches administratives',
                'published' => true,
                'sort_order' => $ordre,
            ]);

            if ($service->wasRecentlyCreated) {
                $this->ajouterDetails($service, $donnees);
            }
        }
    }

    /**
     * @param  array<string, mixed>  $donnees
     */
    private function ajouterDetails(Service $service, array $donnees): void
    {
        foreach ($donnees['champs'] ?? [] as $ordre => [$cle, $libelle, $type, $requis, $options]) {
            $service->fields()->create([
                'key' => $cle, 'label' => $libelle, 'type' => $type, 'required' => $requis,
                'options' => $options, 'sort_order' => $ordre,
            ]);
        }

        foreach ($donnees['etapes'] ?? [] as $ordre => $etape) {
            $service->steps()->create(['name' => $etape, 'sort_order' => $ordre]);
        }

        foreach ($donnees['formules'] ?? [] as [$libelle, $capacite, $prix, $cout, $zone]) {
            $service->priceRules()->create([
                'label' => $libelle, 'capacity' => $capacite, 'client_price' => $prix, 'internal_cost' => $cout,
                'zone_id' => $zone ? Zone::query()->where('name', $zone)->value('id') : null,
            ]);
        }

        foreach ($donnees['options'] ?? [] as [$libelle, $type, $montant]) {
            $service->options()->create(['label' => $libelle, 'kind' => $type, 'amount' => $montant]);
        }

        foreach ($donnees['frais_officiels'] ?? [] as [$libelle, $montant]) {
            $service->officialFees()->create(['label' => $libelle, 'amount' => $montant]);
        }
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function services(): array
    {
        $datesSejour = ['dates', 'Dates', 'date_range', true, null];
        $etapesDemarche = ['Dépôt de la demande', 'En traitement', 'Retrait du document', 'Remise au client'];

        return [
            [
                'slug' => 'residence-meublee', 'categorie' => 'Séjour et mobilité', 'nom' => 'Résidence meublée',
                'description' => 'GSF trouve la résidence qui correspond à vos critères dans son réseau de partenaires.',
                'mode' => PricingMode::From, 'unite' => PricingUnit::Night, 'des' => 35000,
                'champs' => [
                    $datesSejour,
                    ['lieu', 'Lieu souhaité', 'text', true, null],
                    ['voyageurs', 'Voyageurs', 'text', true, null],
                    ['chambres', 'Chambres', 'select', false, ['1', '2', '3', '4 et plus']],
                    ['equipements', 'Équipements souhaités', 'multi_select', false, ['Climatisation', 'Groupe électrogène', 'Piscine', 'Gardien']],
                    ['budget', 'Budget par nuit', 'text', false, null],
                ],
                'etapes' => ['Ménage et état des lieux', 'Remise des clés', 'Séjour', 'État des lieux de sortie'],
            ],
            [
                'slug' => 'location-vehicule', 'categorie' => 'Séjour et mobilité', 'nom' => 'Location de véhicule',
                'description' => 'Avec ou sans chauffeur, remis où vous le souhaitez.',
                'mode' => PricingMode::From, 'unite' => PricingUnit::Day, 'des' => 25000,
                'champs' => [
                    $datesSejour,
                    ['chauffeur', 'Avec chauffeur', 'select', true, ['Oui', 'Non']],
                    ['remise', 'Lieu de remise', 'text', true, null],
                    ['categorie', 'Type de véhicule', 'select', false, ['Berline', 'SUV', 'Minibus']],
                ],
                'etapes' => ['Préparation du véhicule', 'Remise du véhicule', 'Location en cours', 'Retour du véhicule'],
            ],
            [
                'slug' => 'accueil-aeroport', 'categorie' => 'Séjour et mobilité', 'nom' => "Accueil à l'aéroport",
                'description' => "Un agent GSF vous attend à la sortie de l'aéroport Félix-Houphouët-Boigny avec une pancarte à votre nom, puis vous conduit à votre logement.",
                'inclus' => "Suivi du vol, pancarte nominative, 1 h d'attente incluse",
                'mode' => PricingMode::Fixed, 'des' => 25000, 'frais_gsf' => 5000,
                'champs' => [
                    ['vol', 'Numéro de vol', 'flight', true, null],
                    ['arrivee', "Date et heure d'arrivée", 'date', true, null],
                    ['passagers', 'Passagers', 'number', true, null],
                    ['destination', 'Adresse de destination', 'text', true, null],
                ],
                'etapes' => ['Suivi du vol', "Accueil à l'aéroport", 'Dépôt au logement'],
                'formules' => [
                    ['Berline', '1 à 3 pers.', 25000, 15000, null],
                    ['SUV', '1 à 4 pers.', 35000, 22000, null],
                    ['Minibus', '5 à 8 pers.', 50000, 32000, null],
                ],
                'options' => [
                    ['Arrivée entre 22 h et 6 h', 'supplement', 10000],
                    ['Puce téléphonique chargée', 'checkbox', 5000],
                    ['Destination hors Abidjan', 'switch_to_quote', null],
                ],
            ],
            [
                'slug' => 'extrait-acte-naissance', 'categorie' => 'Démarches administratives', 'nom' => "Extrait d'acte de naissance",
                'description' => "GSF retire votre extrait d'acte de naissance à la mairie, avec votre procuration signée dans l'app.",
                'mode' => PricingMode::Fixed, 'des' => 10000, 'frais_gsf' => 5000,
                'champs' => [
                    ['commune', 'Commune', 'zone', true, null],
                    ['nom_acte', "Nom sur l'acte", 'text', true, null],
                    ['piece_identite', "Pièce d'identité", 'file', true, null],
                    ['reception', 'Réception du document', 'select', true, ['Remise à un proche à Abidjan', "Envoi par coursier à l'étranger"]],
                ],
                'etapes' => $etapesDemarche,
                'frais_officiels' => [['Timbre', 500]],
            ],
            [
                'slug' => 'casier-judiciaire', 'categorie' => 'Démarches administratives', 'nom' => 'Casier judiciaire',
                'description' => 'GSF demande et retire votre extrait de casier judiciaire.',
                'mode' => PricingMode::Fixed, 'des' => 10000, 'frais_gsf' => 5000,
                'champs' => [
                    ['lieu_naissance', 'Lieu de naissance', 'text', true, null],
                    ['piece_identite', "Pièce d'identité", 'file', true, null],
                ],
                'etapes' => $etapesDemarche,
                'frais_officiels' => [['Timbre', 1000]],
            ],
            [
                'slug' => 'certificat-nationalite', 'categorie' => 'Démarches administratives', 'nom' => 'Certificat de nationalité',
                'description' => 'GSF constitue le dossier et retire votre certificat de nationalité.',
                'mode' => PricingMode::Fixed, 'des' => 15000, 'frais_gsf' => 5000,
                'champs' => [
                    ['piece_identite', "Pièce d'identité", 'file', true, null],
                    ['acte_naissance', 'Extrait de naissance', 'file', true, null],
                ],
                'etapes' => $etapesDemarche,
                'frais_officiels' => [['Timbre', 1500]],
            ],
            [
                'slug' => 'legalisation-documents', 'categorie' => 'Démarches administratives', 'nom' => 'Légalisation de documents',
                'description' => 'GSF fait légaliser vos documents.',
                'mode' => PricingMode::Fixed, 'des' => 10000, 'frais_gsf' => 5000,
                'champs' => [
                    ['documents', 'Documents à légaliser', 'file', true, null],
                    ['nombre', 'Nombre de documents', 'number', true, null],
                ],
                'etapes' => $etapesDemarche,
            ],
            [
                'slug' => 'visite-terrain', 'categorie' => 'Foncier', 'nom' => 'Visite de terrain',
                'description' => 'Un géomètre du cabinet GSF visite votre terrain : photos, vidéo, position GPS et rapport.',
                'mode' => PricingMode::Fixed, 'des' => 30000, 'frais_gsf' => 5000,
                'champs' => [['terrain', 'Terrain', 'asset', true, null]],
                'etapes' => ['Visite planifiée', 'Visite effectuée', 'Rapport envoyé'],
                'formules' => [
                    ['Abidjan', null, 30000, 15000, 'Abidjan'],
                    ['Bingerville', null, 35000, 18000, 'Bingerville'],
                    ['Grand-Bassam', null, 40000, 20000, 'Grand-Bassam'],
                ],
            ],
            [
                'slug' => 'verification-fonciere', 'categorie' => 'Foncier', 'nom' => 'Vérification foncière',
                'description' => 'Authenticité des documents et situation du terrain.',
                'mode' => PricingMode::Fixed, 'des' => 75000, 'frais_gsf' => 10000,
                'champs' => [['terrain', 'Terrain', 'asset', true, null]],
                'etapes' => ['Analyse des documents', 'Vérification auprès des services', 'Rapport envoyé'],
            ],
            [
                'slug' => 'dossier-acd', 'categorie' => 'Foncier', 'nom' => 'Dossier ACD',
                'description' => "Le cabinet de géomètres de GSF constitue votre dossier de demande d'ACD, le dépose au ministère et en assure le suivi.",
                'mode' => PricingMode::Quote,
                'champs' => [['terrain', 'Terrain', 'asset', true, null]],
                'etapes' => ['Collecte des pièces', 'Constitution du dossier', 'Dépôt de la demande au ministère', "Suivi de l'instruction", "Signature de l'ACD", 'Retrait et remise au client'],
            ],
            [
                'slug' => 'bornage-plan-topo', 'categorie' => 'Foncier', 'nom' => 'Bornage et plan topographique',
                'description' => 'Par le cabinet de géomètres de GSF.',
                'mode' => PricingMode::Quote,
                'champs' => [['terrain', 'Terrain', 'asset', true, null]],
                'etapes' => ['Rendez-vous sur le terrain', 'Bornage', 'Plan topographique', 'Remise au client'],
            ],
            [
                'slug' => 'entretien-gardiennage', 'categorie' => 'Foncier', 'nom' => 'Entretien et gardiennage',
                'description' => 'Débroussaillage et gardiennage de votre terrain.',
                'mode' => PricingMode::PerUnit, 'unite' => PricingUnit::Month, 'des' => 25000, 'frais_gsf' => 5000,
                'champs' => [['terrain', 'Terrain', 'asset', true, null], ['mois', 'Nombre de mois', 'number', true, null]],
                'etapes' => ['Mise en place', 'Entretien en cours'],
            ],
            [
                'slug' => 'suivi-construction', 'categorie' => 'Foncier', 'nom' => 'Suivi de construction',
                'description' => 'Photos et vidéo de votre chantier chaque semaine.',
                'mode' => PricingMode::PerUnit, 'unite' => PricingUnit::Month, 'des' => 40000, 'frais_gsf' => 5000,
                'champs' => [['terrain', 'Terrain', 'asset', true, null], ['mois', 'Nombre de mois', 'number', true, null]],
                'etapes' => ['Première visite', 'Suivi en cours'],
            ],
            [
                'slug' => 'impot-foncier', 'categorie' => 'Foncier', 'nom' => "Paiement de l'impôt foncier",
                'description' => "GSF règle l'impôt foncier de votre terrain. Le montant de l'impôt s'ajoute aux frais.",
                'mode' => PricingMode::Fixed, 'des' => 15000, 'frais_gsf' => 5000,
                'champs' => [['terrain', 'Terrain', 'asset', true, null], ['avis', "Avis d'imposition", 'file', false, null]],
                'etapes' => ['Paiement auprès des impôts', 'Quittance remise au client'],
            ],
            [
                'slug' => 'autre-demande', 'categorie' => 'Autre demande', 'nom' => 'Autre demande',
                'description' => 'Décrivez votre besoin : GSF vous envoie un devis.',
                'mode' => PricingMode::Quote,
                'champs' => [['description', 'Votre besoin', 'text', true, null]],
            ],
        ];
    }
}
