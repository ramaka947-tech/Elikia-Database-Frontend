// Fenêtre modale partagée (Rama)
// <Modal open={open} onClose={...} title="Titre" icon={FolderPlus} description="...">contenu</Modal>
// Affichée directement dans <body> (portail) : elle couvre tout l'écran même si elle est ouverte
// depuis la barre du haut ou un autre bloc.
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export default function Modal({ open, onClose, title, description, icon: Icon, tone = 'green', children, size = 'md' }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  const tones = { green: 'bg-elikia-light text-elikia', red: 'bg-red-50 text-red-600', gold: 'bg-gold-light text-amber-700' };
  const widths = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl' };

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-forest/40 backdrop-blur-[2px]" onClick={onClose} />
      <div className={`relative w-full ${widths[size]} bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[92vh] overflow-y-auto`}>
        <div className="flex items-start gap-4 p-6 sm:p-7 pb-0 sm:pb-0">
          {Icon && (
            <div className={`w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center ${tones[tone]}`}>
              <Icon size={22} />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h2 className="font-serif text-2xl text-forest">{title}</h2>
            {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
          </div>
          <button onClick={onClose} className="-mr-2 -mt-1 p-2 rounded-full text-slate-400 hover:bg-slate-100 hover:text-ink" aria-label="Fermer">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 sm:p-7">{children}</div>
      </div>
    </div>,
    document.body
  );
}
