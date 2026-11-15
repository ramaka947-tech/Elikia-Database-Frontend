// Liste des entreprises : sélection, ajout à une liste, modifier, supprimer.
// Cliquer sur une ligne ouvre la fiche (/entreprises/:id).
// Grand écran : tableau. Téléphone et tablette : une carte par entreprise.
// Le bouton « liste » ouvre la fenêtre Mes listes (AddToListButton, partagé avec la fiche).
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Pencil, Trash2, SearchX, MapPin } from 'lucide-react';
import AddToListButton from '../listes/AddToListButton';
import Button from '../ui/Button';
import StatusBadge from './StatusBadge';
import ConfidenceBar from './ConfidenceBar';
import { SIZE_LABELS } from './constants';

const formatDate = (v) => (v ? String(v).slice(0, 10) : '—');
const location = (c) => [c.city, c.region].filter(Boolean).join(', ') || '—';
const stop = (e) => e.stopPropagation();

// Vrai à partir de 1280 px (xl) : on n'affiche qu'une des deux présentations
function useWideScreen() {
  const query = '(min-width: 1280px)';
  const [wide, setWide] = useState(() => window.matchMedia?.(query).matches ?? true);
  useEffect(() => {
    const mq = window.matchMedia?.(query);
    if (!mq) return;
    const onChange = (e) => setWide(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return wide;
}

function SkeletonRows() {
  return (
    <div className="divide-y divide-line" aria-busy="true" aria-label="Chargement des entreprises">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-5 py-5 animate-pulse">
          <div className="h-4 w-4 rounded bg-slate-200" />
          <div className="flex-1 space-y-2"><div className="h-3.5 w-1/3 rounded bg-slate-200" /><div className="h-3 w-1/4 rounded bg-slate-100" /></div>
          <div className="hidden md:block h-3 w-24 rounded bg-slate-200" />
        </div>
      ))}
    </div>
  );
}

function EmptyState({ onReset, canReset }) {
  return (
    <div className="py-16 px-6 text-center max-w-md mx-auto">
      <SearchX size={36} className="mx-auto text-slate-300" aria-hidden="true" />
      <h3 className="mt-3 font-semibold text-lg text-navy">Aucune entreprise ne correspond</h3>
      <p className="mt-1 text-sm text-slate-500">Essayez d’élargir votre recherche ou de retirer certains filtres.</p>
      {canReset && <Button type="button" className="mt-5" onClick={onReset}>Réinitialiser les filtres</Button>}
    </div>
  );
}

