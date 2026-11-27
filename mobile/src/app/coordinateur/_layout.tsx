import { Onglets } from '@/components/Onglets';

export default function LayoutCoordinateur() {
  return (
    <Onglets
      onglets={[
        { nom: 'index', titre: 'À affecter', icone: 'git-branch-outline' },
        { nom: 'equipe', titre: 'Équipe', icone: 'people-outline' },
        { nom: 'messages', titre: 'Messages', icone: 'chatbubbles-outline' },
        { nom: 'profil', titre: 'Profil', icone: 'person-outline' },
      ]}
    />
  );
}
