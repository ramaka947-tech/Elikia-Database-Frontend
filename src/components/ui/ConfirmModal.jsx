// Confirmation d'une action sensible (Rama)
import { Trash2 } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';

export default function ConfirmModal({ open, onClose, onConfirm, title, message, confirmLabel = 'Confirmer', loading = false, icon = Trash2 }) {
  return (
    <Modal open={open} onClose={onClose} title={title} icon={icon} tone="red" size="sm">
      <p className="text-slate-600">{message}</p>
      <div className="mt-6 grid grid-cols-2 gap-3">
        <Button variant="secondary" onClick={onClose} className="h-12">Annuler</Button>
        <Button variant="danger" onClick={onConfirm} disabled={loading} className="h-12">
          {loading ? 'Patientez...' : confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
