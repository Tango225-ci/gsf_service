# GSF Service — Schéma de la base de données

> Version 0.3 · 24 novembre 2026 · Statut : **proposition à valider**
> Base : PostgreSQL, via les migrations et les modèles Eloquent de Laravel. Noms des tables en anglais au pluriel (`users`, `requests`…), selon la convention Laravel. Montants en **FCFA entiers** (pas de centimes). Dates en UTC.
> Décisions de fond : [CADRAGE.md](CADRAGE.md). Page visuelle : section « Données » des maquettes.

Conventions : chaque table a `id` (UUID), `createdAt`, `updatedAt`. Les champs marqués 🔒 sont chiffrés. Les champs marqués 👁‍🗨 ne sont **jamais envoyés à l'app client** (coût interne, marge, prix partenaire, notes internes).

---

## Mise en œuvre dans Laravel (lot 0, 27/11/2026)

Les tables existent dans `server/database/migrations/`. Écarts avec ce document, décidés à la mise en œuvre :

| Ici | Dans le code | Raison |
|---|---|---|
| Request, RequestItem | `service_requests` / `ServiceRequest`, `service_request_items` / `ServiceRequestItem` | « Request » se confond avec la requête HTTP de Laravel |
| `Employee.role` | Rôle porté par le compte `User`, via spatie/laravel-permission (`client`, `agent`, `coordinator`, `manager`, `admin`) | Une seule source pour le rôle, y compris pour les clients |
| `Employee.skills`, `Employee.zones` | Tables de liaison `employee_service_category` et `employee_zone` | |
| Notification | Table standard `notifications` de Laravel | Notifications dans l'app gérées par Laravel |
| User | Ajout de `password` (facultatif, pour le personnel au back-office) | Connexion du personnel à Filament |
| Prix à l'unité | Pas de proposition : frais GSF fixes, comme le prix fixe. Mais paiement par **acompte puis solde** (décision du 27/11/2026) | Le total est connu dès le formulaire (CADRAGE § 5) |

## 1. Comptes et équipe

### User
Un compte de connexion, quel que soit le rôle.

| Champ | Type | Notes |
|---|---|---|
| phone | texte, unique, optionnel | Connexion par code SMS |
| email | texte, unique, optionnel | Connexion par code email. Au moins un des deux est requis |
| firstName, lastName | texte | |
| locale | `fr` \| `en` | Langue de l'app |
| googleId, appleId | texte, optionnels | Connexion Google / Apple |
| twoFactorEnabled | booléen | Obligatoire pour le personnel |
| status | `ACTIVE` \| `SUSPENDED` \| `DELETED` | Suppression du compte depuis l'app (exigence des stores) |
| deletedAt | date, optionnelle | Données anonymisées après suppression |

### ClientProfile
| Champ | Type | Notes |
|---|---|---|
| userId | → User, unique | |
| countryOfResidence, city | texte | Ex. France, Paris |
| displayCurrency | `XOF` \| `EUR` \| `USD` \| `CAD` | Équivalent affiché à côté des FCFA |
| whatsapp | texte, optionnel | |

### Beneficiary
Un proche du client sur place (reçoit un document, accueille un agent…).

| Champ | Type | Notes |
|---|---|---|
| clientId | → ClientProfile | |
| fullName, phone, relation, city | texte | |

### Employee
Un membre de GSF. Les comptes sont créés par l'admin uniquement.

| Champ | Type | Notes |
|---|---|---|
| userId | → User, unique | |
| role | `AGENT` \| `COORDINATOR` \| `MANAGER` \| `ADMIN` | Le coordinateur affecte les demandes |
| jobTitle | texte, optionnel | Ex. « Géomètre ». Purement descriptif : un géomètre est un `AGENT` |
| skills | liste de → ServiceCategory | Sert aux suggestions d'affectation (ex. Foncier pour les géomètres) |
| zones | liste de → Zone | Sert aux suggestions d'affectation |
| active | booléen | Un agent absent ou parti n'est plus suggéré |

