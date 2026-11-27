import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Chargement } from '@/components/ui';
import { FournisseurSession, useSession } from '@/lib/session';

/**
 * Une seule app, trois interfaces : chaque rôle n'a accès qu'à son dossier
 * (client/, agent/ ou coordinateur/). Sans session : écran de connexion.
 */
function Navigation() {
  const { chargement, utilisateur } = useSession();
  if (chargement) return <Chargement />;
  const role = utilisateur?.role;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!utilisateur}>
        <Stack.Screen name="connexion" />
      </Stack.Protected>
      <Stack.Protected guard={role === 'client'}>
        <Stack.Screen name="client" />
      </Stack.Protected>
      <Stack.Protected guard={role === 'agent'}>
        <Stack.Screen name="agent" />
      </Stack.Protected>
      <Stack.Protected guard={role === 'coordinateur'}>
        <Stack.Screen name="coordinateur" />
      </Stack.Protected>
    </Stack>
  );
}

export default function Racine() {
  return (
    <FournisseurSession>
      <StatusBar style="dark" />
      <Navigation />
    </FournisseurSession>
  );
}
