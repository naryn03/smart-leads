import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PaginationMeta } from '../../types';

interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ meta, onPageChange }: PaginationProps) => {
  if (meta.totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between mt-6">
      <p className="text-xs text-slate-500 dark:text-slate-400">
        Showing{' '}
        <span className="font-medium text-slate-700 dark:text-slate-300">
          {(meta.page - 1) * meta.limit + 1}–{Math.min(meta.page * meta.limit, meta.total)}
        </span>{' '}
        of <span className="font-medium text-slate-700 dark:text-slate-300">{meta.total}</span>
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(meta.page - 1)}
          disabled={!meta.hasPrev}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft size={16} />
        </button>

        {Array.from({ length: Math.min(5, meta.totalPages) }, (_, i) => {
          let page: number;
          if (meta.totalPages <= 5) page = i + 1;
          else if (meta.page <= 3) page = i + 1;
          else if (meta.page >= meta.totalPages - 2) page = meta.totalPages - 4 + i;
          else page = meta.page - 2 + i;

          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-7 h-7 rounded-lg text-xs font-medium transition-all ${
                meta.page === page
                  ? 'bg-brand-600 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {page}
            </button>
          );
        })}

        <button
          onClick={() => onPageChange(meta.page + 1)}
          disabled={!meta.hasNext}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};
