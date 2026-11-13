// Responsable : Rama (P1)
// Page principale « Mes listes » : indicateurs, recherche, tri, tableau paginé,
// création / modification / suppression et export Excel.
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Folder, FolderOpen, Building2, Download, Pencil, Trash2, Search, FileSpreadsheet } from 'lucide-react';
import api from '../api/client';
import { downloadFile } from '../utils/download';
import { formatDate, plural } from '../utils/format';
import Button from '../components/ui/Button';
import StatCard from '../components/ui/StatCard';
import Pagination from '../components/ui/Pagination';
import ConfirmModal from '../components/ui/ConfirmModal';
import Toast from '../components/ui/Toast';
import ListFormModal from '../components/listes/ListFormModal';

const PER_PAGE = 8;

const SORTS = {
  recent: { label: 'Plus récentes', fn: (a, b) => new Date(b.created_at) - new Date(a.created_at) },
  updated: { label: 'Dernière mise à jour', fn: (a, b) => new Date(b.updated_at) - new Date(a.updated_at) },
  name: { label: 'Nom (A à Z)', fn: (a, b) => a.name.localeCompare(b.name, 'fr') },
  count: { label: "Plus d'entreprises", fn: (a, b) => b.count - a.count },
};

export default function MesListes() {
  const navigate = useNavigate();
  const [lists, setLists] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('recent');
  const [page, setPage] = useState(1);
  const [formList, setFormList] = useState(undefined); // undefined = fermé, null = création, objet = modification
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [exporting, setExporting] = useState(null);
  const [toast, setToast] = useState(null);
  const closeToast = useCallback(() => setToast(null), []);

  const load = useCallback(async () => {
    const [l, s] = await Promise.all([api.get('/lists'), api.get('/lists/stats')]);
    setLists(l.data);
    setStats(s.data);
  }, []);

  useEffect(() => {
    load().catch(() => setLoadError('Impossible de charger vos listes. Réessayez dans un instant.')).finally(() => setLoading(false));
  }, [load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return lists
      .filter((l) => !q || l.name.toLowerCase().includes(q) || (l.description || '').toLowerCase().includes(q))
      .sort(SORTS[sort].fn);
  }, [lists, query, sort]);

  useEffect(() => setPage(1), [query, sort]);
  const visible = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  async function exportList(list) {
    setExporting(list ? list.id : 'all');
    try {
      await downloadFile(list ? `/lists/${list.id}/export` : '/lists/export');
      setStats((s) => s && { ...s, exports: s.exports + 1 });
      setToast({ type: 'success', title: 'Export prêt', text: list ? `La liste « ${list.name} » a été téléchargée.` : 'Toutes vos listes ont été téléchargées dans un même fichier.' });
    } catch {
      setToast({ type: 'error', title: 'Export impossible', text: 'Réessayez dans un instant.' });
    } finally {
      setExporting(null);
    }
  }

  async function confirmDelete() {
    setDeleting(true);
    try {
      await api.delete(`/lists/${toDelete.id}`);
      setToast({ type: 'success', title: 'Liste supprimée', text: `« ${toDelete.name} » a été supprimée. Les entreprises restent dans le répertoire.` });
      setToDelete(null);
      load();
    } catch {
      setToast({ type: 'error', title: 'Suppression impossible', text: 'Réessayez dans un instant.' });
    } finally {
      setDeleting(false);
    }
  }

  function onSaved(saved) {
    const created = formList === null;
    setToast({ type: 'success', title: created ? 'Liste créée' : 'Liste modifiée', text: `« ${saved.name} »` });
    load();
  }

  const iconBtn = 'w-10 h-10 rounded-full flex items-center justify-center transition-colors';
  const actions = (l) => (
    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
      <button className={`${iconBtn} text-elikia hover:bg-elikia-light`} onClick={() => exportList(l)} disabled={exporting === l.id} aria-label={`Exporter ${l.name}`} title="Exporter (Excel)">
        <Download size={19} />
      </button>
      <button className={`${iconBtn} text-elikia hover:bg-elikia-light`} onClick={() => setFormList(l)} aria-label={`Modifier ${l.name}`} title="Modifier">
        <Pencil size={18} />
      </button>
      <button className={`${iconBtn} text-red-500 hover:bg-red-50`} onClick={() => setToDelete(l)} aria-label={`Supprimer ${l.name}`} title="Supprimer">
        <Trash2 size={18} />
      </button>
    </div>
  );

  if (loading) return <p className="text-slate-500">Chargement de vos listes...</p>;
  if (loadError) return <p className="text-red-600 bg-red-50 rounded-2xl px-5 py-4">{loadError}</p>;

  return (
    <div className="space-y-6">
      {/* Actions (la phrase d'introduction est affichée par la barre du haut / le Layout) */}
      <div className="flex md:justify-end">
        <div className="flex gap-2 w-full md:w-auto">
          {lists.length > 0 && (
            <Button variant="secondary" onClick={() => exportList(null)} disabled={exporting === 'all'} aria-label="Exporter toutes les listes" title="Exporter toutes les listes (Excel)">
              <FileSpreadsheet size={18} /> <span className="hidden sm:inline">{exporting === 'all' ? 'Export...' : 'Exporter toutes'}</span>
            </Button>
          )}
          <Button onClick={() => setFormList(null)} className="flex-1 md:flex-none">
            <Plus size={18} /> Nouvelle liste
          </Button>
        </div>
      </div>

      {/* Indicateurs */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
        <StatCard icon={Folder} value={stats?.lists} label="Listes créées" tone="green" />
        <StatCard icon={Building2} value={stats?.companies} label="Entreprises enregistrées" tone="white" />
        <StatCard icon={Download} value={stats?.exports} label="Exports réalisés" tone="gold" />
      </div>

      {lists.length === 0 ? (
        /* État vide */
        <div className="bg-white rounded-3xl border border-line px-6 py-16 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-elikia-light text-elikia flex items-center justify-center">
            <FolderOpen size={30} />
          </div>
          <h2 className="mt-5 font-serif text-2xl text-forest">Vous n'avez pas encore de liste</h2>
          <p className="mt-2 max-w-md mx-auto text-slate-500">
            Créez une liste pour regrouper les entreprises qui vous intéressent : prospects, partenaires, fournisseurs…
            Vous y ajouterez ensuite des entreprises depuis le répertoire.
          </p>
          <Button onClick={() => setFormList(null)} className="mt-6 h-12 px-6">
            <Plus size={18} /> Créer ma première liste
          </Button>
        </div>
      ) : (
        <>
          {/* Recherche + tri */}
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
            <div className="relative sm:max-w-md flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher une liste..."
                className="w-full h-12 pl-11 pr-4 rounded-xl border border-line bg-white text-sm focus:outline-none focus:ring-2 focus:ring-elikia/30 focus:border-elikia"
              />
            </div>
            <label className="flex items-center gap-3 text-sm text-slate-500">
              <span className="shrink-0">Trier par :</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="h-12 flex-1 sm:flex-none px-4 rounded-xl border border-line bg-white text-sm text-ink focus:outline-none focus:border-elikia"
              >
                {Object.entries(SORTS).map(([key, s]) => <option key={key} value={key}>{s.label}</option>)}
              </select>
            </label>
          </div>

          <div className="bg-white rounded-3xl border border-line">
            {filtered.length === 0 ? (
              <p className="px-6 py-12 text-center text-slate-500">Aucune liste ne correspond à « {query} ».</p>
            ) : (
              <>
                {/* Ordinateur : tableau */}
                <table className="hidden lg:table w-full text-sm">
                  <thead>
                    <tr className="text-left text-slate-500 bg-slate-50 border-b border-line">
                      <th className="font-medium px-6 py-4 rounded-tl-3xl">Nom de la liste</th>
                      <th className="font-medium px-4 py-4">Entreprises</th>
                      <th className="font-medium px-4 py-4">Date de création</th>
                      <th className="font-medium px-4 py-4">Dernière mise à jour</th>
                      <th className="font-medium px-6 py-4 text-right rounded-tr-3xl">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visible.map((l) => (
                      <tr key={l.id} onClick={() => navigate(`/listes/${l.id}`)} className="border-b border-line last:border-0 hover:bg-slate-50/70 cursor-pointer">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <Folder size={22} className="text-elikia shrink-0" />
                            <div className="min-w-0">
                              <p className="font-semibold text-forest truncate">{l.name}</p>
                              {l.description && <p className="text-xs text-slate-500 truncate max-w-md">{l.description}</p>}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 font-medium text-ink">{l.count}</td>
                        <td className="px-4 py-4 text-slate-600">{formatDate(l.created_at)}</td>
                        <td className="px-4 py-4 text-slate-600">{formatDate(l.updated_at)}</td>
                        <td className="px-6 py-4"><div className="flex justify-end">{actions(l)}</div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Mobile et tablette : cartes */}
                <ul className="lg:hidden divide-y divide-line">
                  {visible.map((l) => (
                    <li key={l.id} onClick={() => navigate(`/listes/${l.id}`)} className="p-5 cursor-pointer">
                      <div className="flex items-start gap-3">
                        <Folder size={22} className="text-elikia shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-forest">{l.name}</p>
                          {l.description && <p className="text-sm text-slate-500 line-clamp-2">{l.description}</p>}
                          <p className="mt-2 text-xs text-slate-400">
                            {plural(l.count, 'entreprise')} · Créée le {formatDate(l.created_at)} · MAJ {formatDate(l.updated_at)}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 flex justify-end">{actions(l)}</div>
                    </li>
                  ))}
                </ul>
              </>
            )}
            <div className="px-6 pb-5">
              <Pagination page={page} total={filtered.length} perPage={PER_PAGE} onChange={setPage} label="listes" />
            </div>
          </div>
        </>
      )}

      <ListFormModal open={formList !== undefined} list={formList || null} onClose={() => setFormList(undefined)} onSaved={onSaved} />
      <ConfirmModal
        open={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        onConfirm={confirmDelete}
        loading={deleting}
        title="Supprimer la liste ?"
        message={toDelete && `La liste « ${toDelete.name} » sera supprimée. Les entreprises qu'elle contient resteront disponibles dans le répertoire.`}
        confirmLabel="Supprimer"
      />
      <Toast toast={toast} onClose={closeToast} />
    </div>
  );
}
