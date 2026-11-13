// Fenêtre « Ajouter / Modifier un utilisateur » (page Utilisateurs). Responsable : Rama
// user = null -> création ; user = { ... } -> modification (nom et rôle)
import { useEffect, useState } from 'react';
import { UserPlus, Pencil, User, Mail, Lock, Crown } from 'lucide-react';
import api from '../../api/client';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';

const roles = [
  { id: 'USER', label: 'Utilisateur', icon: User },
  { id: 'ADMIN', label: 'Administrateur', icon: Crown },
];

export default function UserFormModal({ open, user, isMe, onClose, onSaved }) {
  const editing = Boolean(user);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'USER' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm({ name: user?.name || '', email: user?.email || '', password: '', role: user?.role || 'USER' });
    setError('');
  }, [open, user]);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setError('');
    if (!editing && form.password.length < 8) return setError('Le mot de passe doit contenir au moins 8 caractères.');
    setSaving(true);
    try {
      const { data } = editing
        ? await api.patch(`/users/${user.id}`, isMe ? { name: form.name } : { name: form.name, role: form.role })
        : await api.post('/users', form);
      onSaved(data, editing);
    } catch (err) {
      setError(err.response?.data?.message || 'Enregistrement impossible.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      icon={editing ? Pencil : UserPlus}
      title={editing ? 'Modifier le compte' : 'Ajouter un utilisateur'}
      description={editing ? user.email : 'Le compte pourra se connecter immédiatement avec ce mot de passe.'}
    >
      <form onSubmit={submit} className="space-y-4">
        <Input label="Nom complet *" icon={User} placeholder="Ex : Awa Ndiaye" value={form.name} onChange={set('name')} required />
        {!editing && (
          <>
            <Input label="Adresse email *" icon={Mail} type="email" placeholder="Ex : awa@elikia.sn" autoComplete="off" value={form.email} onChange={set('email')} required />
            <Input label="Mot de passe *" icon={Lock} type="password" placeholder="8 caractères minimum" autoComplete="new-password" value={form.password} onChange={set('password')} required />
          </>
        )}

        <div>
          <span className="block text-sm font-medium text-ink mb-1.5">Rôle</span>
          <div className="grid grid-cols-2 gap-2">
            {roles.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                disabled={isMe}
                onClick={() => setForm({ ...form, role: id })}
                className={`h-12 rounded-xl border text-sm font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50 ${
                  form.role === id ? 'border-elikia bg-elikia-light text-elikia-dark' : 'border-line text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon size={16} /> {label}
              </button>
            ))}
          </div>
          {isMe && <p className="text-xs text-slate-400 mt-1.5">Vous ne pouvez pas changer votre propre rôle.</p>}
        </div>

        {error && <p className="text-sm rounded-xl px-4 py-3 bg-red-50 text-red-600">{error}</p>}

        <div className="grid grid-cols-2 gap-3 pt-1">
          <Button type="button" variant="secondary" onClick={onClose} className="h-12">Annuler</Button>
          <Button type="submit" disabled={saving || !form.name.trim()} className="h-12">
            {saving ? 'Patientez...' : editing ? 'Enregistrer' : 'Créer le compte'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
