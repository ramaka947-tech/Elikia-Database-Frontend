// Responsable : Rama
import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { ArrowRight, User, Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/layout/AuthLayout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { checkName, checkEmail, checkPassword, filterName, filterEmail, LIMITS } from '../utils/validation';

export default function Register() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to="/tableau-de-bord" replace />;

  // Les caractères interdits ne peuvent pas être tapés ; l'erreur du champ disparaît pendant la saisie
  const filters = { name: filterName, email: filterEmail };
  const update = (field) => (e) => {
    const value = filters[field] ? filters[field](e.target.value) : e.target.value;
    setForm({ ...form, [field]: value });
    setErrors({ ...errors, [field]: null });
  };

  function validate() {
    const next = {
      name: checkName(form.name),
      email: checkEmail(form.email),
      password: checkPassword(form.password),
      confirm: !form.confirm ? 'Confirmez le mot de passe.' : form.password !== form.confirm ? 'Les deux mots de passe ne correspondent pas.' : null,
    };
    setErrors(next);
    return !Object.values(next).some(Boolean);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!validate()) return;

    setSubmitting(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/tableau-de-bord');
    } catch (err) {
      setError(err.response?.data?.message || 'Inscription impossible');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div>
          <h2 className="font-serif text-3xl sm:text-4xl text-forest">Créer un compte</h2>
          <p className="text-sm text-slate-500 mt-2">Rejoignez Elikia Database pour rechercher et suivre les entreprises.</p>
        </div>

        <Input label="Nom complet *" icon={User} placeholder="Awa Ndiaye" autoComplete="name" maxLength={LIMITS.name} value={form.name} onChange={update('name')} error={errors.name} hint="Lettres uniquement (espaces, tirets et apostrophes acceptés)." />
        <Input label="Email *" icon={Mail} type="email" placeholder="nom@entreprise.sn" autoComplete="email" maxLength={LIMITS.email} value={form.email} onChange={update('email')} error={errors.email} />
        <Input label="Mot de passe *" icon={Lock} type="password" placeholder="8 caractères minimum" autoComplete="new-password" maxLength={LIMITS.passwordMax} value={form.password} onChange={update('password')} error={errors.password} hint="Au moins 8 caractères, avec une majuscule, une minuscule et un chiffre." />
        <Input label="Confirmer le mot de passe *" icon={Lock} type="password" placeholder="Retapez le mot de passe" autoComplete="new-password" maxLength={LIMITS.passwordMax} value={form.confirm} onChange={update('confirm')} error={errors.confirm} />

        {error && <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">{error}</p>}

        <Button type="submit" className="w-full h-12" disabled={submitting}>
          {submitting ? 'Création...' : <>Créer mon compte <ArrowRight size={18} /></>}
        </Button>

        <p className="text-xs text-center text-slate-500 leading-relaxed">
          En créant un compte, vous acceptez les{' '}
          <Link to="/conditions" className="text-elikia hover:underline">Conditions d'utilisation</Link> et la{' '}
          <Link to="/confidentialite" className="text-elikia hover:underline">Politique de confidentialité</Link>.
        </p>

        <p className="text-sm text-center text-slate-500 pt-2">
          Déjà inscrit ?{' '}
          <Link to="/login" className="font-semibold text-elikia hover:underline">Se connecter</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
