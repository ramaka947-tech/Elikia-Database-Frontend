// Faux backend (adaptateur Axios) : permet de développer le front sans API.
// Il imite le contrat de GET /companies, /companies/export, DELETE /companies/:id, /auth/*, /lists.
// Désactivation : VITE_USE_MOCK=false dans .env
import { SECTORS, REGIONS } from '../components/repertoire/constants';

const FIRST = ['Cheikh', 'Ibrahima', 'Mamadou', 'Fatou', 'Ndeye', 'Babacar', 'Awa', 'Moussa', 'Aïssatou', 'Ousmane', 'Mariama', 'Abdoulaye', 'Khady', 'Samba', 'Aminata'];
const LAST = ['Sall', 'Konaté', 'Diallo', 'Sow', 'Gueye', 'Cissé', 'Ndiaye', 'Fall', 'Ba', 'Diop', 'Faye', 'Sy', 'Thiam', 'Mbaye'];
const TITLES = ['Directeur Général', 'Président Directeur Général', 'Gérant', 'Associée Gérante', 'CEO & Fondateur', 'Directrice Générale'];
const PREFIX = ['Teranga', 'Baobab', 'Sahel', 'Atlantique', 'Kora', 'Lac Rose', 'Casamance', 'Sine', 'Ndiaye', 'Gorée', 'Thioubalel', 'Jolof', 'Saloum', 'Almadies', 'Ngor', 'Yoff', 'Médina', 'Plateau', 'Bantou', 'Kaay', 'Sunu', 'Jàmm', 'Dem', 'Wouri', 'Niokolo'];
const SUFFIX = ['Technologies', 'Conseil', 'Industries', 'Logistique', 'Services', 'Énergie', 'Distribution', 'Construction', 'Agro', 'Partners'];
const FORMS = ['SARL', 'SA', 'SAS', 'SUARL', 'GIE'];
const SIZES = ['micro', 'TPE', 'PME', 'grande'];

// 6 premières fiches = celles de la maquette
const SEED = [
  ['Teranga Pay Technologies', 'SAS', 0, 0, 'Dakar', 'Dakar', 'Cheikh Tidiane Sall', 'Directeur Général & Co-fondateur', 'PME', 94, '2026-11-05'],
  ['Diamniadio Génie Civil', 'SA', 2, 0, 'Dakar', 'Diamniadio', 'Ibrahima Konaté', 'Président Directeur Général', 'grande', 96, '2026-11-09'],
  ['Atlantique Transit & Fret', 'SARL', 4, 0, 'Dakar', 'Dakar', 'Mamadou Lamine Diallo', 'Directeur Général', 'PME', 92, '2026-11-04'],
  ['Keur Digital Studio', 'SARL', 0, 1, 'Dakar', 'Dakar', 'Fatou Kiné Sow', 'CEO & Product Lead', 'TPE', 95, '2026-11-10'],
  ['Almadies Conseil & Audit', 'SARL', 6, 0, 'Dakar', 'Dakar', 'Ndeye Penda Gueye', 'Associée Gérante', 'PME', 97, '2026-11-11'],
  ['Dakar Express Logistique', 'SARL', 4, 1, 'Dakar', 'Pikine', 'Babacar Cissé', 'Directeur Général', 'PME', 90, '2026-11-08'],
];
const mk = (i, name, form, si, ssi, region, city, leader, title, size, score, date) => ({
  id: i + 1, name, legal_form: form,
  sector: SECTORS[si].name, sub_sector: SECTORS[si].subSectors[ssi % SECTORS[si].subSectors.length],
  region, city, estimated_size: size, status: i % 11 === 5 ? 'a_verifier' : i % 17 === 3 ? 'inactif' : 'actif',
  confidence_score: score, updated_at: date, primary_contact_name: leader, primary_contact_role: title,
  ninea: String(1000000 + i * 7919).slice(0, 7) + 'V2', rccm: `SN.DKR.${2015 + (i % 10)}.B.${1000 + i * 3}`,
  has_website: i % 3 !== 0, has_email: i % 4 !== 0, has_phone: i % 5 !== 0,
});

