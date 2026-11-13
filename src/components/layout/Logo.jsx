// Logo Elikia Database (fichier partagé, géré par Rama)
// variant="full"  : logo complet (symbole + texte), pour les fonds clairs
// variant="dark"  : symbole dans une pastille blanche + texte blanc, pour les fonds foncés
// variant="mark"  : symbole seul
export default function Logo({ variant = 'full', className = '' }) {
  if (variant === 'full') {
    return <img src="/logo.png" alt="Elikia Database" className={`h-10 sm:h-12 w-auto ${className}`} />;
  }

  if (variant === 'mark') {
    return <img src="/logo-mark.png" alt="Elikia Database" className={`h-10 w-auto ${className}`} />;
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="w-11 h-11 shrink-0 rounded-xl bg-white flex items-center justify-center p-1.5">
        <img src="/logo-mark.png" alt="" className="w-full h-auto" />
      </div>
      <div className="leading-tight">
        <p className="text-lg font-semibold text-white">
          Elikia <span className="text-gold">Database</span>
        </p>
        <p className="text-xs text-white/60">Les entreprises du Sénégal</p>
      </div>
    </div>
  );
}
