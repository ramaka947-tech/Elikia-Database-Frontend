// Barre du haut (fichier partagé, géré par Rama), en bleu nuit
// Téléphone : logo à gauche ; le titre de la page est affiché dans la page (Layout).
// Tablette et ordinateur (sidebar visible) : titre + phrase d'introduction à gauche.
// À droite : badge du rôle, icône Messages (avec les non lus), puis l'avatar (menu : Déconnexion).
import { Link, useLocation } from 'react-router-dom';
import { Crown, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getPageTitle } from '../../utils/pageTitles';
import Logo from './Logo';
import UserMenu from './UserMenu';
import MessagesButton from './MessagesButton';

export default function Topbar({ onLogout }) {
  const { isAdmin } = useAuth();
  const { pathname } = useLocation();
  const { title, text } = getPageTitle(pathname, isAdmin);
  const RoleIcon = isAdmin ? Crown : User;

  return (
    <header className="sticky top-0 z-30 h-16 sm:h-20 lg:h-24 bg-navy border-b border-white/10 sm:border-l sm:border-l-white/10">
      <div className="h-full px-4 sm:px-8 flex items-center justify-between gap-4">
        <Link to="/tableau-de-bord" className="sm:hidden shrink-0" aria-label="Accueil de l'espace">
          <Logo variant="dark" />
        </Link>
        <div className="hidden sm:block min-w-0">
          <h1 className="font-serif text-2xl lg:text-3xl text-white truncate">{title}</h1>
          {text && <p className="text-sm text-white/60 truncate mt-0.5">{text}</p>}
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <span
            className={`inline-flex items-center gap-1.5 h-8 sm:h-9 px-2.5 sm:px-4 rounded-full text-xs sm:text-sm font-medium ${
              isAdmin ? 'bg-gold/15 text-gold border border-gold/30' : 'bg-white/10 text-white/80 border border-white/15'
            }`}
            title={isAdmin ? 'Administrateur' : 'Utilisateur'}
          >
            <RoleIcon size={16} />
            <span className="hidden min-[400px]:inline">{isAdmin ? 'Administrateur' : 'Utilisateur'}</span>
          </span>
          <MessagesButton />
          <UserMenu onLogout={onLogout} />
        </div>
      </div>
    </header>
  );
}
