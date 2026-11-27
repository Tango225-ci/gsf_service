# Serveur GSF Service

**Laravel 13** · PHP 8.3 · PostgreSQL 14. Une seule application fait tout côté serveur :
- l'**API** de l'app mobile (`/api`, jetons Sanctum) ;
- le **back-office** Filament (`/admin`), pour le coordinateur, les managers et les admins ;
- plus tard, le **site vitrine** (Blade).

Heure de référence : **GMT (UTC)**. Montants en **FCFA entiers**.

## Démarrer sur le PC

1. La base `gsfservice` existe déjà (voir [../database/LISEZMOI.md](../database/LISEZMOI.md)).
2. Dans ce dossier `server` :
   ```powershell
   ..\outils\composer\composer.bat install     # la première fois
   Copy-Item .env.example .env                  # la première fois, puis remplir DB_PASSWORD
   php artisan key:generate                     # la première fois
   php artisan migrate:fresh --seed             # crée les tables et charge les données (efface tout !)
   php artisan serve --host=0.0.0.0 --port=8000
   ```
3. Vérifier : http://localhost:8000/up répond, et http://localhost:8000/admin affiche la connexion du back-office.

`--host=0.0.0.0` permet au téléphone (Expo Go, même Wi-Fi) de joindre l'API.

Composer est celui du projet : `..\outils\composer\composer.bat`, pas un `composer` installé ailleurs.

## Comptes de démonstration (développement uniquement)

Créés par `DemoSeeder`, seulement quand `APP_ENV=local`. Mot de passe de tous les comptes du personnel : **`gsf-demo`**.

| Compte | Rôle | Back-office |
|---|---|---|
| `admin@gsf.test` | Admin | Oui |
| `manager@gsf.test` | Manager | Oui |
| `coordinateur@gsf.test` | Coordinateur (Mariam C.) | Oui |
| `yao@gsf.test`, `awa.d@gsf.test` | Agents (séjour, démarches) | Non |
| `didier@gsf.test`, `awa.s@gsf.test` | Agents géomètres du cabinet (foncier) | Non |

Clients : Aïcha Koné (Paris), Moussa Diallo (Paris, avec un terrain à Bingerville), Mamadou Traoré (Montréal). Trois demandes : un séjour en préparation affecté à Yao, un dossier ACD et un accueil à l'aéroport à affecter.

## Commandes

| Commande | Rôle |
|---|---|
| `php artisan serve --host=0.0.0.0` | Démarre le serveur sur le port 8000 |
| `php artisan test --compact` | Lance les tests (base SQLite en mémoire, rien à préparer) |
| `vendor\bin\pint --dirty` | Met le code PHP au format du projet |
| `php artisan migrate:fresh --seed` | Recrée la base avec les données de départ (efface tout !) |

## Organisation

| Élément | Contenu |
|---|---|
| `database/migrations/` | Toutes les tables de [../docs/SCHEMA-BDD.md](../docs/SCHEMA-BDD.md), avec des identifiants UUID |
| `database/seeders/` | Rôles, paramètres, zones, catalogue (montants d'exemple), démonstration |
| `app/Models/` | Un modèle par table. `Concerns/Audited.php` : journal automatique des actions |
| `app/Enums/` | Rôles, statuts d'une demande, modes et unités de tarification |
| `app/Support/EncryptedFiles.php` | Stockage chiffré des documents sensibles |
| `app/Providers/Filament/AdminPanelProvider.php` | Configuration du back-office |

## Règles à respecter

- **Champs jamais envoyés à l'app client** : coût interne, prix partenaire, coût partenaire, coordonnées de paiement et notes des partenaires, notes internes. Ils sont déclarés « cachés » dans les modèles. Le journal des actions les remplace par « [masqué] ».
- **Journal des actions** : les modèles sensibles utilisent le trait `Audited`. Chaque création, modification et suppression est enregistrée dans `audit_logs`, avec son auteur.
- **Documents sensibles** (pièces d'identité, documents fonciers, procurations) : toujours écrits avec `EncryptedFiles`.
- **Frais de service GSF : jamais en pourcentage.**

## Particularités de ce PC (Windows)

- **Horizon** n'est pas installé, car il ne fonctionne pas sous Windows. Les tâches de fond utilisent la base de données (`QUEUE_CONNECTION=database`).
- **Redis** et **Sentry** seront branchés au déploiement.
