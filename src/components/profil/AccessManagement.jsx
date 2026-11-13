// Gestion des accès administrateurs (visible uniquement par les admins). Responsable : Rama
import { useEffect, useState } from 'react';
import { ShieldCheck, UserPlus, Trash2, User, Mail, Lock, CheckCircle2 } from 'lucide-react';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Badge from '../ui/Badge';

const empty = { name: '', email: '', password: '' };

export default function AccessManagement() {
  const { user } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [form, setForm] = useState(empty);
  const [msg, setMsg] = useState({});
  const [listError, setListError] = useState('');
  const [saving, setSaving] = useState(false);

  const loadAdmins = () => api.get('/users', { params: { role: 'ADMIN' } }).then(({ data }) => setAdmins(data));

  useEffect(() => {
    loadAdmins().catch(() => setListError('Impossible de charger les administrateurs'));
  }, []);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  async function createAdmin(e) {
    e.preventDefault();
    setMsg({});
    if (form.password.length < 8) return setMsg({ type: 'error', text: 'Le mot de passe doit contenir au moins 8 caractères' });
    setSaving(true);
    try {
      await api.post('/users/admins', form);
      setForm(empty);
      setMsg({ type: 'success', text: 'Compte administrateur créé' });
      loadAdmins();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Création impossible' });
    } finally {
      setSaving(false);
    }
  }

  async function removeAdmin(admin) {
    if (!window.confirm(`Supprimer le compte de ${admin.name} ? Cette action est définitive.`)) return;
    setListError('');
    try {
      await api.delete(`/users/${admin.id}`);
      setAdmins(admins.filter((a) => a.id !== admin.id));
    } catch (err) {
      setListError(err.response?.data?.message || 'Suppression impossible');
    }
  }

  return (
    <section>
      <div className="flex items-start gap-4 mb-5">
        <div className="w-12 h-12 shrink-0 rounded-2xl bg-forest text-gold flex items-center justify-center">
          <ShieldCheck size={24} />
        </div>
        <div>
          <h2 className="font-serif text-2xl text-forest">Gestion des accès</h2>
          <p className="text-sm text-slate-500">Gérez les personnes ayant accès à l'administration.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-6 items-start">
        <Card title={<span className="flex items-center gap-2"><UserPlus size={18} className="text-elikia" /> Nouveau compte</span>}>
          <form onSubmit={createAdmin} className="space-y-4">
            <Input label="Nom complet" icon={User} placeholder="Ex : Awa Ndiaye" value={form.name} onChange={update('name')} required />
            <Input label="Adresse email" icon={Mail} type="email" placeholder="Ex : awa@elikia.sn" autoComplete="off" value={form.email} onChange={update('email')} required />
            <Input label="Mot de passe" icon={Lock} type="password" placeholder="8 caractères minimum" autoComplete="new-password" value={form.password} onChange={update('password')} required />
            {msg.text && (
              <p className={`flex items-center gap-2 text-sm rounded-xl px-4 py-3 ${msg.type === 'success' ? 'bg-elikia-light text-elikia-dark' : 'bg-red-50 text-red-600'}`}>
                {msg.type === 'success' && <CheckCircle2 size={16} />} {msg.text}
              </p>
            )}
            <Button type="submit" className="w-full h-12" disabled={saving || !form.name || !form.email || !form.password}>
              {saving ? 'Création...' : 'Créer le compte'}
            </Button>
          </form>
        </Card>

        <Card title={`Comptes administrateurs (${admins.length})`}>
          {listError && <p className="mb-3 text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">{listError}</p>}
          <ul className="space-y-3">
            {admins.map((a) => {
              const isMe = a.id === user?.id;
              return (
                <li key={a.id} className="flex items-center gap-3 p-4 rounded-2xl border border-line bg-slate-50">
                  <div className="w-10 h-10 shrink-0 rounded-full bg-forest text-gold text-sm font-semibold flex items-center justify-center">
                    {a.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-ink truncate flex items-center gap-2">
                      {a.name} {isMe && <Badge color="green">Vous</Badge>}
                    </p>
                    <p className="text-sm text-slate-500 truncate">{a.email}</p>
                  </div>
                  {!isMe && (
                    <button
                      onClick={() => removeAdmin(a)}
                      className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center text-red-500 hover:bg-red-50"
                      aria-label={`Supprimer ${a.name}`}
                      title="Supprimer"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </Card>
      </div>
    </section>
  );
}
