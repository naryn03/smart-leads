import { Search, SlidersHorizontal, X } from 'lucide-react';
import { LeadFilters, LeadSource, LeadStatus, SortOrder } from '../../types';

interface FiltersBarProps {
  filters: LeadFilters;
  onFilterChange: (filters: Partial<LeadFilters>) => void;
  onSearchChange: (value: string) => void;
  searchValue: string;
}

const STATUS_OPTIONS: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Lost'];
const SOURCE_OPTIONS: LeadSource[] = ['Website', 'Instagram', 'Referral'];

export const FiltersBar = ({ filters, onFilterChange, onSearchChange, searchValue }: FiltersBarProps) => {
  const hasActiveFilters = filters.status || filters.source || filters.sort;

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Search */}
      <div className="relative flex-1 min-w-[200px] max-w-xs">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search name or email..."
          className="input pl-9 pr-8"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchValue && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          >
            <X size={12} />
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        <SlidersHorizontal size={14} className="text-slate-400" />

        <select
          className="input w-auto text-sm py-2"
          value={filters.status || ''}
          onChange={(e) => onFilterChange({ status: e.target.value as LeadStatus | '' })}
        >
          <option value="">All Status</option>
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>

        <select
          className="input w-auto text-sm py-2"
          value={filters.source || ''}
          onChange={(e) => onFilterChange({ source: e.target.value as LeadSource | '' })}
        >
          <option value="">All Sources</option>
          {SOURCE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>

        <select
          className="input w-auto text-sm py-2"
          value={filters.sort || 'latest'}
          onChange={(e) => onFilterChange({ sort: e.target.value as SortOrder })}
        >
          <option value="latest">Latest First</option>
          <option value="oldest">Oldest First</option>
        </select>

        {hasActiveFilters && (
          <button
            onClick={() => onFilterChange({ status: '', source: '', sort: 'latest' })}
            className="text-xs text-brand-600 dark:text-brand-400 hover:underline whitespace-nowrap"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
};
