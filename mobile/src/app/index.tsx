import { Redirect } from 'expo-router';
import { useSession } from '@/lib/session';

/**
 * Point d'entrée de l'app (« / ») : vers la connexion, ou vers l'espace du rôle si l'on est connecté.
 */
export default function Depart() {
  const { utilisateur } = useSession();
  if (!utilisateur) return <Redirect href="/connexion" />;
  return <Redirect href={`/${utilisateur.role}`} />;
}
