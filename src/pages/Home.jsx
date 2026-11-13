// Page d'accueil publique, d'après la maquette fournie. Responsable : Rama
// Couleurs imposées (bleu nuit, vert émeraude, doré). Aucun chiffre ni contact inventé :
// les chiffres viennent de la base, les coordonnées de Mon compte > Coordonnées (admin).
// Photo du haut de page : déposer une photo libre de droits dans public/hero-monument.jpg
// (si le fichier n'existe pas, la photo est simplement masquée).
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowRight, Search, SlidersHorizontal, FileText, FileSpreadsheet, ShieldCheck, ShieldAlert,
  Briefcase, TrendingUp, Landmark, Handshake, MapPin, Building2, Layers, UserPlus, Download,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import useSiteSettings from '../utils/useSiteSettings';
import PublicNavbar from '../components/layout/PublicNavbar';
import PublicFooter from '../components/layout/PublicFooter';
import Badge from '../components/ui/Badge';

const features = [
  { icon: Search, title: 'Recherche globale', text: 'Retrouvez une entreprise par son nom, sa raison sociale, son dirigeant, sa ville, son NINEA ou son RCCM.' },
  { icon: SlidersHorizontal, title: 'Filtres combinables', text: 'Segmentez la base par secteur, région, taille ou forme juridique.' },
  { icon: FileText, title: 'Fiches structurées', text: 'Identité, activité, localisation, dirigeants et contacts, présentés de façon claire.' },
  { icon: FileSpreadsheet, title: 'Export Excel', text: 'Regroupez les entreprises dans vos listes et exportez-les pour vos propres outils.' },
];

const levels = [
  { icon: ShieldCheck, title: 'Vérifiée', text: 'Source officielle, vérifiée récemment', badge: 'green', score: '92 %', tone: 'bg-elikia-light text-elikia' },
  { icon: ShieldCheck, title: 'Estimée', text: 'Information déduite, à confirmer', badge: 'gold', score: '65 %', tone: 'bg-gold-light text-amber-600' },
  { icon: ShieldAlert, title: 'À vérifier', text: 'Information ancienne ou incomplète', badge: 'red', score: '40 %', tone: 'bg-red-50 text-red-500' },
];

const steps = [
  { icon: UserPlus, title: 'Créez votre compte', text: 'Inscription gratuite en quelques secondes.' },
  { icon: Search, title: 'Cherchez et filtrez', text: 'Trouvez les entreprises qui correspondent à votre besoin.' },
  { icon: Download, title: 'Consultez et exportez', text: 'Ouvrez les fiches détaillées et exportez vos listes.' },
];

const audiences = [
  { icon: Briefcase, title: 'Équipes commerciales', text: 'Identifier des prospects qualifiés.' },
  { icon: TrendingUp, title: 'Investisseurs', text: 'Repérer des entreprises par secteur.' },
  { icon: Landmark, title: 'Banques et institutions', text: 'Mieux connaître le tissu économique.' },
  { icon: Handshake, title: 'Entreprises', text: 'Trouver partenaires et fournisseurs.' },
];

// Fiches d'exemple (illustration, signalées comme telles sur la page)
const preview = [
  { name: 'Baobab Construction SARL', meta: 'BTP · Dakar', badge: <Badge color="green">Vérifié 92 %</Badge> },
  { name: 'Teranga Digital', meta: 'Technologies · Dakar', badge: <Badge color="gold">Estimé 65 %</Badge> },
  { name: 'Sahel Agro Services', meta: 'Agroalimentaire · Thiès', badge: <Badge color="red">À vérifier</Badge> },
];

