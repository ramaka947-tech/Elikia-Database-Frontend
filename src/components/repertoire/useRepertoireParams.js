// Filtres + page du Répertoire, stockés dans l'URL (useSearchParams).
// Avantage : le bouton "Retour" depuis une fiche retrouve la même recherche, et un lien est partageable.
import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BOOLEAN_FILTERS, DEFAULT_FILTERS } from './constants';

export default function useRepertoireParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(() => {
    const f = { ...DEFAULT_FILTERS };
    for (const key of Object.keys(DEFAULT_FILTERS)) {
      const value = searchParams.get(key);
      if (value === null) continue;
      f[key] = BOOLEAN_FILTERS.includes(key) ? value === '1' : value;
    }
    return f;
  }, [searchParams]);

  const page = Math.max(1, parseInt(searchParams.get('page'), 10) || 1);

  const write = useCallback(
    (nextFilters, nextPage) => {
      const p = new URLSearchParams();
      for (const [key, value] of Object.entries(nextFilters)) {
        if (BOOLEAN_FILTERS.includes(key)) {
          if (value) p.set(key, '1');
        } else if (value) {
          p.set(key, value);
        }
      }
      if (nextPage > 1) p.set('page', String(nextPage));
      setSearchParams(p, { replace: true });
    },
    [setSearchParams]
  );

  // Modifier un filtre ramène toujours à la page 1
  const setFilter = useCallback(
    (key, value) => {
      const next = { ...filters, [key]: value };
      if (key === 'sector') next.sub_sector = '';
      if (key === 'region') next.city = '';
      write(next, 1);
    },
    [filters, write]
  );

  const setPage = useCallback((p) => write(filters, p), [filters, write]);
  const reset = useCallback(() => write(DEFAULT_FILTERS, 1), [write]);

  return { filters, page, setFilter, setPage, reset };
}
