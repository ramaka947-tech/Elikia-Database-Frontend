// Logo Elikia Database (fichier partagé, géré par Rama)
export default function Logo({ dark = true, tagline = true }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-elikia flex items-center justify-center font-serif text-xl text-white">
        E
      </div>
      <div className="leading-tight">
        <div className="flex items-center gap-2">
          <span className={`font-serif text-xl tracking-wide ${dark ? 'text-white' : 'text-navy'}`}>ELIKIA.</span>
          <span className="text-[10px] tracking-[0.2em] font-semibold px-1.5 py-0.5 rounded border border-gold/50 text-gold">
            DATABASE
          </span>
        </div>
        {tagline && (
          <span className={`text-xs ${dark ? 'text-white/50' : 'text-slate-500'}`}>Chercher. Comprendre. Connecter.</span>
        )}
      </div>
    </div>
  );
}
