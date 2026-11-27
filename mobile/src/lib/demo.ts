/**
 * Données FICTIVES pour tester les écrans avant de brancher l'API.
 * Elles reprennent les maquettes (docs/gsf-maquettes.html) et le catalogue de démonstration du serveur.
 * À remplacer écran par écran par les appels à l'API, au fil des lots.
 */
import type { RoleApp } from './types';

/**
 * Comptes de démonstration « déjà inscrits », pour tester la connexion. Tout autre numéro ou email est inconnu.
 * Les emails du personnel sont les mêmes que ceux du back-office (server/database/seeders/DemoSeeder.php).
 */
export const COMPTES_DEMO: { identifiants: string[]; role: RoleApp; nom: string; description: string }[] = [
  { identifiants: ['+33612345678', 'aicha@client.test'], role: 'client', nom: 'Aïcha Koné', description: 'Client · Paris' },
  { identifiants: ['+2250700000011', 'yao@gsf.test'], role: 'agent', nom: 'Yao K.', description: 'Agent · séjour et démarches' },
  { identifiants: ['+2250700000013', 'didier@gsf.test'], role: 'agent', nom: 'Didier K.', description: 'Agent géomètre · foncier' },
  { identifiants: ['+2250700000010', 'coordinateur@gsf.test'], role: 'coordinateur', nom: 'Mariam C.', description: 'Coordinatrice' },
];

/** Email en minuscules ; numéro réduit à ses chiffres, avec le « + » de l'indicatif. */
export const normaliserIdentifiant = (valeur: string) => {
  const v = valeur.trim().toLowerCase();
  return v.includes('@') ? v : v.replace(/(?!^\+)[^\d]/g, '');
};

export const compteDemo = (valeur: string) => COMPTES_DEMO.find((c) => c.identifiants.includes(normaliserIdentifiant(valeur)));

export const estInscrit = (valeur: string) => compteDemo(valeur) !== undefined;

export type ModeTarif = 'fixe' | 'unite' | 'des' | 'devis';
export type Categorie = 'sejour' | 'demarches' | 'foncier' | 'autre';

export interface ChampFormulaire {
  cle: string;
  libelle: string;
  type: 'texte' | 'nombre' | 'date' | 'periode' | 'choix' | 'choixMultiple' | 'fichier' | 'vol' | 'terrain';
  requis?: boolean;
  options?: string[];
  exemple?: string;
}

export interface Service {
  slug: string;
  nom: string;
  categorie: Categorie;
  mode: ModeTarif;
  unite?: 'nuit' | 'jour' | 'mois';
  des?: number;
  fraisGsf?: number;
  description: string;
  inclus?: string[];
  formules?: { libelle: string; capacite?: string; prix: number }[];
  options?: { libelle: string; montant: number | null }[];
  fraisOfficiels?: { libelle: string; montant: number }[];
  champs: ChampFormulaire[];
}

export const CATEGORIES: Record<Categorie, { nom: string; icone: string; prixIndicatif: string }> = {
  sejour: { nom: 'Séjour et mobilité', icone: 'bed-outline', prixIndicatif: 'dès 25 000 F' },
  demarches: { nom: 'Démarches administratives', icone: 'document-text-outline', prixIndicatif: 'dès 10 000 F' },
  foncier: { nom: 'Foncier et terrains', icone: 'map-outline', prixIndicatif: 'dès 30 000 F' },
  autre: { nom: 'Autre demande', icone: 'help-circle-outline', prixIndicatif: 'Sur devis' },
};

const periode: ChampFormulaire = { cle: 'dates', libelle: 'Dates', type: 'periode', requis: true, exemple: '18 déc. → 30 déc. 2026' };
const terrain: ChampFormulaire = { cle: 'terrain', libelle: 'Terrain concerné', type: 'terrain', requis: true };
const pieceIdentite: ChampFormulaire = { cle: 'piece', libelle: "Pièce d'identité", type: 'fichier', requis: true };

