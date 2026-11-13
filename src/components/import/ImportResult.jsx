// Résultat d'import : résumé + erreurs ligne par ligne
// result = { imported, duplicates, errors: [{ line, message }] }
import Badge from '../ui/Badge';

export default function ImportResult({ result }) {
  const errors = result.errors ?? [];

  return (
    <section className="bg-white rounded-xl shadow p-5 space-y-4">
      <h2 className="font-semibold">Résultat de l'import</h2>
      <div className="flex flex-wrap gap-2">
        <Badge color="green">{result.imported ?? 0} importée(s)</Badge>
        <Badge color="gold">{result.duplicates ?? 0} doublon(s)</Badge>
        <Badge color={errors.length ? 'red' : 'gray'}>{errors.length} erreur(s)</Badge>
      </div>

      {errors.length > 0 && (
        <div className="max-h-80 overflow-auto border border-gray-200 rounded-md">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left sticky top-0">
              <tr>
                <th className="px-3 py-2 w-20">Ligne</th>
                <th className="px-3 py-2">Erreur</th>
              </tr>
            </thead>
            <tbody>
              {errors.map((e, i) => (
                <tr key={i} className="border-t border-gray-100">
                  <td className="px-3 py-2 font-medium">{e.line}</td>
                  <td className="px-3 py-2 text-red-700">{e.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
