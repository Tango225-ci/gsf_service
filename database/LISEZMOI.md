# Base de données GSF Service

PostgreSQL 14, déjà installé sur le PC (service `postgresql-x64-14`, port 5432). Toute l'application fonctionne à l'heure **GMT (UTC)**.

Ce dossier crée seulement **la base et son compte**. Les tables sont créées par les **migrations Laravel** du dossier `server/` (voir [../docs/SCHEMA-BDD.md](../docs/SCHEMA-BDD.md)).

| Élément | Valeur |
|---|---|
| Base | `gsfservice` |
| Compte de l'application | `gsf_api` (propriétaire de la base) |
| Hôte, port | `127.0.0.1`, `5432` |

## Création (une seule fois)

Ouvrir PowerShell **dans ce dossier `database`**, puis :

```powershell
$psql = "C:\Program Files\PostgreSQL\14\bin\psql.exe"
& $psql -U postgres -f 00_creer_base.sql
```

Le script demande d'abord le mot de passe du super-utilisateur `postgres`, puis le mot de passe à donner au compte `gsf_api`.

Notez bien le mot de passe de `gsf_api` : Laravel en aura besoin dans son fichier `server/.env` (`DB_PASSWORD`). Il n'est écrit nulle part ailleurs.

## Vérifier

```powershell
& $psql -U gsf_api -d gsfservice -h 127.0.0.1 -c "SELECT current_database(), current_user, now();"
```

## Repartir de zéro (efface tout !)

```powershell
& $psql -U postgres -c "DROP DATABASE gsfservice;" -c "DROP ROLE gsf_api;"
```
