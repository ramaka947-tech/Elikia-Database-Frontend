// Secteurs et sous-secteurs réels de la base (GET /api/sectors), pour les filtres du Répertoire.
// Renvoie [{ name, subSectors: [...] }], trié par nom. Les sous-secteurs sont les secteurs
// qui ont un parent (sectors.parent_id), comme dans la recherche côté serveur.
import { useEffect, useState } from 'react';
import api from '../../api/client';

let cache = null;

export default function useSectors() {
  const [sectors, setSectors] = useState(cache || []);

  useEffect(() => {
    if (cache) return;
    api.get('/sectors')
      .then(({ data }) => {
        const parents = data.filter((s) => !s.parent_id);
        cache = parents
          .map((p) => ({
            name: p.name,
            subSectors: data.filter((s) => s.parent_id === p.id).map((s) => s.name).sort((a, b) => a.localeCompare(b, 'fr')),
          }))
          .sort((a, b) => a.name.localeCompare(b.name, 'fr'));
        setSectors(cache);
      })
      .catch(() => setSectors([]));
  }, []);

  return sectors;
}
