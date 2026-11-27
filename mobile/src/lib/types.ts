/** Rôles qui utilisent l'app mobile. Les managers et admins utilisent le back-office web. */
export type RoleApp = 'client' | 'agent' | 'coordinateur';

export interface Utilisateur {
  id: string;
  prenom: string;
  nom: string;
  telephone: string | null;
  email: string | null;
  role: RoleApp;
}
