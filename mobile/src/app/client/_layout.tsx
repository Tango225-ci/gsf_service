import { Onglets } from '@/components/Onglets';

export default function LayoutClient() {
  return (
    <Onglets
      onglets={[
        { nom: 'index', titre: 'Accueil', icone: 'home-outline' },
        { nom: 'demandes', titre: 'Demandes', icone: 'document-text-outline' },
        { nom: 'messages', titre: 'Messages', icone: 'chatbubbles-outline' },
        { nom: 'profil', titre: 'Profil', icone: 'person-outline' },
      ]}
    />
  );
}
