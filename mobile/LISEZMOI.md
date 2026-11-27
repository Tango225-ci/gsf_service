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

En attendant la connexion par code (lot 1), l'écran de connexion propose en développement trois boutons pour entrer avec un rôle, sans compte ni serveur. Ce mode n'existe pas dans l'app publiée.