export const SERVICES: Service[] = [
  {
    slug: 'residence-meublee', nom: 'Résidence meublée', categorie: 'sejour', mode: 'des', unite: 'nuit', des: 35000,
    description: 'GSF trouve la résidence qui correspond à vos critères dans son réseau de partenaires, puis vous envoie des propositions.',
    inclus: ['Visite et photos par votre agent', 'Ménage et état des lieux', 'Remise des clés'],
    champs: [
      periode,
      { cle: 'lieu', libelle: 'Lieu souhaité', type: 'texte', requis: true, exemple: 'Abidjan · Cocody ou Riviera' },
      { cle: 'voyageurs', libelle: 'Voyageurs', type: 'texte', requis: true, exemple: '2 adultes, 2 enfants' },
      { cle: 'equipements', libelle: 'Options résidence', type: 'choixMultiple', options: ['3 chambres', 'Climatisation', 'Groupe électrogène', 'Piscine', 'Gardien'] },
      { cle: 'budget', libelle: 'Budget par nuit', type: 'texte', exemple: '40 000 – 60 000 FCFA' },
    ],
  },
  {
    slug: 'location-vehicule', nom: 'Location de véhicule', categorie: 'sejour', mode: 'des', unite: 'jour', des: 25000,
    description: 'Avec ou sans chauffeur, remis où vous le souhaitez, y compris à l’aéroport.',
    champs: [
      periode,
      { cle: 'chauffeur', libelle: 'Avec chauffeur', type: 'choix', requis: true, options: ['Oui', 'Non'] },
      { cle: 'type', libelle: 'Type de véhicule', type: 'choix', options: ['Berline', 'SUV', 'Minibus'] },
      { cle: 'remise', libelle: 'Lieu de remise', type: 'texte', requis: true, exemple: 'Aéroport FHB' },
    ],
  },
  {
    slug: 'accueil-aeroport', nom: "Accueil à l'aéroport", categorie: 'sejour', mode: 'fixe', des: 25000, fraisGsf: 5000,
    description: "Un agent GSF vous attend à la sortie de l'aéroport Félix-Houphouët-Boigny avec une pancarte à votre nom, puis vous conduit à votre logement.",
    inclus: ['Suivi du vol', 'Pancarte nominative', "1 h d'attente incluse"],
    formules: [
      { libelle: 'Berline', capacite: '1 à 3 pers.', prix: 25000 },
      { libelle: 'SUV', capacite: '1 à 4 pers.', prix: 35000 },
      { libelle: 'Minibus', capacite: '5 à 8 pers.', prix: 50000 },
    ],
    options: [
      { libelle: 'Arrivée entre 22 h et 6 h', montant: 10000 },
      { libelle: 'Puce téléphonique chargée', montant: 5000 },
      { libelle: 'Destination hors Abidjan', montant: null },
    ],
    champs: [
      { cle: 'vol', libelle: 'Vol', type: 'vol', requis: true, exemple: 'AF702 · 18 déc. 21:35' },
      { cle: 'passagers', libelle: 'Passagers', type: 'nombre', requis: true, exemple: '4' },
      { cle: 'destination', libelle: 'Adresse de destination', type: 'texte', requis: true, exemple: 'Riviera 3, Cocody' },
    ],
  },
  {
    slug: 'extrait-acte-naissance', nom: "Extrait d'acte de naissance", categorie: 'demarches', mode: 'fixe', des: 10000, fraisGsf: 5000,
    description: "GSF retire votre extrait d'acte de naissance à la mairie, grâce à votre procuration signée dans l'app.",
    fraisOfficiels: [{ libelle: 'Timbre', montant: 500 }],
    champs: [
      { cle: 'commune', libelle: 'Commune', type: 'texte', requis: true, exemple: 'Yopougon' },
      { cle: 'nom', libelle: "Nom sur l'acte", type: 'texte', requis: true, exemple: 'KONÉ Aïcha Mariam' },
      pieceIdentite,
      { cle: 'reception', libelle: 'Réception du document', type: 'choix', requis: true, options: ['Remise à un proche à Abidjan', "Envoi par coursier à l'étranger"] },
    ],
  },
  {
    slug: 'casier-judiciaire', nom: 'Casier judiciaire', categorie: 'demarches', mode: 'fixe', des: 10000, fraisGsf: 5000,
    description: 'GSF demande et retire votre extrait de casier judiciaire.',
    fraisOfficiels: [{ libelle: 'Timbre', montant: 1000 }],
    champs: [{ cle: 'naissance', libelle: 'Lieu de naissance', type: 'texte', requis: true }, pieceIdentite],
  },
  {
    slug: 'certificat-nationalite', nom: 'Certificat de nationalité', categorie: 'demarches', mode: 'fixe', des: 15000, fraisGsf: 5000,
    description: 'GSF constitue le dossier et retire votre certificat de nationalité.',
    fraisOfficiels: [{ libelle: 'Timbre', montant: 1500 }],
    champs: [pieceIdentite, { cle: 'acte', libelle: 'Extrait de naissance', type: 'fichier', requis: true }],
  },
  {
    slug: 'legalisation-documents', nom: 'Légalisation de documents', categorie: 'demarches', mode: 'fixe', des: 10000, fraisGsf: 5000,
    description: 'GSF fait légaliser vos documents.',
    champs: [{ cle: 'documents', libelle: 'Documents à légaliser', type: 'fichier', requis: true }, { cle: 'nombre', libelle: 'Nombre de documents', type: 'nombre', requis: true }],
  },
  {
    slug: 'visite-terrain', nom: 'Visite de terrain', categorie: 'foncier', mode: 'fixe', des: 30000, fraisGsf: 5000,
    description: 'Un géomètre du cabinet GSF visite votre terrain : photos, vidéo, position GPS et rapport.',
    formules: [
      { libelle: 'Abidjan', prix: 30000 },
      { libelle: 'Bingerville', prix: 35000 },
      { libelle: 'Grand-Bassam', prix: 40000 },
    ],
    champs: [terrain],
  },
  {
    slug: 'verification-fonciere', nom: 'Vérification foncière', categorie: 'foncier', mode: 'fixe', des: 75000, fraisGsf: 10000,
    description: 'Authenticité des documents et situation du terrain.', champs: [terrain],
  },
  {
    slug: 'dossier-acd', nom: 'Dossier ACD', categorie: 'foncier', mode: 'devis',
    description: "Le cabinet de géomètres de GSF constitue votre dossier de demande d'ACD, le dépose au ministère et en assure le suivi jusqu'à la remise.",
    champs: [terrain],
  },
  {
    slug: 'bornage-plan-topo', nom: 'Bornage et plan topo', categorie: 'foncier', mode: 'devis',
    description: 'Par le cabinet de géomètres de GSF.', champs: [terrain],
  },
  {
    slug: 'entretien-gardiennage', nom: 'Entretien du terrain', categorie: 'foncier', mode: 'unite', unite: 'mois', des: 25000, fraisGsf: 5000,
    description: 'Débroussaillage et gardiennage.', champs: [terrain, { cle: 'mois', libelle: 'Nombre de mois', type: 'nombre', requis: true, exemple: '6' }],
  },
  {
    slug: 'suivi-construction', nom: 'Suivi de construction', categorie: 'foncier', mode: 'unite', unite: 'mois', des: 40000, fraisGsf: 5000,
    description: 'Photos et vidéo de votre chantier chaque semaine.', champs: [terrain, { cle: 'mois', libelle: 'Nombre de mois', type: 'nombre', requis: true, exemple: '6' }],
  },
  {
    slug: 'autre-demande', nom: 'Autre demande', categorie: 'autre', mode: 'devis',
    description: 'Décrivez votre besoin : GSF vous envoie un devis.',
    champs: [{ cle: 'besoin', libelle: 'Votre besoin', type: 'texte', requis: true, exemple: 'Récupérer un colis à Treichville…' }],
  },
];

