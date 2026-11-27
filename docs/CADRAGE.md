# GSF Service — Document de cadrage

> Dernière mise à jour : 24 novembre 2026 · Statut : **cadrage en cours, aucun code écrit**
> Maquettes et architecture (page interactive) : https://claude.ai/artifact/KriCzstC3PomsTeaHYwzZV
> Source de cette page : [gsf-maquettes.html](gsf-maquettes.html), version 0.8

---

## 1. Le concept

GSF Service est un **service de conciergerie en Côte d'Ivoire**.

- **Pour qui** : les Ivoiriens de la **diaspora** (vacances, démarches à distance, gestion de terrains), et aussi les **résidents en Côte d'Ivoire** qui manquent de temps pour leurs courses et démarches.
- **Principe** : le client ne réserve pas lui-même dans un catalogue de biens. Il **exprime un besoin** (critères, dates, options), et **GSF trouve la solution** dans son réseau de partenaires, puis s'occupe de tout.
- **Plateforme pour GSF uniquement** : il n'y a qu'une seule entreprise sur la plateforme, pas de multi-entreprises.

## 2. Décisions validées

| Sujet | Décision |
|---|---|
| Pays d'opération | **Côte d'Ivoire**, monnaie **FCFA (XOF)**, avec un équivalent en EUR, USD et CAD affiché pour la diaspora |
| Plateforme | Pour **GSF uniquement** |
| Application mobile | **React Native (Expo)**, **une seule app** dont l'interface change selon le rôle (Client, Agent ou Coordinateur) |
| Serveur et web | **Tout en Laravel** : une seule application fait l'API de l'app mobile, le **back-office** (Filament) et le **site vitrine** (Blade) |
| Résidences et véhicules | Ils appartiennent à des **partenaires** de GSF. Les partenaires sont gérés dans le back-office et n'ont **pas d'accès à l'app** |
| Modèle de commande | Demande du client → GSF fait des **propositions** → le client choisit → **acompte** → suivi → **solde à l'arrivée** ou à la livraison |
| Services à prix fixe | Payés **en totalité à la commande** (prestation, frais officiels et frais GSF). Pas d'acompte ni de solde |
| Affectation | **Un seul agent par demande**, pour tous les services qu'elle contient |
| Acompte | **30 % par défaut**, réglable par service, et modifiable par l'agent sur chaque proposition |
| Frais de service GSF | **Montant fixé selon le volume de la prestation, jamais en pourcentage**. Sur une **ligne à part**, payés **en totalité avec l'acompte**. Fixés par l'**agent** dans la proposition ou le devis. Pour les services à prix fixe (sans proposition), montant fixe réglé par GSF dans le back-office |
| Tarifs | Saisis par GSF dans le back-office, **sans développement**. Toujours **visibles par le client** |
| Prestataire de paiement | **À définir plus tard**. L'architecture prévoit un module de paiement indépendant |

