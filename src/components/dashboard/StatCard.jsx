// Carte KPI réutilisable. Ex : <StatCard label="Entreprises" value={1200} />
export default function StatCard({ label, value, hint }) {
  return (
    <div className="bg-white rounded-xl shadow p-5 border-l-4 border-gold">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-3xl font-bold text-elikia mt-1">
        {value?.toLocaleString('fr-FR') ?? '—'}
      </p>
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}
