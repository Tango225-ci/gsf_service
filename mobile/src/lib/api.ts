import Constants from 'expo-constants';

/**
 * Adresse de l'API Laravel :
 * - EXPO_PUBLIC_API_URL si elle est définie (production) ;
 * - sinon, en développement, le PC qui fait tourner Expo (même Wi-Fi), port 8000
 *   (`php artisan serve --host=0.0.0.0` dans le dossier server).
 */
function adresseApi(): string {
  const configuree = process.env.EXPO_PUBLIC_API_URL;
  if (configuree) return configuree.replace(/\/$/, '');
  const hote = Constants.expoConfig?.hostUri?.split(':')[0];
  return `http://${hote ?? 'localhost'}:8000`;
}

export const URL_API = adresseApi();

export class ErreurApi extends Error {
  constructor(
    public statut: number,
    message: string,
    /** Erreurs de validation renvoyées par Laravel, par champ. */
    public champs: Record<string, string[]> = {},
  ) {
    super(message);
  }
}

let jetonCourant: string | null = null;
let surSessionExpiree: (() => void) | null = null;

export function definirJeton(jeton: string | null) {
  jetonCourant = jeton;
}

export function quandSessionExpiree(fn: () => void) {
  surSessionExpiree = fn;
}

type Methode = 'GET' | 'POST' | 'PATCH' | 'DELETE';

async function requete<T>(methode: Methode, chemin: string, corps?: unknown): Promise<T> {
  let reponse: Response;
  try {
    reponse = await fetch(`${URL_API}/api${chemin}`, {
      method: methode,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(jetonCourant ? { Authorization: `Bearer ${jetonCourant}` } : {}),
      },
      body: corps === undefined ? undefined : JSON.stringify(corps),
    });
  } catch {
    throw new ErreurApi(0, `Serveur injoignable (${URL_API}). Vérifiez que le PC et le téléphone sont sur le même Wi-Fi.`);
  }

  if (reponse.status === 204) return undefined as T;
  const donnees = await reponse.json().catch(() => ({}));
  if (!reponse.ok) {
    if (reponse.status === 401 && jetonCourant) surSessionExpiree?.();
    // Erreur de validation Laravel (422) : { message, errors: { champ: [messages] } }
    const champs: Record<string, string[]> = donnees.errors ?? {};
    const premier = Object.values(champs)[0]?.[0];
    throw new ErreurApi(reponse.status, premier ?? donnees.message ?? `Erreur ${reponse.status}`, champs);
  }
  return donnees as T;
}

export const api = {
  get: <T>(chemin: string) => requete<T>('GET', chemin),
  post: <T>(chemin: string, corps?: unknown) => requete<T>('POST', chemin, corps ?? {}),
  patch: <T>(chemin: string, corps: unknown) => requete<T>('PATCH', chemin, corps),
  delete: (chemin: string) => requete<void>('DELETE', chemin),
};

export const messageErreur = (e: unknown) => (e instanceof Error ? e.message : 'Une erreur est survenue');