### Exemple de calcul (séjour)
| | Montant |
|---|---|
| Prestations (résidence 660 000 + véhicule 420 000 + aéroport 35 000) | 1 115 000 F |
| Frais de service GSF (fixés par l'agent selon le volume, exemple) | 75 000 F |
| **Total** | **1 190 000 F** |
| À la commande : 30 % de la résidence et du véhicule (324 000) + accueil aéroport en totalité (35 000) + frais GSF (75 000) | 434 000 F |
| À l'arrivée : solde de la résidence et du véhicule | 756 000 F |

**Demande mixte** : quand une demande mélange des services à prix fixe et des services sur proposition, la part à prix fixe est payée **en totalité avec l'acompte**. Le solde ne porte que sur les prestations proposées.

## 3. Les rôles

| Rôle | Où | Ce qu'il fait |
|---|---|---|
| **Client** | App mobile | S'inscrit, commande, compare les propositions, paie, suit sa demande, échange avec l'agent, laisse un avis. Enregistre ses terrains dans « Mes biens » |
| **Agent GSF** | App mobile | Traite ses tâches, crée les propositions, met à jour les étapes avec photos, fait les états des lieux et les visites de terrain, encaisse le solde |
| **Coordinateur** | Back-office web et app mobile | Reçoit toutes les demandes et les affecte aux agents, depuis le back-office ou depuis l'app |
| **Manager / Admin** | Back-office web | Pilote l'activité, gère le catalogue, les tarifs, les partenaires, les employés et les finances |
| **Partenaire** | Aucun accès | Propriétaires de résidences et de véhicules. Gérés dans le back-office |

Les comptes agents sont **créés par l'admin uniquement**.

**Affectation** : toutes les demandes sont **centralisées par un coordinateur**, qui les affecte aux agents. Les **géomètres du cabinet GSF sont des agents** comme les autres : le coordinateur leur affecte les demandes foncières. Pas de rôle « Géomètre » à part. Dans l'app, le coordinateur voit les demandes à affecter, choisit un agent parmi des suggestions (selon le type de service, la charge et la zone), ajoute une note, et peut réaffecter une demande en cours. L'agent est notifié.

## 4. Catalogue des services au lancement

Chaque service se configure dans le back-office : formulaire, étapes de suivi, tarifs, acompte, frais.

**Séjour et mobilité**
- Résidence meublée (à partir de)
- Location de véhicule, avec ou sans chauffeur (à partir de)
- Accueil à l'aéroport FHB (prix fixe par formule : berline, SUV, minibus, avec options)

**Démarches administratives**
- Extrait d'acte de naissance, casier judiciaire, certificat de nationalité, légalisation de documents (prix fixe, avec les frais officiels à part)
- Procuration numérique signée dans l'app

**Foncier** : tous les services fonciers sont gérés par le **cabinet de géomètres de GSF**, sans partenaire externe.
- Visite de terrain : photos, vidéo, GPS, rapport (prix fixe selon la zone)
- Vérification foncière (prix fixe)
- Dossier ACD (sur devis)
- Bornage et plan topographique, par le cabinet de géomètres de GSF (sur devis)
- Entretien et gardiennage du terrain (par mois)
- Suivi de construction (par mois)
- Paiement de l'impôt foncier (frais fixes + montant de l'impôt)

**Autre demande** : demande libre (sur devis)

