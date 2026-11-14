// Onglet « Sécurité » : changement du mot de passe. Responsable : Rama
import { useState } from 'react';
import { Lock, Info } from 'lucide-react';
import api from '../../api/client';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import SectionHeader from './SectionHeader';
import { checkPassword, LIMITS } from '../../utils/validation';

const empty = { current: '', next: '', confirm: '' };

export default function SecurityTab({ onToast }) {
  const [pwd, setPwd] = useState(empty);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const set = (field) => (e) => { setPwd({ ...pwd, [field]: e.target.value }); setErrors({ ...errors, [field]: null }); };

  async function submit(e) {
    e.preventDefault();
    setError('');
    const next = {
      current: pwd.current ? null : 'Saisissez votre mot de passe actuel.',
      next: checkPassword(pwd.next) || (pwd.next === pwd.current ? "Le nouveau mot de passe doit être différent de l'actuel." : null),
      confirm: !pwd.confirm ? 'Confirmez le nouveau mot de passe.' : pwd.next !== pwd.confirm ? 'Les deux nouveaux mots de passe ne correspondent pas.' : null,
    };
    setErrors(next);
    if (Object.values(next).some(Boolean)) return;

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

      <form onSubmit={submit} className="space-y-4 max-w-xl" noValidate>
        <Input label="Mot de passe actuel *" type="password" autoComplete="current-password" maxLength={LIMITS.passwordMax} value={pwd.current} onChange={set('current')} error={errors.current} />
        <Input label="Nouveau mot de passe *" type="password" autoComplete="new-password" maxLength={LIMITS.passwordMax} value={pwd.next} onChange={set('next')} error={errors.next} />
        <Input label="Confirmer le nouveau mot de passe *" type="password" autoComplete="new-password" maxLength={LIMITS.passwordMax} value={pwd.confirm} onChange={set('confirm')} error={errors.confirm} />

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