La **charge** d'un agent (nombre de dossiers en cours) n'est pas stockée : elle se calcule à partir des demandes ouvertes qui lui sont affectées.

### Zone
| Champ | Type | Notes |
|---|---|---|
| name | texte | Ex. Abidjan · Cocody, Bingerville, Assinie, Yamoussoukro |
| region | texte | |
| parentId | → Zone, optionnel | Pour regrouper les communes d'Abidjan |

### Device
| Champ | Type | Notes |
|---|---|---|
| userId | → User | |
| pushToken, platform | texte | Notifications Expo Push |

---

## 2. Biens du client (« Mes biens »)

### ClientAsset
Un terrain du client, enregistré une fois et réutilisé par toutes ses demandes foncières.

| Champ | Type | Notes |
|---|---|---|
| clientId | → ClientProfile | |
| type | `LAND` (terrain) \| `BUILDING` (construction) | |
| label | texte | Ex. « Mon terrain de Bingerville » |
| zoneId | → Zone | |
| locality, lotNumber, blockNumber | texte | Lot, îlot |
| areaM2 | nombre, optionnel | |
| gpsLat, gpsLng | décimal, optionnels | Renseignés lors de la première visite |
| titleType | `VILLAGE_CERTIFICATE` \| `ALLOCATION_LETTER` \| `ACD` \| `LAND_TITLE` \| `NONE` | Attestation villageoise, lettre d'attribution, ACD, titre foncier |
| notes | texte | |

Documents du terrain (plan, attestation, ACD…) : table **Attachment**, rattachée au bien. 🔒

---

## 3. Catalogue

### ServiceCategory
`name` (Séjour et mobilité, Démarches administratives, Foncier, Autre demande), `order`.

### Service
| Champ | Type | Notes |
|---|---|---|
| categoryId | → ServiceCategory | |
| slug, name, description, included | texte | « Ce qui est inclus » |
| pricingMode | `FIXED` \| `PER_UNIT` \| `FROM` \| `QUOTE` | Prix fixe, à l'unité, à partir de, sur devis |
| unit | `NIGHT` \| `DAY` \| `HOUR` \| `MONTH`, optionnel | Pour les modes à l'unité et à partir de |
| displayPrice | entier, optionnel | Le « dès… » du catalogue |
| depositPercent | entier, optionnel | Vide = valeur par défaut (30 %) |
| fixedServiceFee | entier, optionnel | Frais de service GSF en FCFA, pour les services à prix fixe uniquement. Jamais de pourcentage |
| requiresAsset | booléen | Vrai pour le foncier : la demande doit viser un bien du client |
| requiresMandate | booléen | Vrai pour les démarches : procuration à signer |
| published | booléen | Visible dans l'app |
| order | entier | |

### ServiceField
Les champs du formulaire de demande, propres à chaque service.

| Champ | Type | Notes |
|---|---|---|
| serviceId | → Service | |
| key, label, helpText | texte | |
| type | `TEXT` \| `NUMBER` \| `DATE` \| `DATE_RANGE` \| `SELECT` \| `MULTI_SELECT` \| `FILE` \| `FLIGHT` \| `ZONE` \| `ASSET` | |
| required | booléen | |
| options | JSON | Choix des listes |
| order | entier | |

### ServiceStep
Les étapes de suivi configurées pour un service, à l'intérieur du statut « Préparation » (ex. les 6 étapes du dossier ACD).

| Champ | Type | Notes |
|---|---|---|
| serviceId | → Service | |
| name | texte | Ex. « Dépôt de la demande au ministère » |
| order | entier | |
| targetDays | entier, optionnel | Délai cible, pour les alertes de retard |
| visibleToClient | booléen | |

### PriceRule
Une formule de prix (berline, SUV, zone…).

| Champ | Type | Notes |
|---|---|---|
| serviceId | → Service | |
| label | texte | Ex. Berline |
| capacity | texte, optionnel | Ex. 1 à 3 pers. |
| zoneId | → Zone, optionnel | Prix de la visite de terrain selon la zone |
| clientPrice | entier | |
| internalCost | entier, optionnel 👁‍🗨 | La marge se calcule : prix client − coût interne |
| active | booléen | |