export const service = (slug: string) => SERVICES.find((s) => s.slug === slug);

/** Prix affiché au catalogue : « dès 35 000 F / nuit », « 25 000 F / mois », « Sur devis ». */
export function prixAffiche(s: Service): string {
  if (s.mode === 'devis' || !s.des) return 'Sur devis';
  const montant = `${s.des.toLocaleString('fr-FR').replace(/ | /g, ' ')} F`;
  const unite = s.unite ? ` / ${s.unite}` : '';
  return s.mode === 'unite' ? `${montant}${unite}` : `dès ${montant}${unite}`;
}

// ————————————————————————— Demandes du client —————————————————————————

export type EtatEtape = 'fait' | 'encours' | 'avenir';

export interface Etape {
  titre: string;
  date?: string;
  detail?: string;
  photos?: number;
  etat: EtatEtape;
}

export interface Proposition {
  id: string;
  prestation: 'Résidence' | 'Véhicule';
  option: string;
  titre: string;
  details: string;
  prixUnitaire: number;
  unite: string;
  quantite: number;
  photo?: boolean;
}

export interface Demande {
  id: string;
  numero: string;
  titre: string;
  statut: string;
  couleur: 'marque' | 'accent' | 'retard' | 'discret';
  resume: string;
  agent?: { nom: string; telephone: string };
  etapes: Etape[];
  propositions?: Proposition[];
  expirationPropositions?: string;
}