Une demande peut regrouper **plusieurs services** (par exemple résidence, véhicule et accueil à l'aéroport).

## 5. Tarification

Il y a quatre modes, au choix pour chaque service :
1. **Prix fixe** : le client voit le prix exact et paie tout à la commande, sans proposition
2. **Prix à l'unité** (par nuit, par jour, par heure, par mois) : le total se calcule pendant que le client remplit sa demande
3. **À partir de** : un prix indicatif, puis le prix exact dans la proposition
4. **Sur devis** : l'agent envoie un devis détaillé

GSF règle pour chaque service : le mode, les formules, les options et suppléments, les zones, les périodes (haute saison), les frais officiels, l'acompte, et les frais GSF des services à prix fixe (montant fixe). Pour les autres services, l'agent fixe les frais GSF dans la proposition, selon le volume de la prestation. Pour les biens des partenaires, il saisit aussi le prix partenaire et le prix client.

**Le client ne voit jamais** : le coût interne, la marge ni le prix payé au partenaire.

Le client voit les prix à six endroits : catalogue, fiche du service, formulaire de demande, proposition ou devis, récapitulatif avant paiement, reçu.

## 6. Statuts d'une demande

```
Soumise → Prise en charge → Recherche → Propositions envoyées → Proposition acceptée
→ Acompte payé → Préparation → Solde payé → En cours → Terminée → Clôturée
À tout moment : En attente du client · Annulée · Remboursée · Litige
```
Les étapes de terrain propres à chaque service (dépôt en mairie, état des lieux, bornage…) sont configurées dans le back-office, à l'intérieur du statut « Préparation ».

**Étapes indicatives d'un dossier ACD** (à valider avec GSF) : Collecte des pièces → Constitution du dossier → Dépôt de la demande au ministère → Suivi de l'instruction → Signature de l'ACD → Retrait et remise au client.

Le service ACD couvre uniquement la constitution du dossier de demande, son dépôt au ministère et le suivi. Il est assuré par le cabinet de géomètres de GSF. **Aucun partenaire externe** n'intervient.

## 7. Architecture technique

```
App mobile (React Native / Expo)
              |  API REST (Sanctum) + WebSocket (Reverb)
              ↓
Application Laravel : API + back-office (Filament) + site vitrine (Blade)
              /              |                \
   PostgreSQL (Eloquent)   Redis (queues, Horizon)   Cloudflare R2 (fichiers)
   Services externes : Paiement (à définir) · Expo Push · WhatsApp · SMS · Resend (email) · Sentry
```

**Organisation du code** (un seul dépôt, sur le modèle du projet `D:\Projets\taskApp`)
```
server/          Laravel : API, back-office Filament (app/Filament), site vitrine Blade (resources/), traductions FR/EN (lang/)
mobile/          React Native (Expo) : une seule app pour les rôles Client, Agent et Coordinateur
database/        Création de la base PostgreSQL et de son compte (les tables viennent des migrations Laravel)
outils/          Outils installés pour le projet (Composer), sur D:
docs/            Cadrage, schéma, MVP, maquettes
```
Chaque dossier a son `LISEZMOI.md` en français : comment l'installer, le lancer et le tester.

**Côté serveur** : Laravel (dernière version stable), Filament pour le back-office, spatie/laravel-permission pour les rôles, Sanctum pour la connexion de l'app, Reverb pour le temps réel, Horizon pour les tâches de fond. **Hébergement : choisi plus tard, au moment du déploiement.** Pendant le développement, tout tourne sur le PC.

**Côté mobile** (repris de taskApp) : Expo Router avec les écrans dans `src/app/`, le code partagé dans `src/lib/` (appels à l'API avec jeton, session, stockage sécurisé, thème tiré des maquettes) et `src/components/`. Noms de fichiers et de fonctions en français. Pendant le développement, l'app se lance avec **Expo** (Expo Go sur le téléphone, ou le navigateur), pas avec Android Studio : commande `npm run telephone`, qui annonce au téléphone l'adresse Wi-Fi du PC. EAS Build et EAS Update pour la publication. Connexion par code SMS ou email, Google, Apple et Face ID. L'envoi des photos fonctionne aussi hors réseau : elles partent au retour de la connexion.

**Modules de l'application** : auth, rôles, catalogue, demandes, affectation, propositions, suivi, messagerie, paiements, partenaires, notifications, fichiers, journal.

## 8. Modèle de données (entités principales)

Schéma complet, champ par champ : [SCHEMA-BDD.md](SCHEMA-BDD.md) (version 0.1, à valider). Résumé :

- **Comptes** : User, ClientProfile, Beneficiary (proches sur place), Employee (rôle agent, coordinateur, manager ou admin ; compétences et zones), Zone, **ClientAsset** (terrains du client)
- **Affectation** : Assignment (historique des affectations et réaffectations)
- **Suivi terrain** : Inspection (visite de terrain, état des lieux, remise de véhicule), Mandate (procuration), InternalNote
- **Catalogue** : Service, ServiceField (formulaire), ServiceStep (étapes), PriceRule (formules et tarifs), ServiceOption (suppléments)
- **Demandes** : Request (contient plusieurs RequestItem), Proposal, TimelineEvent, Attachment, Message
- **Partenaires** : Partner, PartnerProperty, PartnerVehicle, Payout (reversements)
- **Argent** : Payment (type acompte ou solde, moyen de paiement, payé dans l'app ou sur place)
- **Transverse** : Review, Notification, AuditLog, Setting (taux de change, acompte par défaut)

## 9. Conformité

- Loi ivoirienne n° 2013-450 sur les données personnelles, avec une déclaration à l'**ARTCI**
- **RGPD** pour les clients qui vivent en Europe
- Documents sensibles chiffrés, double authentification pour le personnel, journal de toutes les actions
- Les stores exigent une politique de confidentialité et la suppression du compte depuis l'app

## 10. Points ouverts

- [ ] **Prestataire de paiement** : carte internationale et Mobile Money (Orange, MTN, Moov, Wave). Rappel : Stripe n'ouvre pas de compte à une entreprise ivoirienne
- [ ] **Montants réels** des tarifs (ceux des maquettes sont des exemples)
- [ ] **Taille de l'équipe** d'agents au lancement
- [ ] **Étapes réelles** du dossier ACD et des autres démarches
- [ ] Constituer le **réseau de partenaires** : propriétaires de résidences, loueurs de véhicules

## 11. Prochaines étapes

1. Valider les maquettes (lien en haut de ce document)
2. Valider le schéma de la base de données ([SCHEMA-BDD.md](SCHEMA-BDD.md), proposé le 24/11/2026)
3. Découpage du MVP en tâches : proposé dans [MVP.md](MVP.md) le 26/11/2026, à valider
4. Démarrage du développement. Tous les outils à installer vont dans le dossier du projet sur **D:**. Node.js et l'environnement Android sont déjà sur la machine

## Historique des décisions

| Date | Décision |
|---|---|
| 24/11/2026 | Lancement du cadrage. App mobile React Native, une seule app pour les clients et les agents |
| 24/11/2026 | Modèle conciergerie (GSF cherche pour le client). Acompte à la commande, solde à l'arrivée |
| 24/11/2026 | Côte d'Ivoire. Services ouverts aussi aux résidents, pas seulement à la diaspora |
| 24/11/2026 | Prestataire de paiement reporté à plus tard |
| 24/11/2026 | Ajout de l'accueil à l'aéroport et de la tarification visible par le client |
| 24/11/2026 | Ajout de la catégorie Foncier (visite de terrain, ACD, bornage…) |
| 24/11/2026 | Frais de service GSF : sur une ligne à part, à 10 %, payés avec l'acompte |
| 24/11/2026 | Dossier ACD : constitution du dossier, dépôt au ministère et suivi, par GSF seul. Pas de bornage ni de partenaire externe dans ce service |
| 24/11/2026 | GSF a son propre cabinet de géomètres : il gère tout le foncier (ACD, bornage, visites…). Plus de géomètres ni de notaires partenaires |
| 24/11/2026 | Toutes les demandes sont centralisées par un coordinateur qui les affecte aux agents. Les géomètres du cabinet sont des agents |
| 24/11/2026 | Nouveau rôle Coordinateur, qui affecte les demandes depuis le back-office et depuis l'app mobile |
| 24/11/2026 | Écrans du coordinateur validés : agents suggérés selon le type de service, la charge et la zone. Réaffectation possible d'une demande en cours |
| 24/11/2026 | Services à prix fixe payés en totalité à la commande. Un seul agent par demande |
| 24/11/2026 | Tout le serveur en **Laravel** (API, back-office, site vitrine), à la place de NestJS et Next.js. App mobile toujours en React Native |
| 24/11/2026 | Demande mixte : la part à prix fixe est payée en totalité avec l'acompte, le solde ne porte que sur les prestations proposées |
| 25/11/2026 | Frais de service GSF : plus de pourcentage (fin des 10 %). Montant fixé par l'agent selon le volume de la prestation. Montant fixe réglé dans le back-office pour les services à prix fixe. Acompte (30 %) et haute saison inchangés |
| 26/11/2026 | Encaissement et paiement (lot 5 du MVP) mis de côté pour le moment. Tous les outils à installer vont dans le dossier du projet sur D: |
| 26/11/2026 | App lancée avec Expo (Expo Go, navigateur), pas avec Android Studio. Organisation du code et de l'app mobile reprise du projet taskApp. Composer installé dans `outils/composer` |
| 26/11/2026 | Hébergement choisi plus tard, lors du déploiement. Le développement se fait sur le PC |
| 26/11/2026 | Base de développement sur le PostgreSQL 14 déjà installé : base `gsfservice`, compte `gsf_api` (script `database/00_creer_base.sql`) |
| 27/11/2026 | Lot 0 terminé : Laravel 13, Filament 5, base PostgreSQL complète, rôles, journal des actions, chiffrement, app Expo SDK 58. Le prix à l'unité ne passe pas par une proposition (frais GSF fixes) |
| 27/11/2026 | Services à prix à l'unité (entretien, gardiennage, suivi de construction…) : **acompte puis solde**, comme les services sur proposition. Seul le prix fixe est payé en totalité à la commande |
| 27/11/2026 | Identité : couleurs **rouge, blanc et noir**, logo « GSF · Géomètre Son Femme » (rouge #F42409 ; #D91F07 pour les textes et boutons, plus lisible). Fenêtre de connexion : un client non inscrit est invité à créer son compte |
