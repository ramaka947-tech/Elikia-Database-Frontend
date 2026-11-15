// Statut de la fiche : icône + libellé (vert = actif, rouge = à vérifier, gris = inactif)
import { CheckCircle2, AlertCircle, MinusCircle } from 'lucide-react';

const STATUS = {
  actif: { cls: 'text-elikia', label: 'Actif', Icon: CheckCircle2 },
  a_verifier: { cls: 'text-red-600', label: 'À vérifier', Icon: AlertCircle },
  inactif: { cls: 'text-slate-400', label: 'Inactif', Icon: MinusCircle },
};

export default function StatusBadge({ status }) {
  const s = STATUS[status];
  if (!s) return null;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium ${s.cls}`}>
      <s.Icon size={13} aria-hidden="true" /> {s.label}
    </span>
  );
}
