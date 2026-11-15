// Appels API du Répertoire (Assane)
// ⚠️ Tout ce qui dépend du contrat du backend est ICI, et seulement ici :
//    - PARAM_NAMES : noms des paramètres de requête envoyés à l'API
//    - normalizeListResponse / normalizeCompany : forme de la réponse de GET /companies
// Si le backend change un nom, on corrige ce fichier et rien d'autre.
import api from '../../api/client';
import { PAGE_SIZE } from './constants';

// clé de filtre (front) -> nom du paramètre (API)
const PARAM_NAMES = {
  q: 'q',
  sector: 'sector',
  sub_sector: 'sub_sector',
  region: 'region',
  city: 'city',
  legal_form: 'legal_form',
  estimated_size: 'estimated_size',
  status: 'status',
  confidence_level: 'confidence_level',
  has_website: 'has_website',
  has_email: 'has_email',
  has_phone: 'has_phone',
};

// Ne garde que les filtres renseignés (pas de paramètres vides dans l'URL de l'API)
export function buildFilterParams(filters) {
  const params = {};
  for (const [key, value] of Object.entries(filters)) {
    if (value === '' || value === false || value == null) continue;
    params[PARAM_NAMES[key] ?? key] = value === true ? 'true' : value;
  }
  return params;
}

/* ---------- Normalisation de la réponse (accepte snake_case et camelCase) ---------- */

const pick = (obj, ...keys) => {
  for (const k of keys) {
    if (obj?.[k] != null && obj[k] !== '') return obj[k];
  }
  return '';
};

export function normalizeCompany(c) {
  const people = c.people ?? c.persons ?? c.dirigeants ?? [];
  const primary = people.find((p) => p.is_primary ?? p.isPrimary) ?? people[0];

  return {
    id: c.id ?? c._id,
    name: pick(c, 'name'),
    legalForm: pick(c, 'legal_form', 'legalForm'),
    sector: pick(c, 'sector'),
    subSector: pick(c, 'sub_sector', 'subSector'),
    region: pick(c, 'region'),
    city: pick(c, 'city'),
    estimatedSize: pick(c, 'size', 'estimated_size', 'estimatedSize'),
    status: pick(c, 'status'),
    confidenceScore: Number(pick(c, 'confidence_score', 'confidenceScore')) || 0,
    updatedAt: pick(c, 'updated_at', 'updatedAt'),
    leaderName: primary
      ? pick(primary, 'full_name', 'fullName', 'name')
      : pick(c, 'primary_contact_name', 'leader_name', 'leaderName'),
    leaderTitle: primary
      ? pick(primary, 'title', 'role')
      : pick(c, 'primary_contact_role', 'leader_title', 'leaderTitle'),
  };
}

export function normalizeListResponse(data) {
  const rawItems = Array.isArray(data)
    ? data
    : data?.items ?? data?.data ?? data?.companies ?? data?.results ?? [];

  const total = Number(
    data?.total ?? data?.pagination?.total ?? data?.meta?.total ?? data?.count ?? rawItems.length
  );
  const totalPages =
    Number(
      data?.totalPages ?? data?.total_pages ?? data?.pagination?.totalPages ?? data?.meta?.totalPages
    ) || Math.max(1, Math.ceil(total / PAGE_SIZE));

  return { items: rawItems.map(normalizeCompany), total, totalPages };
}

/* ---------- Appels ---------- */

// GET /companies?q=...&region=...&page=1&limit=15
export async function fetchCompanies(filters, page, signal) {
  const { data } = await api.get('/companies', {
    params: { ...buildFilterParams(filters), page, limit: PAGE_SIZE },
    signal,
  });
  return normalizeListResponse(data);
}

// GET /companies/export?q=...&region=...  -> fichier CSV de TOUS les résultats filtrés
// (sans page ni limit : on exporte tout, pas seulement la page affichée)
export async function exportCompanies(filters, ids = []) {
  const res = await api.get('/companies/export', {
    params: { ...buildFilterParams(filters), ...(ids.length ? { ids: ids.join(',') } : {}) },
    responseType: 'blob',
  });

  const disposition = res.headers?.['content-disposition'] ?? '';
  const match = disposition.match(/filename\*?=(?:UTF-8'')?"?([^";]+)"?/i);
  const filename = match
    ? decodeURIComponent(match[1])
    : `elikia-entreprises-${new Date().toISOString().slice(0, 10)}.csv`;

  const url = URL.createObjectURL(res.data);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function getErrorMessage(err) {
  if (!err.response) return 'Impossible de joindre le serveur. Vérifiez votre connexion et que le backend est lancé.';
  if (err.response.status === 403) return 'Vous n’avez pas les droits pour effectuer cette action.';
  return 'Une erreur est survenue côté serveur. Réessayez dans un instant.';
}

// DELETE /companies/:id (admin)
export const deleteCompany = (id) => api.delete(`/companies/${id}`);
