// Bouton "Installer l'application" (PWA) de la sidebar. Responsable : Rama
// Il n'apparaît que si le navigateur propose l'installation (site en HTTPS, pas encore installé).
// La logique est dans utils/useInstallPrompt.js (partagée avec le menu du compte).
import { Download } from 'lucide-react';
import useInstallPrompt from '../../utils/useInstallPrompt';

export default function InstallAppButton({ className = '' }) {
  const { canInstall, install } = useInstallPrompt();
  if (!canInstall) return null;

  return (
    <button
      onClick={install}
      className={`w-full inline-flex items-center justify-center gap-2 h-11 rounded-full bg-gold text-forest text-sm font-semibold hover:brightness-105 ${className}`}
    >
      <Download size={18} /> Installer l'application
    </button>
  );
}
