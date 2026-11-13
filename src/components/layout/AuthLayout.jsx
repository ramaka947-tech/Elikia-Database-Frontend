// Mise en page des écrans Connexion et Inscription (fichier partagé, géré par Rama)
import { Link } from 'react-router-dom';
import { Search, Layers, ShieldCheck } from 'lucide-react';
import Logo from './Logo';

const features = [
  { icon: Search, label: 'Recherche rapide' },
  { icon: Layers, label: 'Fiches structurées' },
  { icon: ShieldCheck, label: 'Données vérifiées' },
];

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-2">
      {/* Panneau de présentation (ordinateur uniquement) */}
      <div className="hidden lg:flex relative overflow-hidden bg-forest flex-col justify-between p-12 xl:p-16">
        <div className="absolute -right-40 -bottom-40 w-[36rem] h-[36rem] rounded-full border border-elikia-bright/15 bg-elikia/10" />
        <Link to="/" className="relative"><Logo variant="dark" /></Link>

        <div className="relative">
          <span className="inline-block mb-6 px-4 py-1.5 rounded-full border border-elikia-bright/40 text-elikia-bright text-xs font-semibold tracking-widest">
            ENTREPRISES DU SÉNÉGAL
          </span>
          <h1 className="font-serif text-5xl xl:text-6xl leading-tight text-white">
            Chercher. Comprendre.
            <br />
            <span className="italic text-elikia-bright">Connecter.</span>
          </h1>
          <p className="mt-6 max-w-md text-lg text-white/75">
            La base de référence des entreprises et entrepreneurs du Sénégal, avec des fiches structurées et fiables.
          </p>
        </div>

        <div className="relative flex divide-x divide-white/15">
          {features.map(({ icon: Icon, label }) => (
            <div key={label} className="px-6 first:pl-0">
              <Icon size={22} className="text-elikia-bright mb-2" />
              <p className="text-sm text-white">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Formulaire */}
      <div className="min-h-screen lg:min-h-0 flex flex-col bg-cream">
        <div className="lg:hidden px-5 py-4 bg-white border-b border-line">
          <Link to="/"><Logo variant="full" className="h-9" /></Link>
        </div>
        <div className="flex-1 flex items-center justify-center p-5 sm:p-10">
          <div className="w-full max-w-md bg-white rounded-3xl border border-line p-6 sm:p-10">{children}</div>
        </div>
      </div>
    </div>
  );
}
