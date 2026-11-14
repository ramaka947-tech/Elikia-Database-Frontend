// Onglet « Profil » : avatar, rôle et modification du nom. Responsable : Rama
import { useState } from 'react';
import { User, Mail, Save, LogOut, ShieldCheck } from 'lucide-react';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { checkName, filterName, LIMITS } from '../../utils/validation';

export default function ProfileTab({ onToast, onLogout }) {
  const { user, isAdmin, setUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [saving, setSaving] = useState(false);
  const [nameError, setNameError] = useState(null);

  const initials = (user?.name || '?').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  const since = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
    : null;
  const changed = name.trim() && name.trim() !== user?.name;

  async function save(e) {
    e.preventDefault();
    const problem = checkName(name);
    setNameError(problem);
    if (problem) return;
    setSaving(true);
    try {
      const { data } = await api.patch('/auth/me', { name });
      setUser(data);
      onToast({ type: 'success', title: 'Profil mis à jour', text: 'Vos informations ont été enregistrées.' });
    } catch (err) {
      onToast({ type: 'error', title: 'Enregistrement impossible', text: err.response?.data?.message });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      {/* Avatar + nom + rôle (centré sur téléphone, aligné à gauche sur ordinateur) */}
      <div className="flex flex-col sm:flex-row items-center sm:items-center gap-5 text-center sm:text-left">
        <div className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-full bg-navy text-gold font-serif text-4xl flex items-center justify-center ring-4 ring-elikia-light">
          {initials}
        </div>
        <div className="min-w-0">
          <h3 className="font-serif text-2xl text-navy truncate">{user?.name}</h3>
          <span
            className={`mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${
              isAdmin ? 'bg-gold-light text-amber-800' : 'bg-elikia-light text-elikia-dark'
            }`}
          >
            {isAdmin ? <ShieldCheck size={15} /> : <User size={15} />}
            {isAdmin ? 'Administrateur' : 'Compte utilisateur'}
          </span>
          {since && <p className="text-xs text-slate-400 mt-2">Membre depuis le {since}</p>}
        </div>
      </div>

      <hr className="my-6 border-line" />

      <form onSubmit={save} className="space-y-4" noValidate>
        <h3 className="font-semibold text-navy text-lg">Informations personnelles</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Nom complet *" icon={User} maxLength={LIMITS.name} value={name} onChange={(e) => { setName(filterName(e.target.value)); setNameError(null); }} error={nameError} hint="Lettres uniquement (espaces, tirets et apostrophes acceptés)." />
          <div>
            <Input label="Email" icon={Mail} value={user?.email || ''} disabled className="bg-slate-50 text-slate-500" />
            <p className="text-xs text-slate-400 mt-1.5">L'adresse email ne peut pas être modifiée.</p>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={() => { setName(user?.name || ''); setNameError(null); }} disabled={!changed}>
            Annuler
          </Button>
          <Button type="submit" disabled={!changed || saving}>
            <Save size={16} /> {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </Button>
        </div>
      </form>

      {/* Sur téléphone, la déconnexion n'est pas dans la barre du haut : on la met ici */}
      <button
        onClick={onLogout}
        className="sm:hidden mt-6 w-full flex items-center justify-center gap-2 h-11 rounded-full border border-red-200 text-red-600 text-sm font-medium"
      >
        <LogOut size={16} /> Se déconnecter
      </button>
    </Card>
  );
}
