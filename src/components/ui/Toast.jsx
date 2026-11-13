// Notification temporaire (Rama)
// Sur téléphone, elle s'affiche au-dessus de la barre de navigation du bas.
// const [toast, setToast] = useState(null);  setToast({ type: 'success', title: '...', text: '...' })
// <Toast toast={toast} onClose={() => setToast(null)} />
import { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function Toast({ toast, onClose, duration = 4500 }) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [toast, onClose, duration]);

  if (!toast) return null;
  const ok = toast.type !== 'error';
  const Icon = ok ? CheckCircle2 : AlertCircle;

  return (
    <div className="fixed z-[70] bottom-28 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 sm:bottom-6" role="status">
      <div className={`flex items-start gap-3 rounded-2xl border bg-white p-4 shadow-xl ${ok ? 'border-elikia/30' : 'border-red-200'}`}>
        <Icon size={22} className={`shrink-0 ${ok ? 'text-elikia' : 'text-red-600'}`} />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-ink">{toast.title}</p>
          {toast.text && <p className="text-sm text-slate-500 mt-0.5">{toast.text}</p>}
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-ink" aria-label="Fermer"><X size={18} /></button>
      </div>
    </div>
  );
}
