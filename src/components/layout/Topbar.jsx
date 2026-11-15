// Barre du haut : fil d'Ariane + action principale (fichier partagé, géré par Rama)
import { Link, useLocation } from 'react-router-dom';
import { Menu, Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

function getTitle(pathname) {
  if (pathname === '/') return 'Tableau de bord';
  if (pathname === '/vitrine') return 'Accueil (Vitrine)';
  if (pathname === '/listes') return 'Mes listes';
  if (pathname === '/profil') return 'Profil & Accès';
  if (pathname === '/entreprises') return 'Répertoire des entreprises';
  if (pathname === '/entreprises/nouveau') return 'Ajouter une entreprise';
  if (pathname.endsWith('/modifier')) return 'Modifier une entreprise';
  if (pathname.startsWith('/entreprises/')) return 'Fiche entreprise';
  if (pathname === '/admin/import') return 'Import CSV';
  return '';
}

export default function Topbar({ onMenu }) {
  const { isAdmin } = useAuth();
  const { pathname } = useLocation();
  const title = getTitle(pathname);

  return (
    <header className="sticky top-0 z-20 h-20 bg-white border-b border-line">
      <div className="h-full px-4 sm:px-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <button className="lg:hidden text-navy" onClick={onMenu} aria-label="Ouvrir le menu"><Menu size={24} /></button>
          <nav aria-label="Fil d’Ariane" className="flex items-center gap-2 text-sm truncate">
            {pathname !== '/' && <><Link to="/" className="text-slate-500 hover:text-navy">Tableau de bord</Link><span className="text-slate-300">/</span></>}
            <span className="font-semibold text-navy truncate">{title}</span>
          </nav>
        </div>

        {isAdmin && (
          <Link
            to="/entreprises/nouveau"
            className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-elikia text-white text-sm font-medium hover:bg-elikia-dark"
          >
            <Plus size={16} aria-hidden="true" /> <span className="hidden sm:inline">Ajouter une entreprise</span>
          </Link>
        )}
      </div>
    </header>
  );
}
