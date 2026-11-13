// Menu « ⋯ » partagé (Rama)
// <ActionMenu items={[{ label, icon, onClick, danger }, ...]} />
// Le menu s'ouvre du côté où il a la place : il ne sort jamais de l'écran,
// et il s'ouvre vers le haut s'il risque de passer sous la barre du bas (téléphone).
import { useEffect, useRef, useState } from 'react';
import { MoreHorizontal } from 'lucide-react';

const MENU_WIDTH = 240; // w-60
const BOTTOM_SPACE = 110; // hauteur de la barre de navigation mobile + marge

export default function ActionMenu({ items, label = 'Actions', bordered = false }) {
  const [open, setOpen] = useState(false);
  const [place, setPlace] = useState({ left: false, up: false });
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const close = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    const closeOnScroll = () => setOpen(false);
    document.addEventListener('mousedown', close);
    document.addEventListener('touchstart', close);
    window.addEventListener('resize', closeOnScroll);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('touchstart', close);
      window.removeEventListener('resize', closeOnScroll);
    };
  }, [open]);

  function toggle(e) {
    e.stopPropagation();
    if (!open && ref.current) {
      const r = ref.current.getBoundingClientRect();
      const menuHeight = items.length * 44 + 16;
      setPlace({
        // pas assez de place à gauche du bouton : le menu part vers la droite
        left: r.right < MENU_WIDTH + 8,
        // pas assez de place en dessous : le menu s'ouvre vers le haut
        up: r.bottom + menuHeight > window.innerHeight - BOTTOM_SPACE && r.top > menuHeight + 8,
      });
    }
    setOpen(!open);
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={toggle}
        className={`w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-ink ${bordered ? 'border border-line bg-white' : ''}`}
        aria-label={label}
        aria-expanded={open}
      >
        <MoreHorizontal size={20} />
      </button>
      {open && (
        <ul
          className={`absolute z-40 w-60 max-w-[calc(100vw-2rem)] rounded-2xl border border-line bg-white p-1.5 shadow-xl
            ${place.left ? 'left-0' : 'right-0'} ${place.up ? 'bottom-full mb-2' : 'top-full mt-2'}`}
        >
          {items.map(({ label: text, icon: Icon, onClick, danger }) => (
            <li key={text}>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setOpen(false); onClick(); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-left ${
                  danger ? 'text-red-600 hover:bg-red-50' : 'text-ink hover:bg-slate-50'
                }`}
              >
                {Icon && <Icon size={18} className="shrink-0" />} {text}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
