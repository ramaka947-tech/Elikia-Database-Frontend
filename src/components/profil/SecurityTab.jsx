// Onglet « Sécurité » : changement du mot de passe. Responsable : Rama
import { useState } from 'react';
import { Lock, Info } from 'lucide-react';
import api from '../../api/client';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import SectionHeader from './SectionHeader';

const empty = { current: '', next: '', confirm: '' };

// Au moins 8 caractères, une majuscule, une minuscule et un chiffre
function checkPassword(p) {
  if (p.length < 8) return 'Le nouveau mot de passe doit contenir au moins 8 caractères.';
  if (!/[A-Z]/.test(p) || !/[a-z]/.test(p) || !/[0-9]/.test(p)) {
    return 'Le nouveau mot de passe doit contenir une majuscule, une minuscule et un chiffre.';
  }
  return null;
}

export default function SecurityTab({ onToast }) {
  const [pwd, setPwd] = useState(empty);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const set = (field) => (e) => setPwd({ ...pwd, [field]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setError('');
    const problem = checkPassword(pwd.next);
    if (problem) return setError(problem);
    if (pwd.next !== pwd.confirm) return setError('Les deux nouveaux mots de passe ne correspondent pas.');

    setSaving(true);
    try {
      await api.patch('/auth/password', { currentPassword: pwd.current, newPassword: pwd.next });
      setPwd(empty);
      onToast({ type: 'success', title: 'Mot de passe modifié', text: 'Utilisez-le lors de votre prochaine connexion.' });
    } catch (err) {
      setError(err.response?.data?.message || 'Modification impossible.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <SectionHeader icon={Lock} title="Sécurité du compte" text="Protégez votre compte avec un mot de passe robuste." />

      <form onSubmit={submit} className="space-y-4 max-w-xl">
        <Input label="Mot de passe actuel *" type="password" autoComplete="current-password" value={pwd.current} onChange={set('current')} required />
        <Input label="Nouveau mot de passe *" type="password" autoComplete="new-password" value={pwd.next} onChange={set('next')} required />
        <Input label="Confirmer le nouveau mot de passe *" type="password" autoComplete="new-password" value={pwd.confirm} onChange={set('confirm')} required />

        <p className="flex items-start gap-3 text-sm rounded-xl px-4 py-3 bg-elikia-light text-elikia-dark">
          <Info size={18} className="shrink-0 mt-0.5" />
          Le mot de passe doit contenir au moins 8 caractères, avec une majuscule, une minuscule et un chiffre.
        </p>
        {error && <p className="text-sm rounded-xl px-4 py-3 bg-red-50 text-red-600">{error}</p>}

        <Button type="submit" className="w-full sm:w-auto" disabled={saving || !pwd.current || !pwd.next || !pwd.confirm}>
          <Lock size={16} /> {saving ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}
        </Button>
      </form>
    </Card>
  );
}
