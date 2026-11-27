import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { api, definirJeton, quandSessionExpiree } from './api';
import { stockage } from './stockage';
import type { RoleApp, Utilisateur } from './types';

const CLE_JETON = 'gsfservice.jeton';

interface Session {
  chargement: boolean;
  utilisateur: Utilisateur | null;
  /** Ouvre la session avec le jeton Sanctum reçu de l'API (connexion par code : lot 1). */
  ouvrirSession(jeton: string, utilisateur: Utilisateur): Promise<void>;
  deconnecter(): Promise<void>;
  rafraichir(): Promise<void>;
  /**
   * Développement uniquement, en attendant la connexion (lot 1) :
   * entre dans l'app avec un rôle choisi, sans compte ni serveur.
   */
  entrerEnDemo(role: RoleApp): void;
}

const ContexteSession = createContext<Session | null>(null);

const PRENOMS_DEMO: Record<RoleApp, string> = { client: 'Aïcha', agent: 'Yao', coordinateur: 'Mariam' };

export function FournisseurSession({ children }: { children: ReactNode }) {
  const [chargement, setChargement] = useState(true);
  const [utilisateur, setUtilisateur] = useState<Utilisateur | null>(null);

  const deconnecter = useCallback(async () => {
    definirJeton(null);
    setUtilisateur(null);
    await stockage.supprimer(CLE_JETON);
  }, []);

  const ouvrirSession = useCallback(async (jeton: string, u: Utilisateur) => {
    definirJeton(jeton);
    await stockage.ecrire(CLE_JETON, jeton);
    setUtilisateur(u);
  }, []);

  // Au lancement : reprendre la session enregistrée, si elle est encore valide
  useEffect(() => {
    quandSessionExpiree(() => void deconnecter());
    (async () => {
      try {
        const jeton = await stockage.lire(CLE_JETON);
        if (jeton) {
          definirJeton(jeton);
          setUtilisateur(await api.get<Utilisateur>('/moi'));
        }
      } catch {
        await deconnecter();
      } finally {
        setChargement(false);
      }
    })();
  }, [deconnecter]);

  const valeur = useMemo<Session>(
    () => ({
      chargement,
      utilisateur,
      ouvrirSession,
      deconnecter,
      async rafraichir() {
        setUtilisateur(await api.get<Utilisateur>('/moi'));
      },
      entrerEnDemo(role) {
        if (!__DEV__) return;
        setUtilisateur({ id: `demo-${role}`, prenom: PRENOMS_DEMO[role], nom: 'Démo', telephone: null, email: null, role });
      },
    }),
    [chargement, utilisateur, ouvrirSession, deconnecter],
  );

  return <ContexteSession.Provider value={valeur}>{children}</ContexteSession.Provider>;
}

export function useSession(): Session {
  const s = useContext(ContexteSession);
  if (!s) throw new Error('useSession doit être utilisé dans <FournisseurSession>');
  return s;
}