const regionNames = Object.keys(REGIONS);
const COMPANIES = [
  ...SEED.map((s, i) => mk(i, ...s)),
  // 244 fiches générées : 81 à Dakar -> 87 au total (comme sur la maquette)
  ...Array.from({ length: 244 }, (_, j) => {
    const i = j + SEED.length;
    const region = (j * 37) % 244 < 81 ? 'Dakar' : regionNames[1 + (j % (regionNames.length - 1))];
    const city = REGIONS[region][j % REGIONS[region].length];
    const si = (j * 3) % SECTORS.length;
    const day = String(1 + ((j * 7) % 14)).padStart(2, '0');
    return mk(i, `${PREFIX[j % 25]} ${SUFFIX[Math.floor(j / 25) % 10]}`, FORMS[j % 5], si, j, region, city,
      `${FIRST[j % 15]} ${LAST[(j * 3) % 14]}`, TITLES[j % 6], SIZES[(j * 5) % 4],
      35 + ((j * 29) % 64), `2026-${j % 4 === 0 ? '10' : '11'}-${day}`);
  }),
].slice(0, 250);
// les noms doivent rester uniques
COMPANIES.forEach((c, i) => { if (COMPANIES.findIndex((o) => o.name === c.name) !== i) c.name += ` ${c.city}`; });

const USER = { id: 1, name: 'Aminata Diop', email: 'admin@elikia.sn', role: 'ADMIN' };
const level = (s) => (s >= 80 ? 'high' : s >= 55 ? 'medium' : 'low');
const norm = (s) => String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

function filterCompanies(p = {}) {
  const q = p.q ? norm(p.q) : '';
  const ids = p.ids ? String(p.ids).split(',').map(Number) : null;
  return COMPANIES.filter((c) =>
    (!ids || ids.includes(c.id)) &&
    (!q || norm([c.name, c.primary_contact_name, c.sector, c.sub_sector, c.city, c.ninea, c.rccm].join(' ')).includes(q)) &&
    ['sector', 'sub_sector', 'region', 'city', 'legal_form', 'estimated_size', 'status'].every((k) => !p[k] || c[k] === p[k]) &&
    (!p.confidence_level || level(c.confidence_score) === p.confidence_level) &&
    (!p.has_website || c.has_website) && (!p.has_email || c.has_email) && (!p.has_phone || c.has_phone)
  );
}

function toCsv(rows) {
  const cols = ['name', 'legal_form', 'sector', 'sub_sector', 'region', 'city', 'primary_contact_name', 'primary_contact_role', 'estimated_size', 'status', 'confidence_score', 'updated_at'];
  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  return '\uFEFF' + [cols.join(','), ...rows.map((r) => cols.map((c) => esc(r[c])).join(','))].join('\n');
}

function route(method, url, params, body) {
  if (url === '/auth/login' && method === 'post') {
    return body.email === USER.email && body.password === 'Admin123!'
      ? [200, { token: 'mock-token', user: USER }] : [401, { message: 'Email ou mot de passe incorrect' }];
  }
  if (url === '/auth/me') return [200, USER];
  if (url === '/lists') return [200, [{ id: 1, name: 'Prospects fintech' }, { id: 2, name: 'BTP Dakar' }, { id: 3, name: 'À contacter' }]];
  if (url === '/companies/export') {
    return [200, new Blob([toCsv(filterCompanies(params))], { type: 'text/csv' }), { 'content-disposition': 'attachment; filename="elikia-entreprises.csv"' }];
  }
  const one = url.match(/^\/companies\/(\d+)$/);
  if (one) {
    const idx = COMPANIES.findIndex((c) => c.id === Number(one[1]));
    if (idx < 0) return [404, { message: 'Introuvable' }];
    if (method === 'delete') { COMPANIES.splice(idx, 1); return [204, null]; }
    return [200, COMPANIES[idx]];
  }
  if (url === '/companies') {
    const rows = filterCompanies(params);
    const limit = Number(params.limit) || 15;
    const page = Number(params.page) || 1;
    return [200, { items: rows.slice((page - 1) * limit, page * limit), total: rows.length, page, totalPages: Math.max(1, Math.ceil(rows.length / limit)) }];
  }
  return [404, { message: 'Route simulée inconnue' }];
}

export default function mockAdapter(config) {
  const url = config.url.replace(config.baseURL || '', '');
  const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
  const [status, data, headers = {}] = route((config.method || 'get').toLowerCase(), url, config.params, body);
  const response = { data, status, statusText: String(status), headers, config };
  return new Promise((resolve, reject) =>
    setTimeout(() => (status < 400 ? resolve(response) : reject(Object.assign(new Error('Mock error'), { config, response }))), 250)
  );
}
