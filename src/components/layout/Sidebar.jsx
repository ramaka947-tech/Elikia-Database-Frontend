// Sidebar (fichier partagé, géré par Rama)
// Téléphone (< 640 px)     : cachée, la navigation se fait par la barre du bas (BottomNav).
// Tablette (640 à 1023 px) : étroite, icônes seules (le nom s'affiche au survol).
// Ordinateur (≥ 1024 px)   : complète, icônes + noms.
import { Link, NavLink } from 'react-router-dom';
import { LayoutDashboard, Building2, Bookmark, UserCircle, PlusCircle, Upload, Users, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Logo from './Logo';
import InstallAppButton from './InstallAppButton';

const mainLinks = [
  { to: '/tableau-de-bord', label: 'Tableau de bord', icon: LayoutDashboard },
  { to: '/entreprises', label: 'Répertoire', icon: Building2 },
  { to: '/listes', label: 'Mes listes', icon: Bookmark },
  { to: '/profil', label: 'Mon compte', icon: UserCircle },
];

const adminLinks = [
  { to: '/entreprises/nouveau', label: 'Ajouter une entreprise', icon: PlusCircle },
  { to: '/admin/import', label: 'Import CSV', icon: Upload },
  { to: '/admin/utilisateurs', label: 'Utilisateurs', icon: Users },
];

function Item({ to, label, icon: Icon }) {
  return (
    <NavLink
      to={to}
      end={to === '/entreprises'}
      title={label}
      aria-label={label}
      className={({ isActive }) =>
        `flex items-center justify-center lg:justify-start gap-3 h-11 lg:px-3 rounded-xl text-sm font-medium transition-colors ${
          isActive ? 'bg-elikia text-white' : 'text-white/75 hover:bg-white/10 hover:text-white'
        }`
      }
    >
      <Icon size={20} className="shrink-0" />
      <span className="hidden lg:inline truncate">{label}</span>
    </NavLink>
  );
}

function SectionLabel({ children, gold = false }) {
  return (
    <>
      <p className={`hidden lg:block px-3 mb-2 text-[11px] font-semibold tracking-widest ${gold ? 'text-gold/80' : 'text-white/40'}`}>{children}</p>
      <div className="lg:hidden mx-3 mb-2 border-t border-white/10" />
    </>
  );
}

export default function Sidebar({ onLogout }) {
  const { user, isAdmin } = useAuth();
  const initials = (user?.name || '?').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <aside className="hidden sm:flex sticky top-0 h-screen w-20 lg:w-72 shrink-0 bg-forest flex-col z-40">
      <div className="flex items-center justify-center lg:justify-start px-3 lg:px-5 h-20 lg:h-24 border-b border-white/10">
        <Link to="/" aria-label="Accueil">
          <span className="lg:hidden flex w-11 h-11 rounded-xl bg-white items-center justify-center p-1.5">
            <img src="/logo-mark.png" alt="Elikia Database" className="w-full h-auto" />
          </span>
          <span className="hidden lg:block"><Logo variant="dark" /></span>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-6">
        <div className="space-y-1">
          <SectionLabel>NAVIGATION</SectionLabel>
          {mainLinks.map((l) => <Item key={l.to} {...l} />)}
        </div>

        {isAdmin && (
          <div className="space-y-1">
            <SectionLabel gold>ADMINISTRATION</SectionLabel>
            {adminLinks.map((l) => <Item key={l.to} {...l} />)}
          </div>
        )}
      </nav>

      <div className="p-3 lg:p-4 border-t border-white/10 space-y-3">
        <div className="hidden lg:block"><InstallAppButton /></div>
        <div className="flex flex-col lg:flex-row items-center gap-3 lg:p-3 rounded-xl lg:bg-forest-soft">
          <div
            className="w-10 h-10 shrink-0 rounded-full bg-elikia-bright/20 border border-elikia-bright/40 text-elikia-bright flex items-center justify-center text-sm font-semibold"
            title={user?.name}
          >
            {initials}
          </div>
          <div className="hidden lg:block flex-1 min-w-0">
            <p className="text-sm text-white font-medium truncate">{user?.name}</p>
            <p className="text-xs text-white/50 truncate">{user?.email}</p>
          </div>
          <button onClick={onLogout} className="p-2 text-white/60 hover:text-white" aria-label="Déconnexion" title="Déconnexion">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
}