export const DEMANDES: Demande[] = [
  {
    id: '0142', numero: 'GSF-2026-0142', titre: 'Séjour à Abidjan', statut: '2 propositions', couleur: 'accent',
    resume: '18 → 30 déc. 2026 · Résidence + véhicule + accueil aéroport',
    agent: { nom: 'Yao K.', telephone: '+225 07 00 00 00 11' },
    expirationPropositions: '02/12',
    etapes: [
      { titre: 'Demande envoyée', date: '24 nov.', etat: 'fait' },
      { titre: 'Prise en charge par Yao', date: '24 nov.', etat: 'fait' },
      { titre: 'Propositions envoyées', date: '26 nov.', etat: 'encours', detail: 'Choisissez une résidence et un véhicule avant le 02/12.' },
      { titre: 'Acompte et frais', etat: 'avenir' },
      { titre: 'Arrivée en préparation', etat: 'avenir' },
      { titre: "Accueil à l'aéroport · 18 déc.", etat: 'avenir' },
      { titre: 'Séjour en cours', etat: 'avenir' },
      { titre: 'Clôture et avis', etat: 'avenir' },
    ],
    propositions: [
      { id: 'pA', prestation: 'Résidence', option: 'Option A', titre: 'Villa 3 ch. · Riviera 3', details: 'Clim, groupe électrogène, gardien', prixUnitaire: 55000, unite: 'nuit', quantite: 12, photo: true },
      { id: 'pB', prestation: 'Résidence', option: 'Option B', titre: 'Appart. 3 ch. · Angré', details: 'Clim, ascenseur, parking', prixUnitaire: 45000, unite: 'nuit', quantite: 12, photo: true },
      { id: 'vA', prestation: 'Véhicule', option: 'Option A', titre: 'Toyota RAV4 + chauffeur', details: "Remise à l'aéroport", prixUnitaire: 35000, unite: 'jour', quantite: 12 },
    ],
  },
  {
    id: '0151', numero: 'GSF-2026-0151', titre: "Extrait d'acte de naissance", statut: 'En traitement', couleur: 'marque',
    resume: 'Mairie de Yopougon · payée en totalité',
    agent: { nom: 'Yao K.', telephone: '+225 07 00 00 00 11' },
    etapes: [
      { titre: 'Demande envoyée et payée · 15 500 F', date: '20 nov.', etat: 'fait' },
      { titre: 'Procuration signée', date: '20 nov.', etat: 'fait' },
      { titre: 'Déposé à la mairie', date: '21 nov.', etat: 'fait', photos: 1 },
      { titre: 'En traitement', date: '22 nov.', etat: 'encours', detail: "Dossier enregistré, retrait prévu jeudi selon l'agent de l'état civil." },
      { titre: 'Retrait du document', etat: 'avenir' },
      { titre: 'Remise à votre proche', etat: 'avenir' },
    ],
  },
  {
    id: '0161', numero: 'GSF-2026-0161', titre: 'Visite de terrain', statut: 'Terminée', couleur: 'discret',
    resume: 'Mon terrain de Bingerville · lot 112',
    agent: { nom: 'Didier K.', telephone: '+225 07 00 00 00 13' },
    etapes: [
      { titre: 'Demande envoyée et payée · 40 000 F', date: '18 nov.', etat: 'fait' },
      { titre: 'Visite planifiée', date: '19 nov.', etat: 'fait' },
      { titre: 'Visite effectuée', date: '22 nov.', etat: 'fait', photos: 4 },
      { titre: 'Rapport envoyé', date: '22 nov.', etat: 'fait' },
    ],
  },
];

export const demande = (id: string) => DEMANDES.find((d) => d.id === id);

