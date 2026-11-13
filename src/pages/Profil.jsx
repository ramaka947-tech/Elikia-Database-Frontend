// Responsable : Rama (P1)
// Mon compte : onglets Profil, Paramètres, Sécurité, Conditions, Confidentialité
// (+ Accès et Coordonnées pour les admins).
// L'onglet ouvert est gardé dans l'adresse (ex : /profil?onglet=securite) pour pouvoir y revenir.
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { User, Settings, Lock, FileText, ShieldCheck, Users, Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/ui/Toast';
import ProfileTab from '../components/profil/ProfileTab';
import SettingsTab from '../components/profil/SettingsTab';
import SecurityTab from '../components/profil/SecurityTab';
import { ConditionsTab, PrivacyTab } from '../components/profil/LegalTabs';
import AccessManagement from '../components/profil/AccessManagement';
import ContactSettingsTab from '../components/profil/ContactSettingsTab';

const baseTabs = [
  { id: 'profil', label: 'Profil', icon: User },
  { id: 'parametres', label: 'Paramètres', icon: Settings },
  { id: 'securite', label: 'Sécurité', icon: Lock },
  { id: 'conditions', label: 'Conditions', longLabel: "Conditions d'utilisation", icon: FileText },
  { id: 'confidentialite', label: 'Confidentialité', icon: ShieldCheck },
];
const adminTabs = [
  { id: 'acces', label: 'Accès', longLabel: 'Gestion des accès', icon: Users },
  { id: 'coordonnees', label: 'Coordonnées', icon: Phone },
];

export default function Profil() {
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [toast, setToast] = useState(null);

  const tabs = isAdmin ? [...baseTabs, ...adminTabs] : baseTabs;
  const current = tabs.some((t) => t.id === params.get('onglet')) ? params.get('onglet') : 'profil';

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="space-y-5">

      {/* Onglets, tous visibles sans défiler :
          téléphone : 5 sur une ligne (client) ou 4 + 3 sur deux lignes (admin) ;
          grand écran : une seule ligne qui prend toute la largeur (noms longs à partir de 2xl). */}
      <nav
        className={`bg-white rounded-2xl border border-line p-1.5 grid gap-1 xl:flex ${isAdmin ? 'grid-cols-4 md:grid-cols-7' : 'grid-cols-5'}`}
        aria-label="Sections du compte"
      >
        {tabs.map(({ id, label, longLabel, icon: Icon }) => {
          const active = id === current;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setParams(id === 'profil' ? {} : { onglet: id }, { replace: true })}
              aria-current={active ? 'page' : undefined}
              className={`xl:flex-1 min-w-0 xl:min-w-max flex flex-col xl:flex-row items-center justify-center gap-1 xl:gap-2 px-1 xl:px-2 py-2.5 rounded-xl text-[10px] sm:text-[11px] xl:text-sm font-medium whitespace-nowrap transition-colors ${
                active ? 'bg-elikia-light text-elikia-dark' : 'text-slate-500 hover:bg-slate-50 hover:text-navy'
              }`}
            >
              <Icon size={20} className="shrink-0" />
              <span className="2xl:hidden">{label}</span>
              <span className="hidden 2xl:inline">{longLabel || label}</span>
            </button>
          );
        })}
      </nav>

      {current === 'profil' && <ProfileTab onToast={setToast} onLogout={handleLogout} />}
      {current === 'parametres' && <SettingsTab />}
      {current === 'securite' && <SecurityTab onToast={setToast} />}
      {current === 'conditions' && <ConditionsTab />}
      {current === 'confidentialite' && <PrivacyTab />}
      {current === 'acces' && isAdmin && <AccessManagement />}
      {current === 'coordonnees' && isAdmin && <ContactSettingsTab onToast={setToast} />}

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
