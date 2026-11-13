// Pied de page des pages publiques (fichier partagé, géré par Rama)
// Les coordonnées viennent de Mon compte > Coordonnées (admin). Un champ vide n'est pas affiché.
import { Link } from 'react-router-dom';
import { Mail, Phone, Linkedin, Facebook, Instagram } from 'lucide-react';
import useSiteSettings from '../../utils/useSiteSettings';
import Logo from './Logo';

const columns = [
  {
    title: 'Découvrir',
    links: [
      { label: 'Fonctionnalités', to: '/#fonctionnalites' },
      { label: 'Comment ça marche', to: '/#fonctionnement' },
      { label: 'Pour qui ?', to: '/#pour-qui' },
    ],
  },
  {
    title: 'Mon espace',
    links: [
      { label: 'Créer un compte', to: '/inscription' },
      { label: 'Se connecter', to: '/login' },
    ],
  },
  {
    title: 'Légal',
    links: [
      { label: "Conditions d'utilisation", to: '/conditions' },
      { label: 'Politique de confidentialité', to: '/confidentialite' },
    ],
  },
];

export default function PublicFooter() {
  const s = useSiteSettings();
  const socials = [
    { url: s.linkedin_url, icon: Linkedin, label: 'LinkedIn' },
    { url: s.facebook_url, icon: Facebook, label: 'Facebook' },
    { url: s.instagram_url, icon: Instagram, label: 'Instagram' },
  ].filter((x) => x.url);
  const hasContact = s.contact_email || s.contact_phone;

  return (
    <footer className="bg-navy text-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1.2fr]">
        <div className="sm:col-span-2 lg:col-span-1">
          <Logo variant="dark" />
          <p className="mt-4 text-sm text-white/60 max-w-xs">La base de référence des entreprises et entrepreneurs du Sénégal.</p>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <p className="font-semibold mb-3">{col.title}</p>
            <ul className="space-y-2 text-sm text-white/70">
              {col.links.map((l) => (
                <li key={l.to}><Link to={l.to} className="hover:text-elikia-bright">{l.label}</Link></li>
              ))}
            </ul>
          </div>
        ))}

        {hasContact && (
          <div>
            <p className="font-semibold mb-3">Contact</p>
            <ul className="space-y-2 text-sm text-white/70">
              {s.contact_email && (
                <li>
                  <a href={`mailto:${s.contact_email}`} className="flex items-center gap-2 hover:text-elikia-bright break-all">
                    <Mail size={16} className="shrink-0" /> {s.contact_email}
                  </a>
                </li>
              )}
              {s.contact_phone && (
                <li>
                  <a href={`tel:${s.contact_phone.replace(/[^+\d]/g, '')}`} className="flex items-center gap-2 hover:text-elikia-bright">
                    <Phone size={16} className="shrink-0" /> {s.contact_phone}
                  </a>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-5 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/50">© {new Date().getFullYear()} Elikia Database. Tous droits réservés.</p>
          {socials.length > 0 && (
            <div className="flex gap-2">
              {socials.map(({ url, icon: Icon, label }) => (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:bg-white/10 hover:text-white"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
