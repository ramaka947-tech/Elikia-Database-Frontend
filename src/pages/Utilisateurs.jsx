// Responsable : Rama
// Page Utilisateurs (ADMIN) : indicateurs, recherche, filtre par rôle,
// suspension / réactivation et suppression des comptes.
// Les clients créent leur compte eux-mêmes (inscription) ; les admins se créent dans Mon compte > Accès.
// Téléphone et tablette : une carte par compte. Grand écran : tableau.
import { useEffect, useMemo, useState } from 'react';
import { Users, CheckCircle2, Ban, Search, Crown, User, Trash2, Play } from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/ui/StatCard';
import ActionMenu from '../components/ui/ActionMenu';
import Pagination from '../components/ui/Pagination';
import ConfirmModal from '../components/ui/ConfirmModal';
import Toast from '../components/ui/Toast';

const FILTERS = [
  { id: 'ALL', label: 'Tous les rôles', short: 'Tous' },
  { id: 'ADMIN', label: 'Administrateurs', short: 'Admins', icon: Crown },
  { id: 'USER', label: 'Utilisateurs', short: 'Utilisateurs', icon: User },
];

const initials = (name) => name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
const day = (d) => new Date(d).toLocaleDateString('fr-FR');
const dateTime = (d) =>
  d ? `${day(d)} à ${new Date(d).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}` : '—';

function RoleBadge({ role }) {
  const admin = role === 'ADMIN';
  const Icon = admin ? Crown : User;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${admin ? 'bg-gold-light text-amber-800' : 'bg-slate-100 text-slate-700'}`}>
      <Icon size={13} /> {admin ? 'Administrateur' : 'Utilisateur'}
    </span>
  );
}

function StatusBadge({ status }) {
  const active = status !== 'suspendu';
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${active ? 'bg-elikia-light text-elikia-dark' : 'bg-red-50 text-red-600'}`}>
      <span className={`w-2 h-2 rounded-full ${active ? 'bg-elikia' : 'bg-red-500'}`} /> {active ? 'Actif' : 'Suspendu'}
    </span>
  );
}

function Avatar({ name }) {
  return (
    <div className="w-10 h-10 shrink-0 rounded-full bg-elikia-light text-elikia-dark text-sm font-semibold flex items-center justify-center">
      {initials(name)}
    </div>
  );
}