### ServiceOption
| Champ | Type | Notes |
|---|---|---|
| serviceId | → Service | |
| label | texte | Ex. Arrivée entre 22 h et 6 h |
| kind | `SUPPLEMENT` \| `CHECKBOX` \| `SWITCH_TO_QUOTE` | La dernière fait passer la demande sur devis |
| amount | entier, optionnel | |

### OfficialFee
Frais officiels d'une démarche (timbres, droits), affichés à part. `serviceId`, `label`, `amount`.

### SeasonRule
Haute saison. `serviceId` (optionnel : vide = tous les services), `name`, `startDate`, `endDate`, `adjustmentPercent` (ex. +20).

---

## 4. Partenaires (résidences et véhicules uniquement)

### Partner
| Champ | Type | Notes |
|---|---|---|
| type | `PROPERTY_OWNER` \| `VEHICLE_RENTER` | |
| name, phone, email | texte | |
| payoutDetails | JSON 🔒 👁‍🗨 | Compte bancaire ou Mobile Money |
| notes | texte 👁‍🗨 | |
| active | booléen | |

### PartnerProperty
| Champ | Type | Notes |
|---|---|---|
| partnerId | → Partner | |
| name | texte | Ex. Villa Riviera 3 |
| zoneId, address | → Zone, texte | |
| bedrooms, capacity | entiers | |
| amenities | liste | Clim, groupe électrogène, piscine, gardien… |
| partnerPricePerNight | entier 👁‍🗨 | |
| clientPricePerNight | entier | La différence est la marge de GSF |
| active | booléen | Photos : Attachment |

### PartnerVehicle
| Champ | Type | Notes |
|---|---|---|
| partnerId | → Partner | |
| model, category, plate | texte | Ex. Toyota RAV4, SUV |
| seats | entier | |
| driverAvailable | booléen | |
| partnerPricePerDay | entier 👁‍🗨 | |
| clientPricePerDay, driverPricePerDay | entiers | |
| active | booléen | Photos : Attachment |

### Payout
Reversement à un partenaire. `partnerId`, `amount`, `periodStart`, `periodEnd`, `status` (`PENDING` \| `PAID`), `paidAt`, `reference`, et la liste des prestations concernées (→ RequestItem). 👁‍🗨

---

## 5. Demandes

### Request
La demande du client. Elle peut regrouper plusieurs services.

| Champ | Type | Notes |
|---|---|---|
| number | texte, unique | Ex. GSF-2026-0142 |
| clientId | → ClientProfile | |
| beneficiaryId | → Beneficiary, optionnel | |
| title | texte | Ex. « Séjour à Abidjan » |
| status | voir § 7 | Statut commun |
| onHold, holdReason | booléen, texte | « En attente du client », sans perdre le statut |
| assignedAgentId | → Employee, optionnel | L'agent unique de la demande, pour tous ses services. Vide = à affecter |
| dueAt | date, optionnelle | Échéance (arrivée, rendez-vous, délai cible) |
| subtotal, feeAmount, total | entiers | Instantané au moment de l'acceptation |
| depositAmount, balanceAmount | entiers | |
| submittedAt, closedAt | dates | |

### Assignment
L'historique des affectations, pour tracer les réaffectations.

| Champ | Type | Notes |
|---|---|---|
| requestId | → Request | |
| agentId | → Employee | |
| assignedById | → Employee | Le coordinateur |
| note | texte | Note pour l'agent |
| assignedAt, endedAt | dates | `endedAt` rempli lors d'une réaffectation |
| endReason | texte, optionnel | Ex. agent absent |

### RequestItem
Une prestation dans la demande (une par service choisi).