function SectionTitle({ eyebrow, title }) {
  return (
    <div className="max-w-2xl mx-auto text-center mb-12">
      <p className="flex items-center justify-center gap-3 text-xs font-semibold tracking-widest text-elikia mb-3">
        <span className="w-8 h-px bg-elikia/40" /> {eyebrow} <span className="w-8 h-px bg-elikia/40" />
      </p>
      <h2 className="font-serif text-3xl sm:text-4xl text-navy">{title}</h2>
    </div>
  );
}

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { hash } = useLocation();
  const { stats } = useSiteSettings();
  const [query, setQuery] = useState('');
  const [photo, setPhoto] = useState(true);

  // Liens « /#section » venant d'une autre page : on descend jusqu'à la section
  useEffect(() => {
    if (!hash) return;
    const el = document.getElementById(hash.slice(1));
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }, [hash]);

  // La recherche d'exemple : vers le répertoire si connecté, sinon vers la connexion
  function search(e) {
    e.preventDefault();
    const q = query.trim();
    navigate(user ? `/entreprises${q ? `?q=${encodeURIComponent(q)}` : ''}` : '/login');
  }

  // Seulement de vrais chiffres (rien n'est affiché tant que la base est vide)
  const figures = [
    stats?.companies > 0 && { icon: Building2, value: `${stats.companies.toLocaleString('fr-FR')}`, label: 'entreprises référencées' },
    stats?.sectors > 0 && { icon: Layers, value: stats.sectors, label: "secteurs d'activité" },
    { icon: MapPin, value: 14, label: 'régions du Sénégal' },
  ].filter(Boolean);

  return (
    <div className="bg-white">
      <PublicNavbar />

      {/* Haut de page */}
      <section className="relative overflow-hidden bg-navy">
        <div className="absolute -right-48 -top-48 w-[40rem] h-[40rem] rounded-full bg-elikia/15" />
        {photo && (
          <img
            src="/hero-monument.jpg"
            alt=""
            onError={() => setPhoto(false)}
            className="hidden lg:block absolute inset-y-0 right-0 w-[38%] h-full object-cover opacity-80 [mask-image:linear-gradient(to_right,transparent,black_45%)]"
          />
        )}

        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 py-14 sm:py-20 grid grid-cols-[minmax(0,1fr)] lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          <div>
            <span className="inline-block mb-6 px-4 py-1.5 rounded-full border border-elikia-bright/40 text-elikia-bright text-xs font-semibold tracking-widest">
              ENTREPRISES DU SÉNÉGAL
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl xl:text-6xl leading-tight text-white">
              Chercher. Comprendre.
              <span className="block italic text-elikia-bright">
                Connecter.
                <span className="block w-32 sm:w-40 h-1 mt-1 rounded-full bg-gold" />
              </span>
            </h1>
            <p className="mt-6 text-base sm:text-lg text-white/75 max-w-xl">
              Elikia Database centralise l'information sur les entreprises et entrepreneurs du Sénégal, avec des fiches
              structurées, sourcées et fiables.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link to="/inscription" className="inline-flex items-center justify-center gap-2 h-12 px-7 rounded-full bg-elikia-bright text-navy font-semibold hover:bg-white">
                Créer un compte gratuit <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="inline-flex items-center justify-center h-12 px-7 rounded-full border border-white/30 text-white font-medium hover:bg-white/10">
                Se connecter
              </Link>
            </div>

            {/* Chiffres réels */}
            <div className="mt-10 grid grid-cols-3 sm:flex sm:flex-wrap gap-4 sm:gap-0 sm:divide-x divide-white/15">
              {figures.map(({ icon: Icon, value, label }) => (
                <div key={label} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 sm:px-6 sm:first:pl-0">
                  <Icon size={24} className="text-elikia-bright shrink-0" />
                  <div>
                    <p className="text-lg sm:text-xl font-semibold text-white leading-none">{value}</p>
                    <p className="mt-1 text-xs text-white/60">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Carte de recherche (exemple) */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-2xl lg:max-w-md lg:justify-self-end w-full">
            <form onSubmit={search} className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher une entreprise, un dirigeant, un NINEA..."
                aria-label="Rechercher une entreprise"
                className="w-full h-12 pl-11 pr-4 rounded-xl border border-line text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-elikia/30 focus:border-elikia"
              />
            </form>
            <p className="mt-4 text-[11px] font-semibold tracking-widest text-slate-400">EXEMPLES DE FICHES</p>
            <div className="divide-y divide-line">
              {preview.map((p) => (
                <div key={p.name} className="flex items-center justify-between gap-3 py-3.5">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 shrink-0 rounded-xl bg-elikia-light text-elikia flex items-center justify-center"><Building2 size={18} /></div>
                    <div className="min-w-0">
                      <p className="font-semibold text-navy truncate">{p.name}</p>
                      <p className="text-xs text-slate-500 flex items-center gap-1"><MapPin size={12} /> {p.meta}</p>
                    </div>
                  </div>
                  <span className="shrink-0">{p.badge}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Fonctionnalités */}
      <section id="fonctionnalites" className="scroll-mt-20 py-20 px-5 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <SectionTitle eyebrow="FONCTIONNALITÉS" title="Tout pour trouver la bonne entreprise" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-2xl border border-line p-6 hover:border-elikia/40 hover:bg-elikia-light/40 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-elikia-light text-elikia flex items-center justify-center mb-5"><Icon size={22} /></div>
                <h3 className="font-semibold text-navy">{title}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Données fiables */}
      <section className="py-20 px-5 sm:px-8 bg-cream">
        <div className="max-w-7xl mx-auto grid grid-cols-[minmax(0,1fr)] lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs font-semibold tracking-widest text-elikia mb-3">DONNÉES FIABLES</p>
            <h2 className="font-serif text-3xl sm:text-4xl text-navy">Vous savez toujours d'où vient l'information</h2>
            <p className="mt-4 text-slate-600">
              Chaque fiche indique sa source, sa date de dernière vérification et un score de confiance. Les informations
              estimées sont clairement distinguées des informations vérifiées.
            </p>
          </div>
          <div className="bg-white rounded-3xl border border-line p-3 sm:p-4 shadow-sm divide-y divide-line">
            {levels.map(({ icon: Icon, title, text, badge, score, tone }) => (
              <div key={title} className="flex items-center justify-between gap-4 p-3 sm:p-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className={`w-11 h-11 shrink-0 rounded-xl flex items-center justify-center ${tone}`}><Icon size={22} /></div>
                  <div className="min-w-0">
                    <p className="font-semibold text-navy">{title}</p>
                    <p className="text-sm text-slate-500">{text}</p>
                  </div>
                </div>
                <Badge color={badge}>{score}</Badge>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section id="fonctionnement" className="scroll-mt-20 py-20 px-5 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <SectionTitle eyebrow="COMMENT ÇA MARCHE" title="Trois étapes, c'est tout" />
          <div className="relative grid md:grid-cols-3 gap-10 md:gap-6">
            {/* Pointillés entre les étapes (ordinateur) */}
            <div className="hidden md:block absolute top-8 left-[20%] right-[20%] border-t-2 border-dashed border-elikia/30" />
            {steps.map(({ icon: Icon, title, text }, i) => (
              <div key={title} className="relative text-center">
                <div className="relative w-16 h-16 mx-auto rounded-full bg-elikia text-white flex items-center justify-center ring-8 ring-white">
                  <Icon size={26} />
                  <span className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-navy text-gold text-sm font-semibold flex items-center justify-center">{i + 1}</span>
                </div>
                <h3 className="mt-5 font-semibold text-navy">{title}</h3>
                <p className="mt-2 text-sm text-slate-600 max-w-[16rem] mx-auto">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pour qui */}
      <section id="pour-qui" className="scroll-mt-20 py-20 px-5 sm:px-8 bg-cream">
        <div className="max-w-7xl mx-auto">
          <SectionTitle eyebrow="POUR QUI ?" title="Pensé pour ceux qui travaillent avec les entreprises" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {audiences.map(({ icon: Icon, title, text }) => (
              <div key={title} className="bg-white rounded-2xl border border-line p-6">
                <Icon size={26} className="text-elikia" />
                <h3 className="mt-4 font-semibold text-navy">{title}</h3>
                <p className="mt-1 text-sm text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Appel à l'action */}
      <section className="px-5 sm:px-8 py-16 sm:py-20">
        <div className="max-w-6xl mx-auto rounded-3xl bg-gradient-to-r from-navy to-elikia-dark px-6 py-12 sm:px-12 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
          <div className="absolute -left-24 -bottom-24 w-72 h-72 rounded-full bg-elikia/20" />
          <div className="relative">
            <h2 className="font-serif text-3xl sm:text-4xl text-white">Prêt à explorer les entreprises du Sénégal ?</h2>
            <p className="mt-3 text-white/75">Créez votre compte et commencez votre recherche dès maintenant.</p>
          </div>
          <Link to="/inscription" className="relative shrink-0 inline-flex items-center justify-center gap-2 h-12 px-7 rounded-full bg-elikia-bright text-navy font-semibold hover:bg-white">
            Créer un compte <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
