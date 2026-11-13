// En-tête d'un onglet de « Mon compte » : icône + titre + phrase d'explication. Responsable : Rama
export default function SectionHeader({ icon: Icon, title, text }) {
  return (
    <div className="flex items-start gap-4 mb-6">
      <div className="w-12 h-12 shrink-0 rounded-2xl bg-elikia-light text-elikia flex items-center justify-center">
        <Icon size={24} />
      </div>
      <div className="min-w-0">
        <h2 className="font-serif text-2xl text-navy leading-tight">{title}</h2>
        {text && <p className="text-sm text-slate-500 mt-1">{text}</p>}
      </div>
    </div>
  );
}