// ————————————————————————— Mes biens, rapport de visite —————————————————————————

export const TERRAINS = [
  { id: 't1', libelle: 'Mon terrain de Bingerville', lieu: 'Bingerville · lot 112', surface: '500 m²', document: "Lettre d'attribution", demandes: 1 },
  { id: 't2', libelle: 'Terrain familial de Grand-Bassam', lieu: 'Grand-Bassam · lot 48', surface: '600 m²', document: 'Attestation villageoise', demandes: 0 },
];

export const RAPPORT_VISITE = {
  numero: 'GSF-2026-0161',
  terrain: 'Mon terrain de Bingerville · lot 112',
  gps: '5.3561 N · 3.8912 O',
  constats: [
    ['Position GPS', '5.3561 N · 3.8912 O'],
    ['Bornes retrouvées', '4 sur 4'],
    ['Occupation', 'Terrain libre'],
    ['Accès', 'Piste, 300 m du goudron'],
  ] as [string, string][],
  observations: 'Terrain conforme au plan fourni. Un voisin a commencé une clôture en limite nord, à vérifier lors d’un bornage.',
  agent: 'Didier K., géomètre',
};

// ————————————————————————— Messagerie —————————————————————————

export interface Conversation {
  id: string;
  demandeId: string;
  avec: string;
  titre: string;
  dernier: string;
  heure: string;
  nonLus: number;
  messages: { de: 'moi' | 'autre'; texte?: string; photos?: number; heure: string }[];
}

export const CONVERSATIONS: Conversation[] = [
  {
    id: 'c1', demandeId: '0142', avec: 'Yao K.', titre: 'Séjour à Abidjan', dernier: 'Oui, le propriétaire en installe un avant votre arrivée.', heure: '10:42', nonLus: 1,
    messages: [
      { de: 'autre', texte: "Bonjour Mme Koné, j'ai visité la villa ce matin. Voici les photos de la chambre principale.", heure: '10:15' },
      { de: 'autre', photos: 2, heure: '10:15' },
      { de: 'moi', texte: "Parfait, merci. Est-ce qu'il y a un lit bébé ?", heure: '10:31' },
      { de: 'autre', texte: 'Oui, le propriétaire en installe un avant votre arrivée.', heure: '10:42' },
    ],
  },
  {
    id: 'c2', demandeId: '0151', avec: 'Yao K.', titre: "Extrait d'acte de naissance", dernier: 'Retrait prévu jeudi.', heure: 'Hier', nonLus: 0,
    messages: [
      { de: 'autre', texte: 'Le dossier est bien enregistré à la mairie de Yopougon.', heure: '09:02' },
      { de: 'autre', photos: 1, heure: '09:02' },
      { de: 'autre', texte: 'Retrait prévu jeudi.', heure: '09:03' },
    ],
  },
];

export const conversation = (id: string) => CONVERSATIONS.find((c) => c.id === id);

// ————————————————————————— Côté agent —————————————————————————

export interface Tache {
  id: string;
  numero: string;
  titre: string;
  detail: string;
  sousDetail?: string;
  badge: string;
  urgence: 'retard' | 'aujourdhui' | 'normal' | 'nouvelle';
  type: 'demarche' | 'aeroport' | 'sejour' | 'vehicule' | 'visite';
}

export const TACHES: Tache[] = [
  { id: '0151', numero: 'GSF-2026-0151', titre: 'Acte de naissance', detail: 'Mairie de Yopougon', sousDetail: 'Délai cible dépassé de 1 jour', badge: 'Retard', urgence: 'retard', type: 'demarche' },
  { id: '0153', numero: 'GSF-2026-0153', titre: "Accueil à l'aéroport", detail: 'Aéroport FHB · vol AT555 · SUV', badge: 'Demain 06:40', urgence: 'aujourdhui', type: 'aeroport' },
  { id: '0142', numero: 'GSF-2026-0142', titre: 'Séjour à Abidjan', detail: 'A. Koné · arrivée le 18 déc.', badge: 'Propositions', urgence: 'normal', type: 'sejour' },
  { id: '0160', numero: 'GSF-2026-0160', titre: 'Location Toyota RAV4', detail: 'F. Diallo · remise aujourd’hui 15:00', badge: 'Remise', urgence: 'aujourdhui', type: 'vehicule' },
  { id: '0167', numero: 'GSF-2026-0167', titre: 'Visite de terrain', detail: 'K. N’Guessan · Bingerville · lot 112', badge: 'Aujourd’hui', urgence: 'aujourdhui', type: 'visite' },
  { id: '0158', numero: 'GSF-2026-0158', titre: 'Nouvelle demande', detail: 'Résidence · Assinie · 4 nuits', sousDetail: 'Affectée par le coordinateur ce matin', badge: 'Affectée', urgence: 'nouvelle', type: 'sejour' },
];

