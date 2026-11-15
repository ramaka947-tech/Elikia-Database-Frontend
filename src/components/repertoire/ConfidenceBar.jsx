// Score de confiance : barre + pourcentage + niveau (vert ≥ 80, doré 55-79, rouge < 55)
export default function ConfidenceBar({ score }) {
  const level = score >= 80 ? 'high' : score >= 55 ? 'medium' : 'low';
  const s = {
    high: { bar: 'bg-elikia', text: 'text-elikia-dark', label: 'Élevé' },
    medium: { bar: 'bg-gold', text: 'text-amber-700', label: 'Moyen' },
    low: { bar: 'bg-red-500', text: 'text-red-600', label: 'Faible' },
  }[level];
  return (
    <div className="inline-flex items-center gap-2 whitespace-nowrap">
      <div className="w-11 h-1.5 rounded-full bg-slate-200 overflow-hidden" aria-hidden="true">
        <div className={`h-full rounded-full ${s.bar}`} style={{ width: `${Math.min(100, Math.max(0, score))}%` }} />
      </div>
      <span className={`text-xs font-semibold tabular-nums ${s.text}`}>{score}%</span>
      <span className="text-xs text-slate-400">({s.label})</span>
    </div>
  );
}
