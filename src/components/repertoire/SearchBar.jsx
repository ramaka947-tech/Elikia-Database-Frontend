// Barre de recherche : saisie avec délai (debounce) pour ne pas appeler l'API à chaque lettre,
// + boutons Filtres / Réinitialiser. Le bouton d'export est passé en children.
import { useEffect, useRef, useState } from 'react';
import { Search, SlidersHorizontal, RotateCcw } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';

const DEBOUNCE_MS = 400;

export default function SearchBar({
  value,
  onSearch,
  showFilters,
  onToggleFilters,
  activeFilterCount,
  canReset,
  onReset,
  children,
}) {
  const [text, setText] = useState(value);
  const onSearchRef = useRef(onSearch);
  onSearchRef.current = onSearch;

  // Resynchronise le champ quand l'URL change de l'extérieur (ex : Réinitialiser)
  useEffect(() => setText(value), [value]);

  // Lance la recherche 400 ms après la dernière frappe
  useEffect(() => {
    if (text === value) return;
    const timer = setTimeout(() => onSearchRef.current(text.trim()), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [text, value]);

  return (
    <div className="flex flex-col lg:flex-row lg:items-center gap-3">
      <div className="relative flex-1">
        <Search
          size={18}
          aria-hidden="true"
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
        />
        <Input
          type="search"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Rechercher par nom, dirigeant, secteur, ville, NINEA, RCCM…"
          aria-label="Recherche d’entreprises"
          className="pl-11 bg-slate-50 rounded-lg"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <Button
          type="button"
          variant="secondary"
          className={showFilters || activeFilterCount > 0 ? 'border-elikia! text-elikia-dark bg-elikia-light/40' : ''}
          onClick={onToggleFilters}
          aria-expanded={showFilters}
        >
          <SlidersHorizontal size={16} aria-hidden="true" />
          Filtres{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
        </Button>

        {canReset && (
          <Button type="button" variant="secondary" onClick={onReset}>
            <RotateCcw size={16} aria-hidden="true" />
            Réinitialiser
          </Button>
        )}

        {children}
      </div>
    </div>
  );
}
