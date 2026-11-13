// Responsable : Rama (P1)
// Page d'une liste : en-tête, indicateurs, recherche, filtres, export Excel,
// tableau paginé avec sélection, menu d'actions par entreprise.
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ChevronRight, Folder, CalendarDays, Pencil, Download, Trash2, Plus, Search, SlidersHorizontal,
  Building2, Tag, MapPin, Phone, Mail, Eye, ExternalLink, FolderPlus, X,
} from 'lucide-react';
import api from '../api/client';
import { downloadFile } from '../utils/download';
import { formatDate, plural } from '../utils/format';
import Button from '../components/ui/Button';
import StatCard from '../components/ui/StatCard';
import Pagination from '../components/ui/Pagination';
import ActionMenu from '../components/ui/ActionMenu';
import ConfirmModal from '../components/ui/ConfirmModal';
import Toast from '../components/ui/Toast';
import ListFormModal from '../components/listes/ListFormModal';
import AddToListModal from '../components/listes/AddToListModal';
import { addResultToast } from '../components/listes/addResultMessage';

const PER_PAGE = 10;
const location = (c) => c.city || c.region || '';

export default function ListeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [list, setList] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | ok | notfound | error
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sector, setSector] = useState('');
  const [region, setRegion] = useState('');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState([]);
  const [editing, setEditing] = useState(false);
  const [confirm, setConfirm] = useState(null); // { type: 'one' | 'many' | 'list', company? }
  const [working, setWorking] = useState(false);
  const [addTo, setAddTo] = useState(null); // ids à ajouter à une autre liste
  const [exporting, setExporting] = useState(false);
  const [toast, setToast] = useState(null);
  const closeToast = useCallback(() => setToast(null), []);

  const load = useCallback(async () => {
    try {
      const { data } = await api.get(`/lists/${id}`);
      setList(data);
      setStatus('ok');
    } catch (err) {
      setStatus(err.response?.status === 404 ? 'notfound' : 'error');
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const companies = list?.companies || [];
  const sectors = useMemo(() => [...new Set(companies.map((c) => c.sector).filter(Boolean))].sort(), [companies]);
  const regions = useMemo(() => [...new Set(companies.map((c) => c.region || c.city).filter(Boolean))].sort(), [companies]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return companies.filter((c) =>
      (!q || [c.name, c.legal_name, c.sector, c.city, c.region].some((v) => v?.toLowerCase().includes(q))) &&
      (!sector || c.sector === sector) &&
      (!region || (c.region || c.city) === region)
    );
  }, [companies, query, sector, region]);

  useEffect(() => setPage(1), [query, sector, region]);
  const visible = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const activeFilters = (sector ? 1 : 0) + (region ? 1 : 0);

  const allVisibleSelected = visible.length > 0 && visible.every((c) => selected.includes(c.id));
  const toggle = (cid) => setSelected((s) => (s.includes(cid) ? s.filter((x) => x !== cid) : [...s, cid]));
  const toggleAll = () =>
    setSelected((s) => (allVisibleSelected ? s.filter((x) => !visible.some((c) => c.id === x)) : [...new Set([...s, ...visible.map((c) => c.id)])]));

  async function exportList() {
    setExporting(true);
    try {
      await downloadFile(`/lists/${id}/export`);
      setToast({ type: 'success', title: 'Export prêt', text: `La liste « ${list.name} » a été téléchargée.` });
    } catch {
      setToast({ type: 'error', title: 'Export impossible', text: 'Réessayez dans un instant.' });
    } finally {
      setExporting(false);
    }
  }

  async function runConfirm() {
    setWorking(true);
    try {
      if (confirm.type === 'list') {
        await api.delete(`/lists/${id}`);
        navigate('/listes');
        return;
      }
      const ids = confirm.type === 'one' ? [confirm.company.id] : selected;
      await api.post(`/lists/${id}/companies/remove`, { companyIds: ids });
      setSelected((s) => s.filter((x) => !ids.includes(x)));
      setToast({
        type: 'success',
        title: ids.length > 1 ? `${ids.length} entreprises retirées` : 'Entreprise retirée',
        text: 'Elles restent disponibles dans le répertoire.',
      });
      setConfirm(null);
      load();
    } catch {
      setToast({ type: 'error', title: 'Action impossible', text: 'Réessayez dans un instant.' });
    } finally {
      setWorking(false);
    }
  }

  const companyMenu = (c) => [
    { label: 'Voir la fiche entreprise', icon: Eye, onClick: () => navigate(`/entreprises/${c.id}`) },
    { label: 'Ouvrir dans le répertoire', icon: ExternalLink, onClick: () => navigate(`/entreprises?q=${encodeURIComponent(c.name)}`) },
    { label: 'Ajouter à une autre liste', icon: FolderPlus, onClick: () => setAddTo([c.id]) },
    { label: 'Retirer de cette liste', icon: Trash2, danger: true, onClick: () => setConfirm({ type: 'one', company: c }) },
  ];

  const contact = (c) =>
    c.phone ? (
      <span className="flex items-center gap-2"><Phone size={15} className="text-slate-400 shrink-0" /> {c.phone}</span>
    ) : c.email ? (
      <span className="flex items-center gap-2 min-w-0"><Mail size={15} className="text-slate-400 shrink-0" /> <span className="truncate">{c.email}</span></span>
    ) : (
      <span className="text-slate-400">Non renseigné</span>
    );

  if (status === 'loading') return <p className="text-slate-500">Chargement de la liste...</p>;
  if (status !== 'ok') {
    return (
      <div className="bg-white rounded-3xl border border-line px-6 py-16 text-center">
        <h2 className="font-serif text-2xl text-forest">{status === 'notfound' ? 'Liste introuvable' : 'Impossible de charger la liste'}</h2>
        <p className="mt-2 text-slate-500">
          {status === 'notfound' ? "Cette liste n'existe pas ou ne vous appartient pas." : 'Réessayez dans un instant.'}
        </p>
        <Link to="/listes" className="mt-6 inline-flex items-center h-11 px-5 rounded-full bg-elikia text-white text-sm font-medium">Retour à mes listes</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Fil d'Ariane */}
      <nav className="flex items-center gap-2 text-sm text-slate-500 min-w-0">
        <Link to="/listes" className="hover:text-elikia shrink-0">Mes listes</Link>
        <ChevronRight size={16} className="shrink-0" />
        <span className="text-ink font-medium truncate">{list.name}</span>
      </nav>

      {/* En-tête */}
      <div className="flex flex-col md:flex-row md:items-start gap-5 justify-between">
        <div className="flex items-start gap-4 min-w-0">
          <div className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-2xl bg-elikia-light text-elikia flex items-center justify-center">
            <Folder size={28} />
          </div>
          <div className="min-w-0">
            <h2 className="font-serif text-2xl sm:text-3xl text-forest break-words">{list.name}</h2>
            {list.description && <p className="mt-1 text-slate-600">{list.description}</p>}
            <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500">
              <span className="flex items-center gap-1.5"><CalendarDays size={15} /> Créée le {formatDate(list.created_at)}</span>
              <span className="hidden sm:inline">·</span>
              <span className="font-medium text-ink">{plural(companies.length, 'entreprise')}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="secondary" onClick={() => setEditing(true)}><Pencil size={16} /> Modifier</Button>
          <ActionMenu
            bordered
            label="Plus d'actions"
            items={[
              { label: 'Exporter (Excel)', icon: Download, onClick: exportList },
              { label: 'Supprimer la liste', icon: Trash2, danger: true, onClick: () => setConfirm({ type: 'list' }) },
            ]}
          />
        </div>
      </div>

      {/* Indicateurs */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
        <StatCard icon={Building2} value={companies.length} label="Entreprises dans cette liste" tone="green" />
        <StatCard icon={Tag} value={sectors.length} label="Secteurs d'activité" tone="gold" />
        <StatCard icon={MapPin} value={regions.length} label="Régions" tone="slate" />
      </div>

      {/* Barre d'outils */}
      <div className="flex flex-col lg:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher une entreprise dans cette liste..."
            className="w-full h-12 pl-11 pr-4 rounded-xl border border-line bg-white text-sm focus:outline-none focus:ring-2 focus:ring-elikia/30 focus:border-elikia"
          />
        </div>
        <div className="grid grid-cols-2 sm:flex gap-2">
          <Button variant="secondary" onClick={() => setShowFilters(!showFilters)} className={`h-12 ${showFilters || activeFilters ? 'border-elikia text-elikia' : ''}`}>
            <SlidersHorizontal size={18} /> Filtres{activeFilters > 0 && ` (${activeFilters})`}
          </Button>
          <Button variant="secondary" onClick={exportList} disabled={exporting || companies.length === 0} className="h-12">
            <Download size={18} /> {exporting ? 'Export...' : 'Exporter'}
          </Button>
          <Link to="/entreprises" className="col-span-2 sm:col-span-1 inline-flex items-center justify-center gap-2 h-12 px-5 rounded-full bg-elikia text-white text-sm font-medium hover:bg-elikia-dark">
            <Plus size={18} /> Ajouter des entreprises
          </Link>
        </div>
      </div>

      {showFilters && (
        <div className="bg-white rounded-2xl border border-line p-4 grid sm:grid-cols-[1fr_1fr_auto] gap-3 items-end">
          <label className="block">
            <span className="block text-xs font-medium text-slate-500 mb-1">Secteur</span>
            <select value={sector} onChange={(e) => setSector(e.target.value)} className="w-full h-11 px-3 rounded-xl border border-line bg-white text-sm">
              <option value="">Tous les secteurs</option>
              {sectors.map((s) => <option key={s}>{s}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="block text-xs font-medium text-slate-500 mb-1">Région</span>
            <select value={region} onChange={(e) => setRegion(e.target.value)} className="w-full h-11 px-3 rounded-xl border border-line bg-white text-sm">
              <option value="">Toutes les régions</option>
              {regions.map((r) => <option key={r}>{r}</option>)}
            </select>
          </label>
          <Button variant="ghost" onClick={() => { setSector(''); setRegion(''); }} disabled={!activeFilters} className="h-11">
            Réinitialiser
          </Button>
        </div>
      )}

      {/* Barre de sélection */}
      {selected.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-forest text-white px-5 py-3">
          <span className="text-sm font-medium">{plural(selected.length, 'entreprise sélectionnée', 'entreprises sélectionnées')}</span>
          <div className="flex gap-2">
            <button onClick={() => setSelected([])} className="h-10 px-4 rounded-full text-sm text-white/80 hover:bg-white/10">Annuler</button>
            <button onClick={() => setConfirm({ type: 'many' })} className="h-10 px-4 rounded-full bg-red-600 text-sm font-medium hover:bg-red-700 inline-flex items-center gap-2">
              <Trash2 size={16} /> Retirer de la liste
            </button>
          </div>
        </div>
      )}

      {/* Contenu */}
      <div className="bg-white rounded-3xl border border-line">
        {companies.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-elikia-light text-elikia flex items-center justify-center"><Building2 size={28} /></div>
            <h3 className="mt-5 font-serif text-2xl text-forest">Cette liste est vide</h3>
            <p className="mt-2 max-w-md mx-auto text-slate-500">
              Ajoutez des entreprises depuis le répertoire : sélectionnez-les puis cliquez sur « Ajouter à une liste ».
            </p>
            <Link to="/entreprises" className="mt-6 inline-flex items-center gap-2 h-12 px-6 rounded-full bg-elikia text-white text-sm font-medium hover:bg-elikia-dark">
              <Plus size={18} /> Ajouter des entreprises
            </Link>
          </div>
        ) : filtered.length === 0 ? (
          <p className="px-6 py-12 text-center text-slate-500">Aucune entreprise ne correspond à votre recherche.</p>
        ) : (
          <>
            {/* Ordinateur : tableau */}
            <table className="hidden lg:table w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 bg-slate-50 border-b border-line">
                  <th className="w-12 pl-6 py-4 rounded-tl-3xl">
                    <input type="checkbox" checked={allVisibleSelected} onChange={toggleAll} className="w-4 h-4 accent-[#0a6b47]" aria-label="Tout sélectionner" />
                  </th>
                  <th className="font-medium px-4 py-4">Entreprise</th>
                  <th className="font-medium px-4 py-4">Secteur</th>
                  <th className="font-medium px-4 py-4">Région</th>
                  <th className="font-medium px-4 py-4">Contact</th>
                  <th className="font-medium px-4 py-4">Ajoutée le</th>
                  <th className="font-medium pr-6 py-4 text-right rounded-tr-3xl">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((c) => (
                  <tr key={c.id} className={`border-b border-line last:border-0 ${selected.includes(c.id) ? 'bg-elikia-light/60' : 'hover:bg-slate-50/70'}`}>
                    <td className="pl-6 py-4">
                      <input type="checkbox" checked={selected.includes(c.id)} onChange={() => toggle(c.id)} className="w-4 h-4 accent-[#0a6b47]" aria-label={`Sélectionner ${c.name}`} />
                    </td>
                    <td className="px-4 py-4">
                      <Link to={`/entreprises/${c.id}`} className="flex items-center gap-3 font-semibold text-forest hover:underline">
                        <Building2 size={18} className="text-slate-400 shrink-0" /> {c.name}
                      </Link>
                    </td>
                    <td className="px-4 py-4 text-slate-600">{c.sector || <span className="text-slate-400">Non renseigné</span>}</td>
                    <td className="px-4 py-4 text-slate-600">
                      {location(c) ? <span className="flex items-center gap-1.5"><MapPin size={15} className="text-slate-400" /> {location(c)}</span> : <span className="text-slate-400">Non renseignée</span>}
                    </td>
                    <td className="px-4 py-4 text-slate-600 max-w-[14rem]">{contact(c)}</td>
                    <td className="px-4 py-4 text-slate-600 whitespace-nowrap">{formatDate(c.added_at)}</td>
                    <td className="pr-6 py-4"><div className="flex justify-end"><ActionMenu items={companyMenu(c)} /></div></td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile et tablette : cartes */}
            <div className="lg:hidden flex items-center gap-3 px-5 pt-4 pb-2 text-sm text-slate-500">
              <input type="checkbox" checked={allVisibleSelected} onChange={toggleAll} className="w-4 h-4 accent-[#0a6b47]" id="all-m" />
              <label htmlFor="all-m">Tout sélectionner</label>
            </div>
            <ul className="lg:hidden divide-y divide-line">
              {visible.map((c) => (
                <li key={c.id} className={`flex items-start gap-3 p-5 ${selected.includes(c.id) ? 'bg-elikia-light/60' : ''}`}>
                  <input type="checkbox" checked={selected.includes(c.id)} onChange={() => toggle(c.id)} className="w-4 h-4 mt-1 accent-[#0a6b47]" aria-label={`Sélectionner ${c.name}`} />
                  <div className="flex-1 min-w-0">
                    <Link to={`/entreprises/${c.id}`} className="font-semibold text-forest hover:underline">{c.name}</Link>
                    <p className="text-sm text-slate-500">{[c.sector, location(c)].filter(Boolean).join(' · ') || 'Non renseigné'}</p>
                    <div className="mt-1.5 text-sm text-slate-600">{contact(c)}</div>
                    <p className="mt-1 text-xs text-slate-400">Ajoutée le {formatDate(c.added_at)}</p>
                  </div>
                  <ActionMenu items={companyMenu(c)} />
                </li>
              ))}
            </ul>
          </>
        )}
        {filtered.length > 0 && (
          <div className="px-6 pb-5">
            <Pagination page={page} total={filtered.length} perPage={PER_PAGE} onChange={setPage} label="entreprises" />
          </div>
        )}
      </div>

      <ListFormModal open={editing} list={list} onClose={() => setEditing(false)} onSaved={(d) => { setList({ ...list, ...d }); setToast({ type: 'success', title: 'Liste modifiée' }); }} />
      <AddToListModal
        open={Boolean(addTo)}
        onClose={() => setAddTo(null)}
        companyIds={addTo || []}
        excludeListId={id}
        onDone={(r) => setToast(addResultToast(r))}
      />
      <ConfirmModal
        open={Boolean(confirm)}
        onClose={() => setConfirm(null)}
        onConfirm={runConfirm}
        loading={working}
        title={confirm?.type === 'list' ? 'Supprimer la liste ?' : confirm?.type === 'many' ? 'Retirer les entreprises ?' : "Retirer l'entreprise de la liste ?"}
        message={
          confirm?.type === 'list'
            ? `La liste « ${list.name} » sera supprimée. Les entreprises resteront disponibles dans le répertoire.`
            : confirm?.type === 'many'
              ? `${plural(selected.length, 'entreprise sera retirée', 'entreprises seront retirées')} de cette liste, mais resteront disponibles dans le répertoire.`
              : `L'entreprise « ${confirm?.company?.name} » sera retirée de cette liste, mais restera disponible dans le répertoire.`
        }
        confirmLabel={confirm?.type === 'list' ? 'Supprimer' : 'Retirer de cette liste'}
      />
      <Toast toast={toast} onClose={closeToast} />
    </div>
  );
}
