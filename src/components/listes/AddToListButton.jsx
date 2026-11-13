// Bouton « Ajouter à une liste » pour une seule entreprise (Rama, P1)
// Sur la fiche entreprise :  <AddToListButton companyId={company.id} />
// Version compacte (icône seule) : <AddToListButton companyId={company.id} compact />
import { useCallback, useEffect, useState } from 'react';
import { FolderPlus, FolderCheck } from 'lucide-react';
import api from '../../api/client';
import AddToListModal from './AddToListModal';
import Toast from '../ui/Toast';
import { addResultToast } from './addResultMessage';

export default function AddToListButton({ companyId, compact = false }) {
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [toast, setToast] = useState(null);
  const closeToast = useCallback(() => setToast(null), []);

  const refresh = useCallback(() => {
    api.get(`/lists/company/${companyId}`).then(({ data }) => setSaved(data.length > 0)).catch(() => {});
  }, [companyId]);

  useEffect(() => { refresh(); }, [refresh]);

  const Icon = saved ? FolderCheck : FolderPlus;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`inline-flex items-center justify-center gap-2 h-10 rounded-full border text-sm font-medium transition-colors
          ${compact ? 'w-10' : 'px-4'}
          ${saved ? 'border-elikia/40 bg-elikia-light text-elikia' : 'border-line bg-white text-ink hover:bg-slate-50'}`}
        aria-label="Ajouter à une liste"
        title={saved ? 'Déjà dans au moins une de vos listes' : 'Ajouter à une liste'}
      >
        <Icon size={18} />
        {!compact && 'Ajouter à une liste'}
      </button>

      <AddToListModal
        open={open}
        onClose={() => setOpen(false)}
        companyIds={[companyId]}
        onDone={(result) => { setToast(addResultToast(result)); refresh(); }}
      />
      <Toast toast={toast} onClose={closeToast} />
    </>
  );
}
