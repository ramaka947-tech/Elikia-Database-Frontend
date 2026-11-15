// Pagination : Précédent / numéros (avec "…") / Suivant + "Affichage 1–15 sur 120"
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PAGE_SIZE } from './constants';

// Ex : page 5 sur 12 -> [1, '…', 4, 5, 6, '…', 12]
function getPages(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  const pages = [1];
  if (start > 2) pages.push('…');
  for (let p = start; p <= end; p++) pages.push(p);
  if (end < total - 1) pages.push('…');
  pages.push(total);
  return pages;
}

const base =
  'inline-flex items-center justify-center min-w-9 h-9 px-3 rounded-full text-sm font-medium border transition-colors disabled:opacity-40 disabled:cursor-not-allowed';

export default function Pagination({ page, totalPages, total, onChange }) {
  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, total);

  return (
    <nav
      aria-label="Pagination"
      className="px-5 sm:px-6 py-4 border-t border-line bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3"
    >
      <p className="text-xs text-slate-500 tabular-nums">
        Affichage {from}–{to} sur {total}
      </p>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
          className={`${base} border-line bg-white text-slate-700 hover:bg-slate-50 gap-1`}
          aria-label="Page précédente"
        >
          <ChevronLeft size={16} aria-hidden="true" />
          <span className="hidden sm:inline">Précédent</span>
        </button>

        <div className="hidden sm:flex items-center gap-1.5">
          {getPages(page, totalPages).map((p, i) =>
            p === '…' ? (
              <span key={`gap-${i}`} className="px-1 text-slate-400" aria-hidden="true">…</span>
            ) : (
              <button
                key={p}
                type="button"
                onClick={() => onChange(p)}
                aria-current={p === page ? 'page' : undefined}
                aria-label={`Page ${p}`}
                className={`${base} ${
                  p === page
                    ? 'bg-elikia border-elikia text-white'
                    : 'border-line bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                {p}
              </button>
            )
          )}
        </div>

        <span className="sm:hidden px-2 text-sm text-slate-600 tabular-nums">
          {page} / {totalPages}
        </span>

        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onChange(page + 1)}
          className={`${base} border-line bg-white text-slate-700 hover:bg-slate-50 gap-1`}
          aria-label="Page suivante"
        >
          <span className="hidden sm:inline">Suivant</span>
          <ChevronRight size={16} aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
}