| Champ | Type | Notes |
|---|---|---|
| requestId | → Request | |
| serviceId | → Service | |
| assetId | → ClientAsset, optionnel | Obligatoire si le service est foncier |
| answers | JSON | Réponses au formulaire (dates, vol, options cochées…) |
| priceRuleId | → PriceRule, optionnel | Formule choisie (prix fixe) |
| selectedOptions | liste de → ServiceOption | |
| startDate, endDate, quantity | dates, entier | Nuits, jours, mois |
| acceptedProposalId | → Proposal, optionnel | |
| amount | entier | Prix client de la prestation |
| officialFees | entier | |
| currentStepId | → ServiceStep, optionnel | Étape de suivi atteinte |

### Proposal
Une option envoyée par l'agent (résidence, véhicule) ou un devis.

| Champ | Type | Notes |
|---|---|---|
| requestItemId | → RequestItem | |
| createdById | → Employee | |
| label | texte | Option A, Option B, Devis |
| propertyId / vehicleId | → PartnerProperty / PartnerVehicle, optionnels | |
| description | texte | |
| unitPrice, quantity, total | entiers | |
| partnerCost | entier, optionnel 👁‍🗨 | |
| serviceFee | entier | Frais de service GSF fixés par l'agent selon le volume de la prestation |
| depositPercent | entier | Modifiable par l'agent |
| validUntil | date | |
| status | `SENT` \| `ACCEPTED` \| `DECLINED` \| `EXPIRED` | |

### ProposalLine
Lignes d'un devis. `proposalId`, `label`, `kind` (`SERVICE` \| `OPTION` \| `OFFICIAL_FEE`), `amount`.

### TimelineEvent
Le fil de suivi visible dans l'app.

| Champ | Type | Notes |
|---|---|---|
| requestId | → Request | |
| requestItemId | → RequestItem, optionnel | Pour une étape propre à un service |
| stepId | → ServiceStep, optionnel | |
| type | `STATUS` \| `STEP` \| `PAYMENT` \| `ASSIGNMENT` \| `NOTE` | |
| comment | texte | |
| visibleToClient | booléen | |
| authorId | → User | |
| occurredAt | date | Heure réelle, même si envoyée plus tard (hors réseau) |

### Inspection
Visite de terrain, état des lieux, remise de véhicule.

| Champ | Type | Notes |
|---|---|---|
| requestItemId | → RequestItem | |
| type | `LAND_VISIT` \| `CHECK_IN` \| `CHECK_OUT` \| `VEHICLE_HANDOVER` \| `VEHICLE_RETURN` | |
| agentId | → Employee | |
| gpsLat, gpsLng, gpsAccuracyM | décimaux | |
| checklist | JSON | Contrôles cochés (bornes 4/4…) |
| answers | JSON | Terrain occupé, construction voisine… |
| mileageKm, fuelLevel | entiers, optionnels | Véhicules |
| observations | texte | |
| clientSignatureId, reportPdfId | → Attachment, optionnels | |

### Mandate
Procuration signée dans l'app. `requestItemId`, `clientId`, `signedAt`, `signatureId` et `documentId` (→ Attachment 🔒).

### Message
Un fil par demande. `requestId`, `senderId` (→ User), `text`, `readAt`. Photos et notes vocales : Attachment.

### InternalNote
Notes internes du back-office, jamais vues par le client. `requestId`, `authorId`, `text`. 👁‍🗨

### Attachment
Tout fichier : photo, vidéo, document, note vocale, PDF.

| Champ | Type | Notes |
|---|---|---|
| ownerType, ownerId | texte, UUID | Ce à quoi le fichier est rattaché (étape, bien, message, inspection…) |
| kind | `PHOTO` \| `VIDEO` \| `DOCUMENT` \| `AUDIO` \| `PDF` | |
| storageKey, mimeType, sizeBytes | | Stockage Cloudflare R2 |
| encrypted | booléen | Vrai pour les pièces d'identité et documents fonciers |
| uploadedById | → User | |
| takenAt, gpsLat, gpsLng | optionnels | Preuves de terrain |

---

## 6. Argent

