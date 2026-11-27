# Application mobile GSF Service

React Native avec **Expo SDK 58** et **Expo Router**. Une seule app pour trois rôles : **client**, **agent** et **coordinateur**. Les managers et admins utilisent le back-office web.

On la lance avec **Expo** (Expo Go sur le téléphone, ou le navigateur), pas avec Android Studio.

## Démarrer

```powershell
npm install                 # la première fois
npm run telephone           # Expo Go sur le téléphone (même Wi-Fi que le PC)
npm run web                 # dans le navigateur du PC
```

`npm run telephone` annonce au téléphone l'adresse Wi-Fi du PC. Expo écoute sur le port **8082** : le 8081 est pris par McAfee sur ce PC.
L'app appelle l'API Laravel sur le port **8000** du même PC : lancer `php artisan serve --host=0.0.0.0` dans le dossier `server`.

Pour garder le cache npm sur D: : `$env:npm_config_cache="D:\Projets\gsfservice\outils\npm-cache"` avant `npm install`.

## Contrôles (avant de dire qu'une tâche est finie)

```powershell
npm run typecheck
npm run lint
npx expo-doctor
```

## Organisation

| Dossier | Contenu |
|---|---|
| `src/app/` | Les écrans (chaque fichier est une route). `client/`, `agent/` et `coordinateur/` : un dossier par rôle, chacun avec ses onglets |
| `src/lib/` | `api.ts` (appels à l'API avec jeton), `session.tsx`, `stockage.ts` (coffre sécurisé), `theme.ts` (couleurs des maquettes), `types.ts` |
| `src/components/` | Composants partagés (`ui.tsx`, `Onglets.tsx`, `EcranProfil.tsx`) |
| `scripts/` | `demarrer-telephone.mjs` |

## Mode démonstration

En attendant la vraie connexion par code (lot 1), l'écran de connexion reconnaît ces comptes de démonstration. Tout autre numéro ou email est « inconnu » et mène à la création de compte. N'importe quel code à 6 chiffres est accepté. Ce mode n'existe pas dans l'app publiée.

| Compte | Téléphone | Rôle |
|---|---|---|
| `aicha@client.test` | +33 6 12 34 56 78 | Client (Aïcha Koné) |
| `yao@gsf.test` | +225 07 00 00 00 11 | Agent, séjour et démarches (Yao K.) |
| `didier@gsf.test` | +225 07 00 00 00 13 | Agent géomètre, foncier (Didier K.) |
| `coordinateur@gsf.test` | +225 07 00 00 00 10 | Coordinatrice (Mariam C.) |

Pour Expo Go sur iPhone, le PC (`npx expo login`) et l'app Expo Go doivent être connectés au même compte Expo.

## Écrans (données fictives)

Tous les écrans des maquettes existent, avec des **données fictives** tirées de `src/lib/demo.ts`. Ils seront branchés sur l'API lot par lot, en remplaçant ces données par des appels à `src/lib/api.ts`.

| Rôle | Écrans |
|---|---|
| Connexion | Numéro ou email, code à 6 chiffres, inscription |
| Client | Accueil, catégorie, fiche service, nouvelle demande, propositions, paiement (bouton « Payer » inactif : encaissement mis de côté), demande envoyée, mes demandes, suivi, rapport de visite, mes biens, messages, conversation, profil |
| Agent | Mes tâches, fiche tâche, nouvelle proposition, mise à jour d'étape, remise du véhicule, visite de terrain, partenaires, messages, profil |
| Coordinateur | À affecter, affecter la demande, équipe, messages, profil |
