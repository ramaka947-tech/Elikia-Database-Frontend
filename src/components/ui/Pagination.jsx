// Pagination partagée (Rama)
// <Pagination page={page} total={items.length} perPage={10} onChange={setPage} label="listes" />
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page, total, perPage, onChange, label = 'éléments' }) {
  const pages = Math.max(1, Math.ceil(total / perPage));
  if (total === 0) return null;
  const from = (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, total);

  // Numéros affichés : 1 … page-1 page page+1 … dernière
  const nums = [...new Set([1, page - 1, page, page + 1, pages])].filter((n) => n >= 1 && n <= pages).sort((a, b) => a - b);

  const btn = 'min-w-10 h-10 px-3 rounded-xl border text-sm font-medium flex items-center justify-center';

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-5">
      <p className="text-sm text-slate-500">Affichage de {from} à {to} sur {total} {label}</p>
      {pages > 1 && (
        <div className="flex items-center gap-1.5">
          <button className={`${btn} border-line bg-white disabled:opacity-40`} onClick={() => onChange(page - 1)} disabled={page === 1} aria-label="Page précédente">
            <ChevronLeft size={18} />
          </button>
          {nums.map((n, i) => (
            <span key={n} className="flex items-center gap-1.5">
              {i > 0 && n - nums[i - 1] > 1 && <span className="px-1 text-slate-400">…</span>}
              <button
                className={`${btn} ${n === page ? 'bg-elikia border-elikia text-white' : 'border-line bg-white text-ink hover:bg-slate-50'}`}
                onClick={() => onChange(n)}
                aria-current={n === page ? 'page' : undefined}
              >
                {n}
              </button>
            </span>
          ))}
          <button className={`${btn} border-line bg-white disabled:opacity-40`} onClick={() => onChange(page + 1)} disabled={page === pages} aria-label="Page suivante">
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
