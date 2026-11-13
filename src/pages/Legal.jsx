// Pages publiques /conditions et /confidentialite (lisibles sans compte). Responsable : Rama
// Le texte est le même que dans Mon compte (components/profil/LegalTabs.jsx).
import { useEffect } from 'react';
import { FileText, ShieldCheck } from 'lucide-react';
import PublicNavbar from '../components/layout/PublicNavbar';
import PublicFooter from '../components/layout/PublicFooter';
import SectionHeader from '../components/profil/SectionHeader';
import { conditions, privacy, LegalList } from '../components/profil/LegalTabs';

const pages = {
  conditions: {
    icon: FileText,
    title: "Conditions d'utilisation",
    text: "Les règles qui encadrent l'utilisation d'Elikia Database.",
    items: conditions,
  },
  confidentialite: {
    icon: ShieldCheck,
    title: 'Politique de confidentialité',
    text: 'Comment nous collectons, utilisons et protégeons vos données.',
    items: privacy,
  },
};

export default function Legal({ type }) {
  const page = pages[type];

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = `${page.title} · Elikia Database`;
    return () => { document.title = 'Elikia Database'; };
  }, [page]);

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <PublicNavbar />
      <main className="flex-1 px-5 sm:px-8 py-12 sm:py-16">
        <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-line p-6 sm:p-10">
          <SectionHeader icon={page.icon} title={page.title} text={page.text} />
          <LegalList items={page.items} />
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
