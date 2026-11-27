# GSF Service

Plateforme de conciergerie en Côte d'Ivoire, pour la diaspora et les résidents : résidences meublées, location de véhicules, accueil à l'aéroport, démarches administratives et foncier (visite de terrain, ACD, bornage…).

**Phase actuelle : développement du MVP. Lot 0 (fondations) terminé le 27/11/2026.** On ne démarre un lot qu'avec la validation explicite de l'utilisateur.

## Code
- `server/` : Laravel 13. Lire [server/CLAUDE.md](server/CLAUDE.md) (consignes Laravel Boost) et [server/LISEZMOI.md](server/LISEZMOI.md) avant d'y toucher. Tests : `php artisan test --compact` ; format : `vendor\bin\pint --dirty`.
- `mobile/` : Expo SDK 58. Lire [mobile/AGENTS.md](mobile/AGENTS.md) et [mobile/LISEZMOI.md](mobile/LISEZMOI.md). Contrôles : `npm run typecheck`, `npm run lint`.
- `database/` : création de la base et de son compte.
- Git : un seul dépôt à la racine. Ne jamais committer sans demande de l'utilisateur.

## Documents
- [docs/CADRAGE.md](docs/CADRAGE.md) : toutes les décisions. Lis-le avant toute proposition et tiens-le à jour (tableau « Historique des décisions »).
- [docs/SCHEMA-BDD.md](docs/SCHEMA-BDD.md) : schéma de la base de données, champ par champ.
- [docs/MVP.md](docs/MVP.md) : découpage du MVP en lots et tâches, avec les points reportés et les décisions restantes.
- [docs/gsf-maquettes.html](docs/gsf-maquettes.html) : maquettes et architecture, publiées à https://claude.ai/artifact/KriCzstC3PomsTeaHYwzZV. Pour la mettre à jour, publie ce fichier en passant cette URL. Pense à monter le numéro de version affiché dans la page.
- Une modification de fond se reporte dans **tous** les documents concernés (cadrage, schéma, maquettes), pas dans un seul.

## Repères à ne pas perdre
- **Identité GSF : rouge, blanc et noir.** Logo « GSF · Géomètre Son Femme » (`mobile/assets/images/logo-gsf.png`). Rouge du logo #F42409 ; textes et boutons en #D91F07 (lisible sur blanc). Couleurs de l'app dans `mobile/src/lib/theme.ts`.
- Stack : **tout le serveur en Laravel** (API pour l'app, back-office Filament, site vitrine Blade), PostgreSQL. App mobile **React Native (Expo)**, une seule app pour les rôles Client, Agent et Coordinateur.
- Un **coordinateur** reçoit toutes les demandes et les affecte, avec **un seul agent par demande**.
- Le foncier est géré par le **cabinet de géomètres de GSF** (ses géomètres sont des agents). Pas de partenaire externe pour le foncier. Les partenaires sont seulement les propriétaires de résidences et les loueurs de véhicules.
- **Frais de service GSF : jamais en pourcentage.** L'agent les fixe dans la proposition selon le volume de la prestation. Montant fixe, réglé dans le back-office, pour les services à prix fixe.
- Services à prix fixe : payés **en totalité à la commande**. Tous les autres, y compris le prix à l'unité : acompte (30 % par défaut) puis solde.

## Environnement
- L'utilisateur échange en français.
- Le disque C: est presque plein (5,8 Go libres le 26/11/2026). **Tout ce qu'il faut installer pour le projet va dans le dossier du projet sur D:** (`d:\Projets\gsfservice`), ainsi que les fichiers de travail.
- Node.js (v24) est déjà installé : ne pas le réinstaller. **L'app se lance avec Expo** (Expo Go, navigateur), pas avec Android Studio.
- **Composer** est dans le projet : `outils\composer\composer.bat` (à utiliser à la place de `composer`). Il tourne avec le PHP 8.3 de WAMP (`C:\wamp64\bin\php\php8.3.28`). Les fichiers `.bat` doivent rester en ASCII, sans accents, sinon cmd les lit mal.
- **PostgreSQL 14** est installé (service `postgresql-x64-14`, port 5432, `C:\Program Files\PostgreSQL\14\bin\psql.exe`). Base `gsfservice`, compte `gsf_api`, créés par [database/00_creer_base.sql](database/00_creer_base.sql). La base a été créée par Claude le 27/11/2026. Le mot de passe de `gsf_api` n'est écrit que dans `server/.env` (jamais dans un fichier suivi par git ni dans la documentation).
- **Modèle à suivre : `D:\Projets\taskApp`** (découpage `server/` + `mobile/`, un `LISEZMOI.md` par dossier, app Expo avec `src/app`, `src/lib`, `src/components`, noms en français, script `npm run telephone` sur le port 8082 car le 8081 est pris par McAfee).
- L'encaissement et le paiement (lot 5 du MVP) sont mis de côté : ne pas les traiter sans que l'utilisateur le demande.
- Python n'est pas installé sur la machine. Utilise PowerShell ou les outils Bash (sed, grep) pour les manipulations de fichiers.
