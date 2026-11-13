// Barre du haut (fichier partagé, géré par Rama)
import { useLocation } from 'react-router-dom';
import { Menu, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Badge from '../ui/Badge';

// Titre affiché selon la page
function getTitle(pathname) {
  if (pathname === '/') return 'Tableau de bord';
  if (pathname === '/entreprises') return 'Répertoire des entreprises';
  if (pathname === '/entreprises/nouveau') return 'Ajouter une entreprise';
  if (pathname.endsWith('/modifier')) return 'Modifier une entreprise';
  if (pathname.startsWith('/entreprises/')) return 'Fiche entreprise';
  if (pathname === '/admin/import') return 'Import CSV';
  return '';
}

export default function Topbar({ onMenu, onLogout }) {
  const { user, isAdmin } = useAuth();
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-20 h-20 bg-white/90 backdrop-blur border-b border-line">
      <div className="h-full px-4 sm:px-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <button className="lg:hidden text-navy" onClick={onMenu} aria-label="Ouvrir le menu">
            <Menu size={24} />
          </button>
          <h1 className="font-serif text-2xl sm:text-3xl text-navy truncate">{getTitle(pathname)}</h1>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Badge color={isAdmin ? 'gold' : 'gray'}>{isAdmin ? 'Administrateur' : 'Utilisateur'}</Badge>
          <span className="hidden sm:block text-sm text-slate-600">{user?.name}</span>
          <button
            onClick={onLogout}
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full border border-line text-sm text-slate-700 hover:bg-slate-50"
          >
            <LogOut size={16} /> Déconnexion
          </button>
        </div>
      </div>
    </header>
  );
}
