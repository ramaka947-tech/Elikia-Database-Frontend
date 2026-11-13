// Classement avec barres de proportion. items = [{ name, count }]
// Ex : <TopList title="Top 5 secteurs" items={stats.bySector} />
export default function TopList({ title, items = [] }) {
  const max = Math.max(...items.map((i) => i.count), 1);

  return (
    <section className="bg-white rounded-xl shadow p-5">
      <h2 className="font-semibold text-ink mb-4">{title}</h2>
      {items.length === 0 ? (
        <p className="text-sm text-gray-400">Aucune donnée disponible.</p>
      ) : (
        <ul className="space-y-3">
          {items.slice(0, 5).map((item) => (
            <li key={item.name}>
              <div className="flex justify-between text-sm mb-1">
                <span className="truncate pr-2">{item.name || 'Non renseigné'}</span>
                <span className="font-medium text-elikia">{item.count}</span>
              </div>
              <div className="h-2 rounded bg-elikia-light">
                <div
                  className="h-2 rounded bg-elikia"
                  style={{ width: `${(item.count / max) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
