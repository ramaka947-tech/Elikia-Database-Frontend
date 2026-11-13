// Layout commun : sidebar + barre du haut + contenu (fichier partagé, géré par Rama)
import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function Layout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="min-h-screen flex">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} onLogout={handleLogout} />

      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar onMenu={() => setMenuOpen(true)} onLogout={handleLogout} />
        <main className="flex-1 px-4 sm:px-8 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
