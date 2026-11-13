// Carte d'indicateur (Rama)
// <StatCard icon={Folder} value={8} label="Listes créées" tone="green" />  (tons : green, gold, slate, white, red)
// Sur mobile, la carte devient compacte pour en afficher 3 sur une ligne.
export default function StatCard({ icon: Icon, value, label, tone = 'white' }) {
  const tones = {
    green: 'bg-elikia-light border-elikia/15 text-elikia',
    gold: 'bg-gold-light border-gold/25 text-amber-700',
    slate: 'bg-slate-100 border-slate-200 text-forest',
    white: 'bg-white border-line text-forest',
    red: 'bg-red-50 border-red-100 text-red-600',
  };
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 rounded-2xl border p-3.5 sm:p-5 ${tones[tone]}`}>
      <div className="hidden sm:flex w-12 h-12 shrink-0 rounded-xl bg-white/70 items-center justify-center">
        <Icon size={24} />
      </div>
      <Icon size={18} className="sm:hidden" />
      <div className="min-w-0">
        <p className="text-xl sm:text-3xl font-semibold text-ink leading-none">{value ?? '–'}</p>
        <p className="mt-1 sm:mt-1.5 text-xs sm:text-sm text-slate-600 leading-snug">{label}</p>
      </div>
    </div>
  );
}
