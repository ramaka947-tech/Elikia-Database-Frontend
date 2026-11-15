// Sidebar (fichier partagé, géré par Rama)
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, LayoutDashboard, Building2, Bookmark, Upload, UserCog, LogOut, X } from 'lucide-react';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';

function Item({ to, label, icon: Icon, count, onClick }) {
  return (
    <NavLink
      to={to}
      end
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
          isActive ? 'bg-elikia text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'
        }`
      }
    >
      <Icon size={18} aria-hidden="true" />
      <span className="flex-1">{label}</span>
      {count != null && <span className="text-xs tabular-nums opacity-80">{count}</span>}
    </NavLink>
  );
}

export default function Sidebar({ open, onClose, onLogout }) {
  const { user, isAdmin } = useAuth();
  const [counts, setCounts] = useState({ companies: null, lists: null });

  useEffect(() => {
    // allSettled : si /lists n'existe pas encore côté API, le compteur du Répertoire s'affiche quand même
    Promise.allSettled([api.get('/companies', { params: { limit: 1 } }), api.get('/lists')]).then(([c, l]) =>
      setCounts({
        companies: c.status === 'fulfilled' ? c.value.data.total ?? null : null,
        lists: l.status === 'fulfilled' ? l.value.data.length : null,
      })
    );
  }, []);

  const links = [
    { to: '/vitrine', label: 'Accueil (Vitrine)', icon: Home },
    { to: '/', label: 'Tableau de bord', icon: LayoutDashboard },
    { to: '/entreprises', label: 'Répertoire', icon: Building2, count: counts.companies },
    { to: '/listes', label: 'Mes listes', icon: Bookmark, count: counts.lists },
    ...(isAdmin ? [{ to: '/admin/import', label: 'Import CSV', icon: Upload }] : []),
    { to: '/profil', label: 'Profil & Accès', icon: UserCog },
  ];

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={onClose} />}

      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-60 shrink-0 bg-navy flex flex-col transition-transform
          ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        <div className="flex items-center justify-between px-5 h-20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-elikia flex items-center justify-center font-bold text-white">E</div>
            <div className="leading-tight">
              <p className="text-white font-semibold">Elikia Database</p>
              <p className="text-xs text-white/50">Sénégal B2B · MVP</p>
            </div>
          </div>
          <button className="lg:hidden text-white/70" onClick={onClose} aria-label="Fermer le menu"><X size={20} /></button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          {links.map((l) => <Item key={l.to} {...l} onClick={onClose} />)}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-3">
          <div>
            <p className="text-sm text-white font-semibold">{user?.name}</p>
            <p className="text-xs text-gold">{isAdmin ? 'Administrateur' : 'Utilisateur'}</p>
            <p className="text-xs text-white/50 truncate">{user?.email}</p>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-white/15 text-xs text-white/80 hover:bg-white/5"
          >
            <LogOut size={14} aria-hidden="true" /> Changer de compte / Déconnexion
          </button>
        </div>
      </aside>
    </>
  );
}
