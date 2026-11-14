// Connexion administrateur. Responsable : Rama
import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Mail, Lock, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/layout/Logo';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { checkEmail, filterEmail, LIMITS } from '../utils/validation';

export default function AdminLogin() {
  const { user, isAdmin, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  if (user && isAdmin) return <Navigate to="/tableau-de-bord" replace />;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    const next = { email: checkEmail(email), password: password ? null : 'Le mot de passe est obligatoire.' };
    setErrors(next);
    if (next.email || next.password) return;
    setSubmitting(true);
    try {
      await login(email, password, true);
      navigate('/tableau-de-bord');
    } catch (err) {
      setError(err.response?.data?.message || 'Connexion impossible');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-3xl border border-line shadow-xl shadow-slate-200/60 p-6 sm:p-10">
        <div className="flex justify-center">
          <Logo variant="full" className="h-16 sm:h-20" />
        </div>

        <div className="text-center mt-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-ink">Connexion administrateur</h1>
          <p className="mt-2 text-slate-500">Accédez à votre espace administrateur</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
          <Input label="Email" icon={Mail} type="email" placeholder="admin@elikia.sn" autoComplete="email" maxLength={LIMITS.email} value={email} onChange={(e) => { setEmail(filterEmail(e.target.value)); setErrors({ ...errors, email: null }); }} error={errors.email} />
          <Input label="Mot de passe" icon={Lock} type="password" placeholder="Votre mot de passe" autoComplete="current-password" maxLength={LIMITS.passwordMax} value={password} onChange={(e) => { setPassword(e.target.value); setErrors({ ...errors, password: null }); }} error={errors.password} />

          {error && <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">{error}</p>}

          <Button type="submit" variant="dark" className="w-full h-12 rounded-xl text-base" disabled={submitting}>
            {submitting ? 'Connexion...' : <>Se connecter <ArrowRight size={18} /></>}
          </Button>
        </form>

        <div className="flex items-center gap-4 mt-8 text-xs text-slate-400">
          <span className="flex-1 h-px bg-line" /> Elikia Database <span className="flex-1 h-px bg-line" />
        </div>
        <p className="mt-5 flex items-center justify-center gap-2 text-sm text-slate-500">
          <ShieldCheck size={16} className="text-gold" /> Accès réservé aux administrateurs
        </p>
      </div>

      <Link to="/" className="mt-6 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-elikia">
        <ArrowLeft size={16} /> Retour au site
      </Link>
    </div>
  );
}
