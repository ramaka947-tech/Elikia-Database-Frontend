// Barre de navigation mobile (fichier partagé, géré par Rama)
// Visible uniquement sur téléphone (cachée à partir de 640 px, où la sidebar prend le relais).
// L'élément actif « sort » de la barre dans une bulle, qui glisse d'un onglet à l'autre.
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Building2, Bookmark, UserCircle, Upload } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const userItems = [
  { to: '/tableau-de-bord', label: 'Tableau de bord', icon: LayoutDashboard },
  { to: '/entreprises', label: 'Répertoire', icon: Building2 },
  { to: '/listes', label: 'Mes listes', icon: Bookmark },
  { to: '/profil', label: 'Mon compte', icon: UserCircle },
];

// L'admin n'a pas de listes : on lui met l'Import CSV à la place
const adminItems = [userItems[0], userItems[1], { to: '/admin/import', label: 'Import CSV', icon: Upload }, userItems[3]];

export default function BottomNav() {
  const { isAdmin } = useAuth();
  const { pathname } = useLocation();
  const items = isAdmin ? adminItems : userItems;

  // Onglet actif : la page courante commence par son adresse (ex : /listes/123 -> Mes listes)
  const active = items.findIndex((it) => pathname === it.to || pathname.startsWith(`${it.to}/`));
  const ActiveIcon = active >= 0 ? items[active].icon : null;

  return (
    <nav className="sm:hidden fixed bottom-0 inset-x-0 z-30 pb-[env(safe-area-inset-bottom)] bg-white rounded-t-[28px] shadow-[0_-8px_30px_rgba(19,27,43,0.10)]" aria-label="Navigation principale">
      <div className="relative grid grid-cols-4 h-[72px] max-w-lg mx-auto">
        {/* Bulle de l'onglet actif : le contour couleur de page crée l'effet d'encoche */}
        {active >= 0 && (
          <div
            className="absolute -top-7 w-14 h-14 -translate-x-1/2 rounded-full bg-elikia text-white flex items-center justify-center ring-[6px] ring-cream shadow-lg shadow-elikia/30 transition-[left] duration-300 ease-out"
            style={{ left: `${active * 25 + 12.5}%` }}
            aria-hidden="true"
          >
            <ActiveIcon size={24} />
          </div>
        )}

        {items.map(({ to, label, icon: Icon }, i) => {
          const isActive = i === active;
          return (
            <NavLink
              key={to}
              to={to}
              className="flex flex-col items-center justify-end pb-2.5 gap-1 text-center"
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon size={22} className={`transition-opacity duration-200 ${isActive ? 'opacity-0' : 'text-slate-400'}`} />
              <span className={`text-[11px] leading-tight px-1 ${isActive ? 'font-semibold text-elikia' : 'text-slate-500'}`}>{label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
