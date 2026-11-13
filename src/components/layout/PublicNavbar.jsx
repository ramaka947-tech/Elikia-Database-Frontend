// Barre de navigation des pages publiques (fichier partagé, géré par Rama)
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Logo from './Logo';

// « /#... » : les liens marchent aussi depuis les autres pages publiques (ex : /conditions)
const links = [
  { href: '/#fonctionnalites', label: 'Fonctionnalités' },
  { href: '/#fonctionnement', label: 'Comment ça marche' },
  { href: '/#pour-qui', label: 'Pour qui ?' },
];

export default function PublicNavbar() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  const actions = user ? (
    <Link to="/tableau-de-bord" className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-full bg-elikia text-white text-sm font-medium hover:bg-elikia-dark">
      Mon espace <ArrowRight size={16} />
    </Link>
  ) : (
    <>
      <Link to="/login" className="inline-flex items-center justify-center h-11 px-5 rounded-full text-sm font-medium text-ink hover:bg-slate-100">
        Se connecter
      </Link>
      <Link to="/inscription" className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-full bg-elikia text-white text-sm font-medium hover:bg-elikia-dark">
        Créer un compte <ArrowRight size={16} />
      </Link>
    </>
  );

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-line">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-20 flex items-center justify-between gap-6">
        <Link to="/" onClick={() => setOpen(false)}><Logo variant="full" /></Link>

        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-600">
          {links.map((l) => <Link key={l.href} to={l.href} className="hover:text-elikia">{l.label}</Link>)}
        </nav>

        <div className="hidden lg:flex items-center gap-2">{actions}</div>

        <button className="lg:hidden p-2 -mr-2 text-forest" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-line bg-white px-5 pb-6">
          <nav className="flex flex-col py-2">
            {links.map((l) => (
              <Link key={l.href} to={l.href} onClick={() => setOpen(false)} className="py-3 text-base font-medium text-ink border-b border-line">
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col gap-2 pt-4">{actions}</div>
        </div>
      )}
    </header>
  );
}
