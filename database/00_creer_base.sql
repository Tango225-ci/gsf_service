-- =====================================================================
--  GSF Service : création de la base et du compte utilisé par Laravel
--  À exécuter UNE SEULE FOIS, connecté en super-utilisateur (postgres).
--  Les tables ne sont PAS créées ici : ce sont les migrations Laravel
--  (php artisan migrate) qui s'en chargent.
-- =====================================================================
SET client_encoding = 'UTF8';

-- Compte de connexion dédié à l'application (le mot de passe est demandé
-- à l'écran, il n'est jamais écrit dans ce fichier).
\prompt 'Mot de passe a donner au compte PostgreSQL gsf_api : ' mdp_api
CREATE ROLE gsf_api LOGIN PASSWORD :'mdp_api';

-- La base elle-même, en UTF-8, propriété du compte de l'application
CREATE DATABASE gsfservice
  OWNER gsf_api
  ENCODING 'UTF8'
  TEMPLATE template0;

-- Toute l'application travaille à l'heure GMT (UTC)
ALTER DATABASE gsfservice SET timezone TO 'UTC';
