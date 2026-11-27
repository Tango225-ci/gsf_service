import { Onglets } from '@/components/Onglets';

export default function LayoutAgent() {
  return (
    <Onglets
      onglets={[
        { nom: 'index', titre: 'Tâches', icone: 'checkbox-outline' },
        { nom: 'messages', titre: 'Messages', icone: 'chatbubbles-outline' },
        { nom: 'partenaires', titre: 'Partenaires', icone: 'business-outline' },
        { nom: 'profil', titre: 'Profil', icone: 'person-outline' },
      ]}
    />
  );
}
