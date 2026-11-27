# GSF Service — Découpage du MVP

> Version 0.1 · 26 novembre 2026 · Statut : **proposition à valider**
> Références : [CADRAGE.md](CADRAGE.md) · [SCHEMA-BDD.md](SCHEMA-BDD.md) · maquettes https://claude.ai/artifact/KriCzstC3PomsTeaHYwzZV

## Objectif du MVP

Un client (diaspora ou résident) peut **commander n'importe quel service du catalogue**, **payer**, **suivre sa demande** et **échanger avec son agent**. GSF peut **affecter, traiter et encaisser** de bout en bout, sans outil externe à côté.

Le catalogue est **configurable dans le back-office**. Tous les services du cadrage peuvent donc être ouverts au lancement, sans développement par service. Ce qui est reporté plus bas concerne des **fonctions**, pas des services.

Taille des tâches : **S** (moins de 2 jours) · **M** (2 à 5 jours) · **L** (plus d'une semaine). La durée réelle dépendra de la taille de l'équipe, qui reste à définir.

---

## Les lots, dans l'ordre de développement

### Lot 0 — Fondations · **terminé le 27/11/2026**

> Fait : dépôt git unique (aucun commit), Laravel 13 + Filament 5 + Sanctum + laravel-permission, base PostgreSQL `gsfservice` avec toutes les tables, données de référence et de démonstration, rôles et accès au back-office, journal des actions, chiffrement, app Expo SDK 58 sur le modèle de taskApp, 18 tests serveur qui passent.
> Reporté au déploiement (9.5) : Redis et Sentry. Horizon n'est pas utilisé (ne fonctionne pas sous Windows).

| # | Tâche | Taille |
|---|---|---|
| 0.1 | Créer le dépôt sur le modèle de taskApp : `server/` (Laravel), `mobile/` (Expo), un `LISEZMOI.md` par dossier | S |
| 0.2 | Laravel avec PostgreSQL, Redis, Horizon, stockage Cloudflare R2 | M |
| 0.3 | Migrations de toutes les tables de [SCHEMA-BDD.md](SCHEMA-BDD.md), données de démonstration | L |
| 0.4 | Rôles et droits (Client, Agent, Coordinateur, Manager, Admin) | M |
| 0.5 | Environnement de développement sur le PC (PostgreSQL 14 déjà installé : base `gsfservice` créée par Claude au démarrage du lot, avec `database/00_creer_base.sql`, Redis, fichiers locaux), Sentry | M |
| 0.6 | App Expo, reprise de la base de taskApp : navigation (Expo Router), session, appels à l'API, stockage sécurisé, thème des maquettes, script `npm run telephone`, interface selon le rôle | M |
| 0.7 | Journal des actions (AuditLog) et chiffrement des documents sensibles | M |

### Lot 1 — Comptes et connexion
| # | Tâche | Taille |
|---|---|---|
| 1.1 | Inscription et connexion par code SMS ou email (Sanctum) | M |
| 1.2 | Profil client, proches sur place, devise affichée | S |
| 1.3 | Comptes du personnel créés par l'admin, double authentification | M |
| 1.4 | Suppression du compte depuis l'app (exigence des stores) | S |

### Lot 2 — Back-office : catalogue et référentiels
| # | Tâche | Taille |
|---|---|---|
| 2.1 | Filament : accès par rôle, tableau de bord simple | M |
| 2.2 | Services : catégories, présentation, mode de tarification, acompte, frais GSF fixes | M |
| 2.3 | Constructeur de formulaire par service (ServiceField) | L |
| 2.4 | Étapes de suivi par service, avec délai cible | S |
| 2.5 | Formules, options, frais officiels, zones, haute saison | M |
| 2.6 | Partenaires, résidences et véhicules (prix partenaire caché, photos) | M |
| 2.7 | Employés : rôle, compétences, zones | S |

### Lot 3 — App client : commander
| # | Tâche | Taille |
|---|---|---|
| 3.1 | Accueil : demandes en cours et catalogue avec prix indicatifs | M |
| 3.2 | Fiche service : grille de prix, options, ce qui est inclus | S |
| 3.3 | Formulaire de demande dynamique, plusieurs services dans une demande, estimation en direct | L |
| 3.4 | « Mes biens » : enregistrer un terrain et ses documents | M |
| 3.5 | Pièces à fournir et procuration signée dans l'app | M |

### Lot 4 — Affectation et traitement
| # | Tâche | Taille |
|---|---|---|
| 4.1 | Coordinateur, back-office et app : demandes à affecter, agents suggérés, note, réaffectation | M |
| 4.2 | Agent : liste des tâches triée par urgence | M |
| 4.3 | Agent : créer une proposition ou un devis (bien, frais GSF selon le volume, acompte, expiration) | M |
| 4.4 | Client : comparer et accepter une proposition, demander d'autres options | M |
| 4.5 | Calcul des montants : acompte, prix fixe en totalité, frais GSF, solde, montants figés à l'acceptation | M |
| 4.6 | Expiration automatique des propositions, alertes de retard | S |

### Lot 5 — Paiement
| # | Tâche | Taille |
|---|---|---|
| 5.1 | Module de paiement indépendant, avec un mode **« encaissement manuel »** : l'agent ou le back-office enregistre un paiement reçu (espèces, Mobile Money, virement) | M |
| 5.2 | Encaissement du solde sur place par l'agent, signature du client | S |
| 5.3 | Reçus PDF, envoyés dans l'app et par email | M |
| 5.4 | Branchement du prestataire de paiement en ligne (carte et Mobile Money) | L · **bloqué** tant que le prestataire n'est pas choisi |

> **Lot 5 mis de côté** le 26/11/2026 : l'encaissement sera traité plus tard. Les autres lots se développent sans lui.

### Lot 6 — Suivi et échanges
| # | Tâche | Taille |
|---|---|---|
| 6.1 | Agent : mise à jour d'étape avec photos et commentaire, visible ou non par le client | M |
| 6.2 | Envoi des photos et mises à jour hors réseau, parties au retour de la connexion | L |
| 6.3 | Client : fil de suivi daté avec preuves | M |
| 6.4 | Messagerie par demande, en temps réel (Reverb), avec photos | L |
| 6.5 | Notifications push (Expo) et email (Resend) | M |
| 6.6 | Back-office : fiche demande complète avec notes internes | M |

### Lot 7 — Terrain
| # | Tâche | Taille |
|---|---|---|
| 7.1 | Visite de terrain : GPS, contrôles guidés, photos et vidéo, questions | L |
| 7.2 | Rapport de visite généré en PDF, rattaché au terrain du client | M |
| 7.3 | État des lieux résidence, remise et retour de véhicule (photos, kilométrage, carburant) | M |

### Lot 8 — Clôture et finances
| # | Tâche | Taille |
|---|---|---|
| 8.1 | Clôture de la demande et avis du client | S |
| 8.2 | Back-office finances : encaissements, frais GSF, marges | M |
| 8.3 | Reversements aux partenaires, enregistrés à la main | M |

### Lot 9 — Lancement
| # | Tâche | Taille |
|---|---|---|
| 9.1 | Site vitrine Laravel (Blade) : présentation, services, liens vers les stores | M |
| 9.2 | Politique de confidentialité, CGU, déclaration à l'ARTCI | M |
| 9.3 | Tests avec l'équipe GSF sur de vraies demandes (pilote) | L |
| 9.4 | Publication sur l'App Store et Google Play | M |
| 9.5 | Choisir l'hébergement et déployer : serveur, base, sauvegardes, nom de domaine | M |

---

## Reporté après le lancement

| Fonction | Raison |
|---|---|
| Paiement en ligne (5.4), si le prestataire n'est pas prêt | Le lancement se fait avec l'encaissement manuel |
| Notifications WhatsApp et SMS (hors codes de connexion) | Push et email suffisent au départ |
| Connexion Google, Apple et Face ID | Le code SMS ou email suffit au départ |
| Version anglaise | Le français d'abord. Les textes sont prévus pour être traduits |
| Facturation mensuelle automatique (entretien, gardiennage, suivi de construction) | Au lancement, l'agent crée la demande de chaque mois |
| Reversements automatiques aux partenaires | Enregistrés à la main au départ |
| Statistiques avancées du tableau de bord | Le tableau de bord simple suffit |

---

## Décisions à prendre avant de démarrer

1. **Encaissement et paiement (lot 5)** : **mis de côté** pour le moment (décision du 26/11/2026). Le lot 5 n'est pas planifié tant que le sujet n'est pas repris. Les autres lots avancent sans lui.
2. **Taille de l'équipe** de développement, pour transformer les tailles en planning.

## Environnement de développement

- **Tout ce qu'il faut installer pour le projet va dans le dossier du projet sur D:** (`d:\Projets\gsfservice`), jamais sur C:, qui a très peu de place libre (5,8 Go le 26/11/2026).
- **Déjà présents sur la machine**, utilisés par d'autres projets React Native : **Node.js** (v24) et l'**environnement Android**. Rien à réinstaller.
- **PHP 8.3** : celui de WAMP, déjà présent (`C:\wamp64\bin\php\php8.3.28`), avec les extensions utiles à Laravel (pdo_pgsql, mbstring, intl, zip, gd…).
- **Composer 2.11** : installé dans le projet le 26/11/2026, `outils\composer\composer.bat`. Sa configuration et son cache restent dans `outils\composer`, sur D:.
- **L'app se lance avec Expo** (Expo Go sur le téléphone, ou le navigateur), pas avec Android Studio.
- **Modèle** : le projet `D:\Projets\taskApp` (même découpage `server/` + `mobile/`, mêmes conventions pour l'app Expo).
