'use client';

import { Search, Filter, SortAsc, X } from 'lucide-react';
import { ExperimentFilters, FilterStatus } from '@/types/experiment';
import clsx from 'clsx';

interface ExperimentFiltersProps {
  filters: ExperimentFilters;
  onFiltersChange: (filters: ExperimentFilters) => void;
  businessUnits: string[];
}

export default function ExperimentFiltersComponent({ 
  filters, 
  onFiltersChange, 
  businessUnits 
}: ExperimentFiltersProps) {
  const statusOptions: { value: FilterStatus; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'win', label: 'Wins' },
    { value: 'loss', label: 'Losses' },
    { value: 'inconclusive', label: 'Inconclusive' },
    { value: 'running', label: 'Running' },
  ];

  const hasActiveFilters = filters.search || filters.status !== 'all' || filters.businessUnit;

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      status: 'all',
      businessUnit: '',
      sortBy: 'votes'
    });
  };

  return (
    <div className="glass rounded-xl p-4 mb-6">
      <div className="flex flex-wrap items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[250px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search experiments..."
            value={filters.search}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-sm text-white placeholder-gray-500 transition-smooth"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <div className="flex gap-1 bg-slate-800/30 rounded-lg p-1">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => onFiltersChange({ ...filters, status: option.value })}
                className={clsx(
                  'px-3 py-1.5 text-xs font-medium rounded-md transition-smooth',
                  filters.status === option.value
                    ? 'bg-hive-500 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-slate-700/50'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Business Unit Filter */}
        <select
          value={filters.businessUnit}
          onChange={(e) => onFiltersChange({ ...filters, businessUnit: e.target.value })}
          className="px-3 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-sm text-white appearance-none cursor-pointer min-w-[150px] transition-smooth"
        >
          <option value="">All Teams</option>
          {businessUnits.map((unit) => (
            <option key={unit} value={unit}>{unit}</option>
          ))}
        </select>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <SortAsc className="w-4 h-4 text-gray-500" />
          <select
            value={filters.sortBy}
            onChange={(e) => onFiltersChange({ ...filters, sortBy: e.target.value as ExperimentFilters['sortBy'] })}
            className="px-3 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-sm text-white appearance-none cursor-pointer transition-smooth"
          >
            <option value="votes">Most Votes</option>
            <option value="name">Name A-Z</option>
          </select>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1.5 px-3 py-2 text-xs text-gray-400 hover:text-white transition-smooth"
          >
            <X className="w-3.5 h-3.5" />
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
