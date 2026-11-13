// Responsable : Rama
import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { ArrowRight, Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/layout/AuthLayout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to="/tableau-de-bord" replace />;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
      navigate('/tableau-de-bord');
    } catch (err) {
      setError(err.response?.data?.message || 'Connexion impossible');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <h2 className="font-serif text-3xl sm:text-4xl text-forest">Se connecter</h2>
          <p className="text-sm text-slate-500 mt-2">Accédez à votre espace Elikia Database.</p>
        </div>

        <Input label="Email" icon={Mail} type="email" placeholder="Votre email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Input label="Mot de passe" icon={Lock} type="password" placeholder="Votre mot de passe" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        <div className="text-right -mt-2">
          <button type="button" onClick={() => setShowForgot(!showForgot)} className="text-sm font-medium text-elikia hover:underline">
            Mot de passe oublié ?
          </button>
        </div>
        {showForgot && (
          <p className="text-sm text-slate-600 bg-elikia-light rounded-xl px-4 py-3">
            Contactez un administrateur Elikia pour réinitialiser votre mot de passe.
          </p>
        )}

        {error && <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">{error}</p>}

        <Button type="submit" className="w-full h-12" disabled={submitting}>
          {submitting ? 'Connexion...' : <>Se connecter <ArrowRight size={18} /></>}
        </Button>

        <p className="text-sm text-center text-slate-500 pt-2">
          Pas encore de compte ?{' '}
          <Link to="/inscription" className="font-semibold text-elikia hover:underline">Créer un compte</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
