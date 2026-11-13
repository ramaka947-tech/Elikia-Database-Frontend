// Composant partagé (Rama)
// Couleurs : green (vérifié), gold (estimé), red (à vérifier), gray, forest
// Ex : <Badge color="green">Vérifié 92 %</Badge>
export default function Badge({ color = 'gray', children }) {
  const colors = {
    green: 'bg-elikia-light text-elikia-dark border-elikia/30',
    gold: 'bg-gold-light text-amber-800 border-gold/40',
    red: 'bg-red-50 text-red-700 border-red-200',
    gray: 'bg-slate-100 text-slate-700 border-slate-200',
    forest: 'bg-forest text-white border-forest',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full border text-xs font-medium ${colors[color]}`}>
      {children}
    </span>
  );
}