### Payment
| Champ | Type | Notes |
|---|---|---|
| requestId | → Request | |
| type | `DEPOSIT` \| `BALANCE` \| `FULL` \| `REFUND` | Acompte, solde, paiement total, remboursement |
| amount | entier | En FCFA |
| feeIncluded | entier | Part des frais de service GSF dans ce paiement |
| method | `CARD` \| `MOBILE_MONEY` \| `CASH` | |
| channel | `IN_APP` \| `ON_SITE` | Le solde peut être encaissé sur place par l'agent |
| collectedById | → Employee, optionnel | Agent qui encaisse sur place |
| provider, providerRef | texte | Prestataire de paiement, à définir |
| status | `PENDING` \| `SUCCEEDED` \| `FAILED` | |
| paidAt | date | |
| receiptId | → Attachment | Reçu PDF |
| exchangeRateEur | décimal | Taux utilisé pour l'équivalent affiché |

---

## 7. Statuts d'une demande (`Request.status`)

`SUBMITTED` Soumise → `ASSIGNED` Prise en charge → `SEARCHING` Recherche → `PROPOSALS_SENT` Propositions envoyées → `PROPOSAL_ACCEPTED` Proposition acceptée → `DEPOSIT_PAID` Acompte payé (ou `PAID` Payée, pour le prix fixe) → `PREPARING` Préparation → `BALANCE_PAID` Solde payé → `IN_PROGRESS` En cours → `COMPLETED` Terminée → `CLOSED` Clôturée.

À tout moment : `CANCELLED` Annulée, `REFUNDED` Remboursée, `DISPUTED` Litige. « En attente du client » est le drapeau `onHold`, pour garder le statut en cours.

Une demande entièrement à prix fixe saute les statuts Recherche, Propositions envoyées et Proposition acceptée. Payée en totalité à la commande, elle passe à `PAID` Payée, puis directement à `PREPARING` Préparation, sans statut Solde payé.

---

## 8. Transverse

| Table | Contenu |
|---|---|
| **Review** | Avis de fin de demande : `requestId`, `clientId`, `agentId`, `rating` (1 à 5), `comment` |
| **Notification** | `userId`, `channel` (`PUSH` \| `WHATSAPP` \| `SMS` \| `EMAIL`), `template`, `payload`, `sentAt`, `readAt` |
| **AuditLog** | Journal de toutes les actions : `actorId`, `action`, `entityType`, `entityId`, `before`, `after`, `ip`, `at` |
| **Setting** | Paramètres globaux : acompte par défaut (30 %), taux de change EUR / USD / CAD |

---

## 9. Règles de calcul

- **Frais GSF** = un montant en FCFA, **jamais un pourcentage**. Service sur proposition ou devis : l'agent le fixe dans la proposition (`Proposal.serviceFee`), selon le volume de la prestation. Service à prix fixe : `Service.fixedServiceFee`. Le total des frais de la demande est `Request.feeAmount`.
- **Acompte** = `depositPercent` × prestations proposées + **totalité des prestations à prix fixe** (et leurs frais officiels) + **totalité des frais GSF**.
- **Solde** = prestations proposées − part payée en acompte. Il ne contient jamais de frais GSF ni de prestation à prix fixe.
- Exemple : résidence 660 000 + véhicule 420 000 + accueil aéroport 35 000. Frais GSF fixés à 75 000. À la commande : 324 000 + 35 000 + 75 000 = **434 000 F**. À l'arrivée : **756 000 F**.
- **Haute saison** : la SeasonRule s'applique au prix client des formules et des biens concernés.
- Les montants de la demande sont **figés** au moment où le client accepte : un changement de tarif ensuite ne les modifie pas.

- **Prix fixe** : le client paie **tout à la commande** (paiement `FULL` : prestations + frais officiels + frais GSF). Pas d'acompte ni de solde. Si une demande mélange prix fixe et propositions (ex. séjour avec accueil aéroport), la part à prix fixe est payée en totalité avec l'acompte, et le solde ne porte que sur les prestations proposées.
- **Affectation** : **un seul agent par demande**, quel que soit le nombre de services (`Request.assignedAgentId`). Pas d'agent par prestation.