export default function CompanyTable({
  companies, loading, onReset, canReset,
  selected, onToggle, onToggleAll, onDelete, isAdmin,
}) {
  const navigate = useNavigate();
  const wide = useWideScreen();
  if (loading && companies.length === 0) return <SkeletonRows />;
  if (companies.length === 0) return <EmptyState onReset={onReset} canReset={canReset} />;

  const allChecked = companies.every((c) => selected.has(c.id));
  const th = 'py-4 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500';

  const actions = (c) => (
    <div className="flex items-center justify-end gap-1">
      <AddToListButton companyId={c.id} compact />
      {isAdmin && (
        <>
          <Link to={`/entreprises/${c.id}/modifier`} aria-label={`Modifier ${c.name}`} className="p-2.5 rounded-full text-slate-400 hover:bg-slate-100 hover:text-navy">
            <Pencil size={16} />
          </Link>
          <button type="button" onClick={() => onDelete(c)} aria-label={`Supprimer ${c.name}`} className="p-2.5 rounded-full text-slate-400 hover:bg-red-50 hover:text-red-600">
            <Trash2 size={16} />
          </button>
        </>
      )}
    </div>
  );

  return (
    <div className={`transition-opacity ${loading ? 'opacity-50 pointer-events-none' : ''}`} aria-busy={loading}>
      {/* Téléphone et tablette : cartes */}
      {!wide && (
      <ul className="divide-y divide-line">
        {companies.map((c) => (
          <li key={c.id} className="p-4 flex gap-3">
            <input type="checkbox" checked={selected.has(c.id)} onChange={() => onToggle(c.id)} aria-label={`Sélectionner ${c.name}`} className="mt-1 w-4 h-4 accent-elikia shrink-0" />
            <div className="flex-1 min-w-0">
              <Link to={`/entreprises/${c.id}`} className="font-semibold text-navy hover:text-elikia">{c.name}</Link>
              <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
                {c.legalForm && <span>{c.legalForm}</span>}
                <StatusBadge status={c.status} />
              </div>
              <p className="mt-2 text-sm text-ink truncate">{c.sector || 'Secteur non renseigné'}{c.subSector && <span className="text-slate-500"> · {c.subSector}</span>}</p>
              <p className="mt-0.5 text-xs text-slate-500 flex items-center gap-1"><MapPin size={12} /> {location(c)}</p>
              <div className="mt-2 max-w-48"><ConfidenceBar score={c.confidenceScore} /></div>
            </div>
            <div className="shrink-0 self-start">{actions(c)}</div>
          </li>
        ))}
      </ul>
      )}

      {/* Grand écran : tableau */}
      {wide && (
      <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-line">
            <th className={`${th} pl-5 w-10`}>
              <input type="checkbox" checked={allChecked} onChange={onToggleAll} aria-label="Tout sélectionner" className="w-4 h-4 accent-elikia" />
            </th>
            <th className={th}>Entreprise</th>
            <th className={th}>Secteur</th>
            <th className={th}>Localisation</th>
            <th className={th}>Dirigeant principal</th>
            <th className={th}>Taille estimée</th>
            <th className={th}>Confiance</th>
            <th className={th}>Mise à jour</th>
            <th className={`${th} pr-5 text-right`}>Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {companies.map((c) => (
            <tr key={c.id} onClick={() => navigate(`/entreprises/${c.id}`)} className="group cursor-pointer hover:bg-slate-50/70 transition-colors">
              <td className="py-3.5 pl-5 px-3" onClick={stop}>
                <input type="checkbox" checked={selected.has(c.id)} onChange={() => onToggle(c.id)} aria-label={`Sélectionner ${c.name}`} className="w-4 h-4 accent-elikia" />
              </td>
              <td className="py-3.5 px-3">
                <Link to={`/entreprises/${c.id}`} onClick={stop} className="font-semibold text-navy group-hover:text-elikia focus:outline-none focus-visible:underline">
                  {c.name}
                </Link>
                <div className="mt-0.5 flex items-center gap-2 text-xs text-slate-500">
                  {c.legalForm && <span>{c.legalForm}</span>}
                  {c.legalForm && <span aria-hidden="true">·</span>}
                  <StatusBadge status={c.status} />
                </div>
              </td>
              <td className="py-3.5 px-3">
                <div className="font-medium text-ink">{c.sector || '—'}</div>
                <div className="text-xs text-slate-500">{c.subSector}</div>
              </td>
              <td className="py-3.5 px-3 whitespace-nowrap text-slate-700">{location(c)}</td>
              <td className="py-3.5 px-3">
                {c.leaderName ? (
                  <>
                    <div className="font-medium text-ink">{c.leaderName}</div>
                    <div className="text-xs text-slate-500 truncate max-w-[170px]">{c.leaderTitle}</div>
                  </>
                ) : <span className="italic text-slate-400">Non renseigné</span>}
              </td>
              <td className="py-3.5 px-3 text-slate-700">{SIZE_LABELS[c.estimatedSize] || c.estimatedSize || '—'}</td>
              <td className="py-3.5 px-3"><ConfidenceBar score={c.confidenceScore} /></td>
              <td className="py-3.5 px-3 whitespace-nowrap font-mono text-xs text-slate-500">{formatDate(c.updatedAt)}</td>
              <td className="py-3.5 pl-3 pr-5" onClick={stop}>
                {actions(c)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      )}
    </div>
  );
}
