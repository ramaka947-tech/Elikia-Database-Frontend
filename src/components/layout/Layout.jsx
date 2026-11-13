// Layout commun : sidebar + barre du haut + contenu (fichier partagé, géré par Rama)
// Tablette et ordinateur : sidebar à gauche (étroite sur tablette), titre de la page dans la barre du haut.
// Téléphone : barre de navigation en bas, titre de la page en haut du contenu.
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getPageTitle } from '../../utils/pageTitles';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import BottomNav from './BottomNav';

export default function Layout() {
  const { logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { title, text, mobile = true } = getPageTitle(pathname, isAdmin);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="min-h-screen flex">
      <Sidebar onLogout={handleLogout} />

      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar onLogout={handleLogout} />
        <main className="flex-1 px-4 sm:px-6 lg:px-8 pt-6 pb-32 sm:pb-8">
          {title && mobile && (
            <div className="sm:hidden mb-5">
              <h1 className="font-serif text-3xl text-navy">{title}</h1>
              {text && <p className="mt-1 text-slate-500">{text}</p>}
            </div>
          )}
          <Outlet />
        </main>
      </div>

      <BottomNav />
    </div>
  );
}
