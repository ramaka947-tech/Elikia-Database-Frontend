// Responsable : Rama
import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Search, Building2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/layout/Logo';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to="/" replace />;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Connexion impossible');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-navy">
      <div className="hidden lg:flex flex-col justify-between p-12">
        <Logo />
        <div>
          <span className="inline-block mb-6 px-4 py-1.5 rounded-full border border-elikia/40 text-elikia text-xs font-semibold tracking-widest">
            ENTREPRISES DU SÉNÉGAL
          </span>
          <h1 className="font-serif text-6xl leading-tight text-white">
            Chercher. Comprendre.
            <br />
            <span className="italic text-elikia">Connecter.</span>
          </h1>
          <p className="mt-6 max-w-md text-lg text-white/70">
            La base de référence des entreprises et entrepreneurs du Sénégal, avec des fiches structurées et fiables.
          </p>
        </div>
        <div className="flex gap-6 text-sm text-white/70">
          <span className="flex items-center gap-2"><Search size={16} className="text-elikia" /> Recherche rapide</span>
          <span className="flex items-center gap-2"><Building2 size={16} className="text-elikia" /> Fiches structurées</span>
          <span className="flex items-center gap-2"><ShieldCheck size={16} className="text-elikia" /> Données vérifiées</span>
        </div>
      </div>

      <div className="flex items-center justify-center p-6 lg:bg-slate-50">
        <form onSubmit={handleSubmit} className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 space-y-5">
          <div className="lg:hidden mb-2 -mx-2 p-4 rounded-2xl bg-navy"><Logo /></div>
          <div>
            <h2 className="font-serif text-3xl text-navy">Connexion</h2>
            <p className="text-sm text-slate-500 mt-1">Accédez à votre espace Elikia Database.</p>
          </div>

          <Input label="Email" type="email" placeholder="nom@entreprise.sn" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label="Mot de passe" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

          {error && <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-2">{error}</p>}

          <Button type="submit" className="w-full py-3" disabled={submitting}>
            {submitting ? 'Connexion...' : <>Se connecter <ArrowRight size={16} /></>}
          </Button>
        </form>
      </div>
    </div>
  );
}
