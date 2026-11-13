// Onglets « Conditions d'utilisation » et « Confidentialité ». Responsable : Rama
// Le même texte sert aussi aux pages publiques /conditions et /confidentialite (pages/Legal.jsx).
// Sur téléphone, chaque partie s'ouvre en accordéon ; sur ordinateur, tout est affiché.
import { useState } from 'react';
import { FileText, ShieldCheck, Database, Settings, Lock, UserCheck, Mail, ChevronDown } from 'lucide-react';
import Card from '../ui/Card';
import SectionHeader from './SectionHeader';

export const conditions = [
  {
    title: '1. Objet',
    text: "Les présentes conditions fixent les règles d'accès et d'utilisation de la plateforme Elikia Database, l'annuaire des entreprises du Sénégal.",
  },
  {
    title: '2. Accès au service',
    text: "La consultation de l'annuaire nécessite un compte. Le compte donne accès au répertoire, aux fiches entreprises, à la création de listes et à leur export Excel. Chaque utilisateur est responsable de la confidentialité de son mot de passe.",
  },
  {
    title: '3. Utilisation des données',
    text: "Les informations sont fournies à titre informatif, pour la prospection et la recherche de partenaires. Elles ne doivent pas être utilisées à des fins illégales, frauduleuses ou contraires aux lois en vigueur, ni revendues.",
  },
  {
    title: '4. Responsabilités',
    text: "Elikia Database s'efforce de fournir des données fiables et à jour. Chaque fiche indique un niveau de confiance, mais l'exactitude et l'exhaustivité des informations ne peuvent pas être garanties.",
  },
  {
    title: '5. Modification des conditions',
    text: "Ces conditions peuvent évoluer. Les utilisateurs sont informés des changements importants, et la poursuite de l'utilisation vaut acceptation des nouvelles conditions.",
  },
];

export const privacy = [
  {
    title: 'Données collectées',
    icon: Database,
    text: 'Nous collectons les informations que vous fournissez à la création de votre compte : nom et adresse email.',
  },
  {
    title: 'Utilisation des données',
    icon: Settings,
    text: "Vos données servent à gérer votre compte, à vous donner accès aux fonctionnalités de la plateforme et à améliorer nos services. Elles ne sont jamais revendues.",
  },
  {
    title: 'Protection des données',
    icon: Lock,
    text: "Votre mot de passe est chiffré et l'accès à la plateforme est protégé par une connexion sécurisée.",
  },
  {
    title: 'Vos droits',
    icon: UserCheck,
    text: 'Vous pouvez à tout moment demander la modification ou la suppression de vos données.',
  },
  {
    title: 'Contact',
    icon: Mail,
    text: "Pour toute question sur vos données, contactez l'administrateur de la plateforme.",
  },
];

function Item({ title, icon: Icon, text, open, onToggle }) {
  return (
    <div className="rounded-xl border border-line bg-white">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-4 py-4 text-left lg:cursor-default"
        aria-expanded={open}
      >
        {Icon && (
          <span className="w-10 h-10 shrink-0 rounded-xl bg-elikia-light text-elikia flex items-center justify-center">
            <Icon size={20} />
          </span>
        )}
        <span className="flex-1 font-semibold text-navy">{title}</span>
        <ChevronDown size={18} className={`lg:hidden text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <p className={`${open ? 'block' : 'hidden'} lg:block px-4 pb-4 -mt-1 text-sm text-slate-600 leading-relaxed ${Icon ? 'lg:pl-[68px]' : ''}`}>
        {text}
      </p>
    </div>
  );
}

export function LegalList({ items }) {
  const [open, setOpen] = useState(null);
  return (
    <div className="space-y-3">
      {items.map((it, i) => (
        <Item key={it.title} {...it} open={open === i} onToggle={() => setOpen(open === i ? null : i)} />
      ))}
    </div>
  );
}

export function ConditionsTab() {
  return (
    <Card>
      <SectionHeader icon={FileText} title="Conditions d'utilisation" text="Les règles qui encadrent l'utilisation d'Elikia Database." />
      <LegalList items={conditions} />
    </Card>
  );
}

export function PrivacyTab() {
  return (
    <Card>
      <SectionHeader icon={ShieldCheck} title="Politique de confidentialité" text="Comment nous collectons, utilisons et protégeons vos données." />
      <LegalList items={privacy} />
    </Card>
  );
}
