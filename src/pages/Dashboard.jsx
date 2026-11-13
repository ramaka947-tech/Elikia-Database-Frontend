// Responsable : Sophiatou
// Appel API : GET /stats -> { total, updatedLast30Days, bySector, byRegion }
// Le titre de la page est déjà affiché dans la barre du haut (Topbar).
import { useEffect, useState } from 'react';
import api from '../api/client';
import StatCard from '../components/dashboard/StatCard';
import TopList from '../components/dashboard/TopList';
import QuickSearch from '../components/dashboard/QuickSearch';
import QuickActions from '../components/dashboard/QuickActions';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  // Au premier affichage de la page, on demande les chiffres au back
  useEffect(() => {
    api
      .get('/stats')
      .then(({ data }) => setStats(data))
      .catch(() => setError('Impossible de charger les statistiques. Vérifiez que le serveur est lancé.'));
  }, []);

  if (error) return <p className="rounded-xl bg-red-50 p-4 text-red-700">{error}</p>;
  if (!stats) return <p className="text-slate-500">Chargement des statistiques...</p>;

  return (
    <div className="space-y-6">
      <QuickSearch />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Entreprises référencées" value={stats.total} />
        <StatCard
          label="Mises à jour (30 jours)"
          value={stats.updatedLast30Days}
          hint="Fiches modifiées récemment"
        />
        <StatCard label="Secteurs représentés" value={stats.bySector?.length ?? 0} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TopList title="Top 5 secteurs" items={stats.bySector} />
        <TopList title="Top 5 régions" items={stats.byRegion} />
      </div>

      <QuickActions />
    </div>
  );
}