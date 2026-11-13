// Onglet « Paramètres » : notifications, langue, apparence, installation de l'application. Responsable : Rama
// Les choix sont gardés dans le navigateur (localStorage). Seuls le français et le thème clair
// existent pour le MVP : les autres options sont affichées « Bientôt ».
import { useState } from 'react';
import useInstallPrompt from '../../utils/useInstallPrompt';
import IosInstallHelp from '../layout/IosInstallHelp';
import { Settings, Bell, Globe, Monitor, Sun, Moon, Check, Smartphone, Download, CheckCircle2 } from 'lucide-react';
import Card from '../ui/Card';
import SectionHeader from './SectionHeader';

const KEY = 'elikia-preferences';

function loadPrefs() {
  try {
    return { notifications: true, ...JSON.parse(localStorage.getItem(KEY) || '{}') };
  } catch {
    return { notifications: true };
  }
}

function Row({ icon: Icon, title, text, children }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 py-5 border-b border-line last:border-0">
      <div className="flex items-start gap-4 flex-1 min-w-0">
        <Icon size={22} className="text-elikia shrink-0 mt-0.5" />
        <div className="min-w-0">
          <p className="font-semibold text-navy">{title}</p>
          <p className="text-sm text-slate-500">{text}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

const themes = [
  { id: 'clair', label: 'Clair', icon: Sun, ready: true },
  { id: 'auto', label: 'Automatique', icon: Monitor, ready: false },
  { id: 'sombre', label: 'Sombre', icon: Moon, ready: false },
];

export default function SettingsTab() {
  const [prefs, setPrefs] = useState(loadPrefs);
  const { canInstall, isIOS, installed, install } = useInstallPrompt();
  const [iosHelp, setIosHelp] = useState(false);

  function update(next) {
    const merged = { ...prefs, ...next };
    setPrefs(merged);
    try { localStorage.setItem(KEY, JSON.stringify(merged)); } catch { /* navigateur privé */ }
  }

  return (
    <Card>
      <SectionHeader icon={Settings} title="Paramètres" text="Personnalisez votre expérience sur Elikia Database." />

      <Row icon={Bell} title="Notifications" text="Recevoir les mises à jour et informations importantes.">
        <button
          type="button"
          role="switch"
          aria-checked={prefs.notifications}
          aria-label="Notifications"
          onClick={() => update({ notifications: !prefs.notifications })}
          className={`self-end sm:self-auto relative w-12 h-7 rounded-full transition-colors ${prefs.notifications ? 'bg-elikia' : 'bg-slate-300'}`}
        >
          <span className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow transition-transform ${prefs.notifications ? 'translate-x-5' : ''}`} />
        </button>
      </Row>

      <Row icon={Smartphone} title="Application" text="Installez Elikia Database sur votre téléphone ou votre ordinateur, comme une application.">
        {installed ? (
          <span className="self-start sm:self-auto inline-flex items-center gap-2 text-sm font-medium text-elikia-dark">
            <CheckCircle2 size={18} /> Déjà installée
          </span>
        ) : canInstall || isIOS ? (
          <button
            type="button"
            onClick={() => (canInstall ? install() : setIosHelp(true))}
            className="self-start sm:self-auto inline-flex items-center gap-2 h-11 px-5 rounded-full bg-gold text-navy text-sm font-semibold hover:brightness-105"
          >
            <Download size={18} /> Installer
          </button>
        ) : (
          <span className="text-xs text-slate-400 sm:max-w-48 sm:text-right">
            Ouvrez le site dans Chrome ou Edge pour l'installer (ou utilisez le menu du navigateur).
          </span>
        )}
      </Row>
      <IosInstallHelp open={iosHelp} onClose={() => setIosHelp(false)} />

      <Row icon={Globe} title="Langue" text="Langue d'affichage de la plateforme.">
        <select
          className="h-11 rounded-xl border border-line bg-white px-4 text-sm focus:outline-none focus:ring-2 focus:ring-elikia/30 focus:border-elikia sm:w-44"
          value="fr"
          onChange={() => {}}
        >
          <option value="fr">Français</option>
          <option value="en" disabled>English (bientôt)</option>
        </select>
      </Row>

      <div className="pt-5">
        <div className="flex items-start gap-4 mb-4">
          <Monitor size={22} className="text-elikia shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-navy">Apparence</p>
            <p className="text-sm text-slate-500">Choisissez le thème de l'interface.</p>
          </div>
        </div>
        <div className="grid sm:grid-cols-3 gap-3">
          {themes.map(({ id, label, icon: Icon, ready }) => {
            const active = id === 'clair';
            return (
              <button
                key={id}
                type="button"
                disabled={!ready}
                className={`flex items-center gap-3 h-12 px-4 rounded-xl border text-sm font-medium transition-colors ${
                  active ? 'border-elikia bg-elikia-light text-elikia-dark' : 'border-line text-slate-400 cursor-not-allowed'
                }`}
              >
                <Icon size={18} />
                <span className="flex-1 text-left">{label}</span>
                {active ? <Check size={18} /> : <span className="text-[11px] font-normal">Bientôt</span>}
              </button>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
