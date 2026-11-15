// Panneau de filtres : 8 listes + 3 cases "contact renseigné"
// Sous-secteur dépend du secteur, ville dépend de la région.
// Les secteurs viennent de la base (useSectors), pour correspondre aux fiches.
import { useMemo } from 'react';
import Select from './Select';
import useSectors from './useSectors';
import {
  REGIONS,
  LEGAL_FORMS,
  COMPANY_SIZES,
  STATUSES,
  CONFIDENCE_LEVELS,
} from './constants';

function Checkbox({ label, checked, onChange }) {
  return (
    <label className="inline-flex items-center gap-2 text-sm text-slate-700 cursor-pointer select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 rounded border-line accent-elikia"
      />
      {label}
    </label>
  );
}

export default function FilterPanel({ filters, onChange }) {
  const sectors = useSectors();
  const subSectors = useMemo(
    () => sectors.find((s) => s.name === filters.sector)?.subSectors ?? [],
    [sectors, filters.sector]
  );
  const cities = useMemo(() => REGIONS[filters.region] ?? [], [filters.region]);

  return (
    <div className="mt-5 space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Select
          label="Secteur"
          value={filters.sector}
          onChange={(v) => onChange('sector', v)}
          options={sectors.map((s) => s.name)}
          placeholder="Tous les secteurs"
        />
        <Select
          label="Sous-secteur"
          value={filters.sub_sector}
          onChange={(v) => onChange('sub_sector', v)}
          options={subSectors}
          placeholder={filters.sector && subSectors.length === 0 ? 'Aucun sous-secteur' : 'Tous les sous-secteurs'}
          disabled={!filters.sector || subSectors.length === 0}
        />
        <Select
          label="Région"
          value={filters.region}
          onChange={(v) => onChange('region', v)}
          options={Object.keys(REGIONS)}
          placeholder="Toutes les régions"
        />
        <Select
          label="Ville / Pôle"
          value={filters.city}
          onChange={(v) => onChange('city', v)}
          options={cities}
          placeholder="Toutes les villes"
          disabled={!filters.region}
        />
        <Select
          label="Forme juridique"
          value={filters.legal_form}
          onChange={(v) => onChange('legal_form', v)}
          options={LEGAL_FORMS}
          placeholder="Toutes les formes"
        />
        <Select
          label="Taille estimée"
          value={filters.estimated_size}
          onChange={(v) => onChange('estimated_size', v)}
          options={COMPANY_SIZES}
          placeholder="Toutes les tailles"
        />
        <Select
          label="Statut de la fiche"
          value={filters.status}
          onChange={(v) => onChange('status', v)}
          options={STATUSES}
          placeholder="Tous les statuts"
        />
        <Select
          label="Niveau de confiance"
          value={filters.confidence_level}
          onChange={(v) => onChange('confidence_level', v)}
          options={CONFIDENCE_LEVELS}
          placeholder="Tous les niveaux"
        />
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        <span className="text-xs font-medium text-slate-600">Disponibilité contacts :</span>
        <Checkbox label="Site web renseigné" checked={filters.has_website} onChange={(v) => onChange('has_website', v)} />
        <Checkbox label="Email professionnel" checked={filters.has_email} onChange={(v) => onChange('has_email', v)} />
        <Checkbox label="Téléphone" checked={filters.has_phone} onChange={(v) => onChange('has_phone', v)} />
      </div>
    </div>
  );
}
