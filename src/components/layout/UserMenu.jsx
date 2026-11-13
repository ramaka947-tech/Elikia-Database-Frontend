// Avatar de la barre du haut + menu « Déconnexion » (fichier partagé, géré par Rama)
import { useEffect, useRef, useState } from 'react';
import { ChevronDown, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function UserMenu({ onLogout }) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const initials = (user?.name || '?').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

  useEffect(() => {
    if (!open) return;
    const close = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', close);
    document.addEventListener('touchstart', close);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('touchstart', close);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-full"
        aria-label={`Compte de ${user?.name || ''}`}
        aria-expanded={open}
        title={user?.name}
      >
        <span className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-elikia text-white font-serif text-base sm:text-lg flex items-center justify-center ring-2 ring-white/20">
          {initials}
        </span>
        <ChevronDown size={18} className={`hidden lg:block text-white/70 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 z-50 w-48 rounded-2xl border border-line bg-white p-1.5 shadow-xl">
          <button
            type="button"
            onClick={() => { setOpen(false); onLogout(); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50"
          >
            <LogOut size={18} /> Déconnexion
          </button>
        </div>
      )}
    </div>
  );
}
