// Sidebar (fichier partagé, géré par Rama)
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Building2, PlusCircle, Upload, LogOut, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Logo from './Logo';

const mainLinks = [
  { to: '/', label: 'Tableau de bord', icon: LayoutDashboard },
  { to: '/entreprises', label: 'Répertoire', icon: Building2 },
];

const adminLinks = [
  { to: '/entreprises/nouveau', label: 'Ajouter une entreprise', icon: PlusCircle },
  { to: '/admin/import', label: 'Import CSV', icon: Upload },
];

function Item({ to, label, icon: Icon, onClick }) {
  return (
    <NavLink
      to={to}
      end
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
          isActive ? 'bg-elikia text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'
        }`
      }
    >
      <Icon size={18} />
      {label}
    </NavLink>
  );
}

export default function Sidebar({ open, onClose, onLogout }) {
  const { user, isAdmin } = useAuth();
  const initials = (user?.name || '?').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <>
      {/* Fond sombre derrière la sidebar sur mobile */}
      {open && <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={onClose} />}

      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-72 shrink-0 bg-navy flex flex-col transition-transform
          ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        <div className="flex items-center justify-between px-5 h-20 border-b border-white/10">
          <Logo tagline={false} />
          <button className="lg:hidden text-white/70" onClick={onClose} aria-label="Fermer le menu">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-6">
          <div className="space-y-1">
            <p className="px-3 mb-2 text-[11px] font-semibold tracking-widest text-white/40">NAVIGATION</p>
            {mainLinks.map((l) => <Item key={l.to} {...l} onClick={onClose} />)}
          </div>

          {isAdmin && (
            <div className="space-y-1">
              <p className="px-3 mb-2 text-[11px] font-semibold tracking-widest text-gold/80">ADMINISTRATION</p>
              {adminLinks.map((l) => <Item key={l.to} {...l} onClick={onClose} />)}
            </div>
          )}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-navy-soft">
            <div className="w-10 h-10 rounded-full bg-elikia/20 border border-elikia/40 text-elikia flex items-center justify-center text-sm font-semibold">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white font-medium truncate">{user?.name}</p>
              <p className="text-xs text-white/50 truncate">{user?.email}</p>
            </div>
            <button onClick={onLogout} className="text-white/60 hover:text-white" aria-label="Déconnexion" title="Déconnexion">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
