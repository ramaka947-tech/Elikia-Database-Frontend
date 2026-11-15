// Constantes du Répertoire (Assane)
// Catalogue repris de la maquette elikia-database. Si le backend expose ces listes
// (ex : GET /meta), on pourra les remplacer sans toucher aux composants.

export const PAGE_SIZE = 15;

export const SECTORS = [
  { name: 'Technologies & Numérique', subSectors: ['Fintech & Paiements', 'Développement logiciel & IT', 'Télécommunications', 'E-commerce & Plateformes', 'Cybersécurité & Cloud'] },
  { name: 'Agro-industrie & Agriculture', subSectors: ['Transformation agroalimentaire', 'Horticulture & Export', 'Aviculture & Élevage', 'Pêche & Halieutique', 'Intrants & Équipements agricoles'] },
  { name: 'BTP & Immobilier', subSectors: ['Génie civil & Infrastructures', 'Promotion immobilière', 'Matériaux de construction', 'Architecture & Ingénierie'] },
  { name: 'Commerce & Distribution', subSectors: ['Grande distribution', 'Import-Export & Négoce', 'Distribution pharmaceutique', 'Équipements industriels'] },
  { name: 'Transport & Logistique', subSectors: ['Fret & Transit portuaire', 'Logistique du dernier kilomètre', 'Transport de voyageurs', 'Entreposage & Chaîne du froid'] },
  { name: 'Énergie & Environnement', subSectors: ['Énergie solaire & Renouvelables', 'Hydrocarbures & Distribution', 'Gestion des déchets & Eau', 'Efficacité énergétique'] },
  { name: 'Services B2B & Conseil', subSectors: ['Audit, Expertise & Juridique', 'Conseil en stratégie & RH', 'Communication & Marketing', 'Sécurité & Facility Management'] },
  { name: 'Finance & Assurance', subSectors: ['Banque & Microfinance', 'Assurance & Courtage', 'Fonds d’investissement & Capital'] },
  { name: 'Industrie & Manufacture', subSectors: ['Chimie & Plasturgie', 'Emballage & Imprimerie', 'Textile & Confection', 'Métallurgie & Mécanique'] },
  { name: 'Santé & Éducation', subSectors: ['Cliniques & Laboratoires', 'Enseignement supérieur & EdTech', 'Formation professionnelle'] },
];

export const REGIONS = {
  Dakar: ['Dakar', 'Pikine', 'Guédiawaye', 'Rufisque', 'Diamniadio', 'Keur Massar'],
  Thiès: ['Thiès', 'Mbour', 'Tivaouane', 'Saly'],
  'Saint-Louis': ['Saint-Louis', 'Richard-Toll', 'Dagana', 'Podor'],
  Diourbel: ['Diourbel', 'Touba', 'Mbacké', 'Bambey'],
  Kaolack: ['Kaolack', 'Guinguinéo', 'Nioro du Rip'],
  Ziguinchor: ['Ziguinchor', 'Bignona', 'Oussouye'],
  Louga: ['Louga', 'Linguère', 'Kébémer'],
  Tambacounda: ['Tambacounda', 'Bakel', 'Goudiry'],
  Fatick: ['Fatick', 'Foundiougne', 'Gossas'],
  Kolda: ['Kolda', 'Vélingara', 'Médina Yoro Foulah'],
  Matam: ['Matam', 'Ourossogui', 'Kanel'],
  Kaffrine: ['Kaffrine', 'Koungheul', 'Birkelane'],
  Kédougou: ['Kédougou', 'Saraya', 'Salémata'],
  Sédhiou: ['Sédhiou', 'Goudomp', 'Bounkiling'],
};

export const LEGAL_FORMS = ['SARL', 'SA', 'SAS', 'SUARL', 'GIE', 'EI', 'SNC', 'Association'];

// value = valeur stockée en base (companies.size) ; label = texte affiché
export const COMPANY_SIZES = [
  { value: 'micro', label: 'Micro' },
  { value: 'TPE', label: 'TPE' },
  { value: 'PME', label: 'PME' },
  { value: 'grande', label: 'Grande entreprise' },
];
export const SIZE_LABELS = Object.fromEntries(COMPANY_SIZES.map((s) => [s.value, s.label]));

export const STATUSES = [
  { value: 'actif', label: 'Actif' },
  { value: 'a_verifier', label: 'À vérifier' },
  { value: 'inactif', label: 'Inactif' },
];

export const CONFIDENCE_LEVELS = [
  { value: 'high', label: 'Élevé (≥ 80 %)' },
  { value: 'medium', label: 'Moyen (55 % – 79 %)' },
  { value: 'low', label: 'Faible (< 55 %)' },
];

// État initial des filtres. Les clés servent aussi de noms dans l'URL du navigateur
// (/entreprises?q=sonatel&region=Dakar&page=2) : le retour depuis une fiche garde donc la recherche.
export const DEFAULT_FILTERS = {
  q: '',
  sector: '',
  sub_sector: '',
  region: '',
  city: '',
  legal_form: '',
  estimated_size: '',
  status: '',
  confidence_level: '',
  has_website: false,
  has_email: false,
  has_phone: false,
};

export const BOOLEAN_FILTERS = ['has_website', 'has_email', 'has_phone'];
