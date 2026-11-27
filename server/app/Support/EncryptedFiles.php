<?php

namespace App\Support;

use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Storage;

/**
 * Stockage chiffré des documents sensibles (pièces d'identité, documents fonciers, procurations).
 * Le contenu est chiffré avec la clé de l'application (APP_KEY) avant d'être écrit sur le disque,
 * et déchiffré à la lecture. Le disque est celui de FILESYSTEM_DISK (local en développement, R2 en production).
 */
class EncryptedFiles
{
    public static function put(string $path, string $contents): void
    {
        Storage::put($path, Crypt::encryptString($contents));
    }

    public static function get(string $path): string
    {
        return Crypt::decryptString((string) Storage::get($path));
    }
}