export const BIENS_PARTENAIRES = [
  { id: 'b1', nom: 'Villa Riviera 3', proprietaire: 'M. Bamba', zone: 'Cocody', prix: 55000, details: '3 ch. · clim, groupe électrogène, gardien' },
  { id: 'b2', nom: 'Appartement Angré', proprietaire: 'Mme Yao', zone: 'Cocody', prix: 45000, details: '3 ch. · clim, ascenseur, parking' },
  { id: 'b3', nom: 'Studio Zone 4', proprietaire: 'M. Kouassi', zone: 'Marcory', prix: 30000, details: '1 ch. · clim, wifi' },
];

export const VEHICULES_PARTENAIRES = [
  { id: 'v1', nom: 'Toyota RAV4', loueur: 'Abidjan Auto Location', prix: 35000, details: 'SUV · 5 places · chauffeur possible' },
  { id: 'v2', nom: 'Hyundai Accent', loueur: 'Abidjan Auto Location', prix: 25000, details: 'Berline · 5 places' },
];

// ————————————————————————— Côté coordinateur —————————————————————————

export interface DemandeAAffecter {
  id: string;
  numero: string;
  titre: string;
  detail: string;
  client: string;
  recue: string;
  badge: string;
  categorie: Categorie;
  urgente?: boolean;
}

export const A_AFFECTER: DemandeAAffecter[] = [
  { id: '0163', numero: 'GSF-2026-0163', titre: "Accueil à l'aéroport", detail: 'Aéroport FHB · vol AF702 · berline', client: 'A. Koné · Paris', recue: 'Reçue il y a 12 min', badge: 'Demain 06:40', categorie: 'sejour', urgente: true },
  { id: '0164', numero: 'GSF-2026-0164', titre: 'Dossier ACD', detail: 'Bingerville · lot 112', client: 'M. Diallo · Paris', recue: 'Reçue il y a 40 min', badge: 'Foncier', categorie: 'foncier' },
  { id: '0165', numero: 'GSF-2026-0165', titre: 'Séjour à Grand-Bassam', detail: 'Résidence, véhicule, aéroport', client: 'M. Traoré · Montréal', recue: 'Reçue il y a 1 h', badge: '3 services', categorie: 'sejour' },
  { id: '0166', numero: 'GSF-2026-0166', titre: 'Casier judiciaire', detail: 'Tribunal du Plateau', client: 'S. Kouassi · Abidjan', recue: 'Reçue il y a 2 h', badge: 'Démarche', categorie: 'demarches' },
];

export interface MembreEquipe {
  id: string;
  nom: string;
  poste: string;
  competences: Categorie[];
  zone: string;
  dossiers: number;
  disponible: boolean;
}

export const EQUIPE: MembreEquipe[] = [
  { id: 'e1', nom: 'Yao K.', poste: 'Agent', competences: ['sejour', 'demarches'], zone: 'Cocody, Plateau', dossiers: 6, disponible: true },
  { id: 'e2', nom: 'Awa D.', poste: 'Agent', competences: ['sejour', 'demarches'], zone: 'Marcory, Yopougon', dossiers: 3, disponible: true },
  { id: 'e3', nom: 'Didier K.', poste: 'Géomètre · cabinet GSF', competences: ['foncier'], zone: 'Est', dossiers: 4, disponible: true },
  { id: 'e4', nom: 'Awa S.', poste: 'Géomètre · cabinet GSF', competences: ['foncier'], zone: 'Ouest', dossiers: 7, disponible: true },
  { id: 'e5', nom: 'Koffi B.', poste: 'Agent', competences: ['sejour'], zone: 'Grand-Bassam, Assinie', dossiers: 2, disponible: false },
];
