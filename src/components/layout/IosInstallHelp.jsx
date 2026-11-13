// Marche à suivre pour installer l'application sur iPhone / iPad (Safari n'a pas de bouton). Rama
import { Download, Share, SquarePlus } from 'lucide-react';
import Modal from '../ui/Modal';

const step = 'w-7 h-7 shrink-0 rounded-full bg-elikia-light text-elikia-dark font-semibold flex items-center justify-center';

export default function IosInstallHelp({ open, onClose }) {
  return (
    <Modal open={open} onClose={onClose} icon={Download} title="Installer l'application" description="Ajoutez Elikia Database à l'écran d'accueil de votre iPhone ou iPad." size="sm">
      <ol className="space-y-4 text-sm text-slate-700">
        <li className="flex items-start gap-3">
          <span className={step}>1</span>
          <span>Dans Safari, touchez le bouton <Share size={16} className="inline -mt-1 text-elikia" /> <strong>Partager</strong>.</span>
        </li>
        <li className="flex items-start gap-3">
          <span className={step}>2</span>
          <span>Choisissez <SquarePlus size={16} className="inline -mt-1 text-elikia" /> <strong>Sur l'écran d'accueil</strong>.</span>
        </li>
        <li className="flex items-start gap-3">
          <span className={step}>3</span>
          <span>Touchez <strong>Ajouter</strong>. L'application apparaît avec son icône.</span>
        </li>
      </ol>
    </Modal>
  );
}
