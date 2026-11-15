// Responsable : Assane
// Appels API : GET /companies?..., GET /companies/export?...  (voir components/repertoire/api.js)
// Le titre de la page est déjà affiché dans la barre du haut (Topbar).
import { useEffect, useMemo, useState } from 'react';
import { isCancel } from 'axios';
import { AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';

import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import SearchBar from '../components/repertoire/SearchBar';
import FilterPanel from '../components/repertoire/FilterPanel';
import CompanyTable from '../components/repertoire/CompanyTable';
import Pagination from '../components/repertoire/Pagination';
import ExportButton from '../components/repertoire/ExportButton';
import useRepertoireParams from '../components/repertoire/useRepertoireParams';
import { useAuth } from '../context/AuthContext';
import { fetchCompanies, deleteCompany, getErrorMessage } from '../components/repertoire/api';
import { DEFAULT_FILTERS } from '../components/repertoire/constants';

export default function Repertoire() {
  const { filters, page, setFilter, setPage, reset } = useRepertoireParams();

  const [result, setResult] = useState({ items: [], total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [notice, setNotice] = useState(null); // { type: 'success' | 'error', message }
  const { isAdmin } = useAuth();
  const [selected, setSelected] = useState(() => new Set());
  const [saved, setSaved] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem('elikia:saved') || '[]')); } catch { return new Set(); }
  });

  const toggleSaved = (id) => setSaved((prev) => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    localStorage.setItem('elikia:saved', JSON.stringify([...next]));
    return next;
  });
  const toggleOne = (id) => setSelected((prev) => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });
  const toggleAll = () => setSelected((prev) => {
    const ids = result.items.map((c) => c.id);
    return ids.every((id) => prev.has(id)) ? new Set() : new Set(ids);
  });

  async function handleDelete(c) {
    if (!window.confirm(`Supprimer « ${c.name} » ? Cette action est définitive.`)) return;
    try {
      await deleteCompany(c.id);
      setNotice({ type: 'success', message: `« ${c.name} » a été supprimée.` });
      setReloadKey((k) => k + 1);
    } catch (err) {
      setNotice({ type: 'error', message: `Suppression impossible : ${getErrorMessage(err)}` });
    }
  }

  // Nombre de filtres actifs (la recherche texte n'est pas comptée : elle a sa propre barre)
  const activeFilterCount = useMemo(
    () => Object.entries(filters).filter(([k, v]) => k !== 'q' && v !== DEFAULT_FILTERS[k]).length,
    [filters]
  );
  const hasCriteria = activeFilterCount > 0 || filters.q !== '';

  // Panneau ouvert d'office sur grand écran ou si des filtres sont déjà dans l'URL
  const [showFilters, setShowFilters] = useState(
    () => activeFilterCount > 0 || window.matchMedia('(min-width: 1024px)').matches
  );

  // Chargement de la liste à chaque changement de filtre ou de page.
  // Le cleanup annule la requête précédente : une réponse lente ne peut pas écraser une plus récente.
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    setSelected(new Set());

    fetchCompanies(filters, page, controller.signal)
      .then((data) => {
        setResult(data);
        setLoading(false);
      })
      .catch((err) => {
        if (isCancel(err)) return;
        setError(getErrorMessage(err));
        setLoading(false);
      });

    return () => controller.abort();
  }, [filters, page, reloadKey]);

  // Page hors limites (ex : URL partagée, ou filtres qui réduisent les résultats) -> retour page 1
  useEffect(() => {
    if (!loading && !error && page > 1 && result.items.length === 0) setPage(1);
  }, [loading, error, page, result.items.length, setPage]);

  // Remonte en haut de la liste quand on change de page
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  // Le message d'export disparaît tout seul
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 6000);
    return () => clearTimeout(timer);
  }, [notice]);

  // Export : réservé aux utilisateurs connectés (toute la page l'est déjà).
  // Si l'export doit être réservé aux admins : const { isAdmin } = useAuth(); et afficher selon isAdmin.
  const totalPages = Math.max(1, result.totalPages);

  return (
    <div className="space-y-5">
      <Card className="p-5">
        <SearchBar
          value={filters.q}
          onSearch={(q) => setFilter('q', q)}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters((v) => !v)}
          activeFilterCount={activeFilterCount}
          canReset={hasCriteria}
          onReset={reset}
        >
          <ExportButton filters={filters} total={result.total} selectedIds={[...selected]} onResult={setNotice} />
        </SearchBar>

        {showFilters && <FilterPanel filters={filters} onChange={setFilter} />}
      </Card>

      {notice && (
        <div
          role={notice.type === 'error' ? 'alert' : 'status'}
          className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm ${
            notice.type === 'error'
              ? 'border-red-200 bg-red-50 text-red-700'
              : 'border-elikia/30 bg-elikia-light text-elikia-dark'
          }`}
        >
          {notice.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
          {notice.message}
        </div>
      )}

      {!error && (
        <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-sm text-slate-500 tabular-nums">
          <p>
            <span className="font-semibold text-navy">{result.total}</span>{' '}
            entreprise{result.total > 1 ? 's' : ''} trouvée{result.total > 1 ? 's' : ''}
          </p>
          {result.total > 0 && <p>Page {Math.min(page, totalPages)} sur {totalPages}</p>}
        </div>
      )}

      <section className="bg-white rounded-xl border border-line overflow-hidden">
        {error ? (
          <div className="py-14 px-6 text-center max-w-md mx-auto">
            <AlertCircle size={36} className="mx-auto text-red-400" aria-hidden="true" />
            <h3 className="mt-3 font-serif text-xl text-navy">Chargement impossible</h3>
            <p className="mt-1 text-sm text-slate-500">{error}</p>
            <Button type="button" className="mt-5" onClick={() => setReloadKey((k) => k + 1)}>
              <RefreshCw size={16} aria-hidden="true" />
              Réessayer
            </Button>
          </div>
        ) : (
          <>
            <CompanyTable
              companies={result.items} loading={loading} onReset={reset} canReset={hasCriteria}
              selected={selected} onToggle={toggleOne} onToggleAll={toggleAll}
              saved={saved} onSave={toggleSaved} onDelete={handleDelete} isAdmin={isAdmin}
            />
            {result.total > 0 && (
              <Pagination page={page} totalPages={totalPages} total={result.total} onChange={setPage} />
            )}
          </>
        )}
      </section>
    </div>
  );
}