export default function Utilisateurs() {
  const { user: me } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [query, setQuery] = useState('');
  const [role, setRole] = useState('ALL');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [confirm, setConfirm] = useState(null); // { type: 'delete' | 'suspend', user }
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    api.get('/users')
      .then(({ data }) => setUsers(data))
      .catch(() => setLoadError('Impossible de charger les utilisateurs'))
      .finally(() => setLoading(false));
  }, []);

  // Recherche + filtre, puis découpage en pages
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter(
      (u) => (role === 'ALL' || u.role === role) && (!q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
    );
  }, [users, query, role]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / perPage));
  const current = Math.min(page, pageCount);
  const visible = filtered.slice((current - 1) * perPage, current * perPage);

  const stats = {
    total: users.length,
    active: users.filter((u) => u.status !== 'suspendu').length,
    suspended: users.filter((u) => u.status === 'suspendu').length,
  };

  const replaceUser = (u) => setUsers((list) => list.map((x) => (x.id === u.id ? u : x)));
  const fail = (title, err) => setToast({ type: 'error', title, text: err.response?.data?.message });

  async function setStatus(u, status) {
    setBusy(true);
    try {
      const { data } = await api.patch(`/users/${u.id}/status`, { status });
      replaceUser(data);
      setToast({ type: 'success', title: status === 'suspendu' ? 'Compte suspendu' : 'Compte réactivé', text: u.name });
      setConfirm(null);
    } catch (err) {
      fail('Action impossible', err);
    } finally {
      setBusy(false);
    }
  }

  async function remove(u) {
    setBusy(true);
    try {
      await api.delete(`/users/${u.id}`);
      setUsers((list) => list.filter((x) => x.id !== u.id));
      setToast({ type: 'success', title: 'Compte supprimé', text: u.name });
      setConfirm(null);
    } catch (err) {
      fail('Suppression impossible', err);
    } finally {
      setBusy(false);
    }
  }

  // Actions du menu « ⋯ » : aucune sur son propre compte (on ne peut pas se suspendre ni se supprimer)
  function actionsFor(u) {
    if (u.id === me?.id) return null;
    return [
      u.status === 'suspendu'
        ? { label: 'Réactiver', icon: Play, onClick: () => setStatus(u, 'actif') }
        : { label: 'Suspendre', icon: Ban, onClick: () => setConfirm({ type: 'suspend', user: u }) },
      { label: 'Supprimer', icon: Trash2, danger: true, onClick: () => setConfirm({ type: 'delete', user: u }) },
    ];
  }

  // Menu « ⋯ », ou un espace vide de même taille pour garder l'alignement
  const menu = (u, bordered) =>
    actionsFor(u) ? <ActionMenu bordered={bordered} items={actionsFor(u)} label={`Actions pour ${u.name}`} /> : <span className="w-10 h-10 shrink-0" />;

  const you = <span className="text-[11px] font-medium text-elikia-dark bg-elikia-light rounded-full px-2 py-0.5">Vous</span>;

  return (
    <div className="space-y-6">
      {/* Indicateurs */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
        <StatCard icon={Users} value={loading ? null : stats.total} label="Comptes au total" tone="white" />
        <StatCard icon={CheckCircle2} value={loading ? null : stats.active} label="Comptes actifs" tone="green" />
        <StatCard icon={Ban} value={loading ? null : stats.suspended} label="Comptes suspendus" tone="red" />
      </div>

      <section className="bg-white rounded-3xl border border-line">
        {/* En-tête de la liste */}
        <div className="flex items-start gap-3 p-5 sm:p-6 border-b border-line">
          <Users size={26} className="text-elikia shrink-0 mt-0.5" />
          <div className="min-w-0">
            <h2 className="font-serif text-2xl text-navy leading-tight">Liste des utilisateurs</h2>
            <p className="text-sm text-slate-500">Consultez les comptes, suspendez-les ou supprimez-les si besoin.</p>
          </div>
        </div>

        <div className="p-5 sm:p-6 space-y-5">
          {/* Recherche + filtre par rôle */}
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                placeholder="Rechercher un utilisateur (nom, email...)"
                className="w-full h-12 pl-11 pr-4 rounded-xl border border-line bg-white text-sm focus:outline-none focus:ring-2 focus:ring-elikia/30 focus:border-elikia"
              />
            </div>
            <div className="grid grid-cols-3 lg:flex gap-2">
              {FILTERS.map(({ id, label, short, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => { setRole(id); setPage(1); }}
                  className={`h-12 px-3 lg:px-4 rounded-xl border text-sm font-medium flex items-center justify-center gap-2 whitespace-nowrap transition-colors ${
                    role === id ? 'border-elikia bg-elikia-light text-elikia-dark' : 'border-line text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {Icon && <Icon size={15} className={`hidden sm:block ${id === 'ADMIN' ? 'text-gold' : ''}`} />}
                  <span className="sm:hidden">{short}</span>
                  <span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {loading && <p className="text-slate-500">Chargement des utilisateurs...</p>}
          {loadError && <p className="text-red-600 bg-red-50 rounded-2xl px-5 py-4">{loadError}</p>}
          {!loading && !loadError && filtered.length === 0 && (
            <p className="py-10 text-center text-slate-500">Aucun utilisateur ne correspond à votre recherche.</p>
          )}

          {visible.length > 0 && (
            <>
              {/* Téléphone et tablette : une carte par compte */}
              <ul className="xl:hidden grid md:grid-cols-2 gap-3">
                {visible.map((u) => (
                  <li key={u.id} className="rounded-2xl border border-line p-4">
                    <div className="flex items-start gap-3">
                      <Avatar name={u.name} />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-ink truncate flex items-center gap-2">
                          <span className="truncate">{u.name}</span> {u.id === me?.id && you}
                        </p>
                        <p className="text-sm text-slate-500 truncate">{u.email}</p>
                      </div>
                      {menu(u, false)}
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <RoleBadge role={u.role} />
                      <StatusBadge status={u.status} />
                    </div>
                    <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <dt className="text-slate-400">Inscrit le</dt>
                        <dd className="text-slate-600">{day(u.created_at)}</dd>
                      </div>
                      <div>
                        <dt className="text-slate-400">Dernière connexion</dt>
                        <dd className="text-slate-600">{dateTime(u.last_login_at)}</dd>
                      </div>
                    </dl>
                  </li>
                ))}
              </ul>

              {/* Grand écran : tableau */}
              <div className="hidden xl:block rounded-2xl border border-line">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-ink bg-cream border-b border-line">
                      <th className="font-semibold px-4 py-3 rounded-tl-2xl">Utilisateur</th>
                      <th className="font-semibold px-4 py-3">Email</th>
                      <th className="font-semibold px-4 py-3">Rôle</th>
                      <th className="font-semibold px-4 py-3">Statut</th>
                      <th className="font-semibold px-4 py-3">Inscrit le</th>
                      <th className="font-semibold px-4 py-3">Dernière connexion</th>
                      <th className="font-semibold px-4 py-3 text-right rounded-tr-2xl">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visible.map((u) => (
                      <tr key={u.id} className="border-b border-line last:border-0">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Avatar name={u.name} />
                            <span className="font-semibold text-ink">{u.name}</span>
                            {u.id === me?.id && you}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-600 break-all">{u.email}</td>
                        <td className="px-4 py-3"><RoleBadge role={u.role} /></td>
                        <td className="px-4 py-3"><StatusBadge status={u.status} /></td>
                        <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{day(u.created_at)}</td>
                        <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{dateTime(u.last_login_at)}</td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end">
                            {menu(u, true)}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Nombre par page + pagination */}
              <div className="flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-6">
                <label className="flex items-center gap-3 text-sm text-slate-500 pt-5 shrink-0">
                  Afficher
                  <select
                    value={perPage}
                    onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }}
                    className="h-10 px-3 rounded-xl border border-line bg-white text-sm text-ink focus:outline-none focus:border-elikia"
                  >
                    {[10, 20, 50].map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                </label>
                <div className="flex-1">
                  <Pagination page={current} total={filtered.length} perPage={perPage} onChange={setPage} label="utilisateurs" />
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      <ConfirmModal
        open={confirm?.type === 'suspend'}
        onClose={() => setConfirm(null)}
        onConfirm={() => setStatus(confirm.user, 'suspendu')}
        title="Suspendre ce compte ?"
        message={confirm ? `${confirm.user.name} ne pourra plus se connecter jusqu'à sa réactivation.` : ''}
        confirmLabel="Suspendre"
        icon={Ban}
        loading={busy}
      />
      <ConfirmModal
        open={confirm?.type === 'delete'}
        onClose={() => setConfirm(null)}
        onConfirm={() => remove(confirm.user)}
        title="Supprimer ce compte ?"
        message={confirm ? `Le compte de ${confirm.user.name} et ses listes seront supprimés définitivement.` : ''}
        confirmLabel="Supprimer"
        loading={busy}
      />

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
