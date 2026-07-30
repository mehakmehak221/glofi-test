'use client';

import React from 'react';
import { LeadStatus, QueryLeadsDto } from '@/types/crm';
import { Search, RefreshCw, Plus } from 'lucide-react';
import { useI18n } from '@/providers/LocaleProvider';

interface LeadFiltersProps {
  filters: QueryLeadsDto;
  onFilterChange: (newFilters: Partial<QueryLeadsDto>) => void;
  onReset: () => void;
  onOpenCreateModal: () => void;
  isLoading?: boolean;
}

const SOURCES = ['Website', 'LinkedIn', 'Referral', 'Event', 'Direct', 'WhatsApp', 'Other'];

export const LeadFilters: React.FC<LeadFiltersProps> = ({
  filters,
  onFilterChange,
  onReset,
  onOpenCreateModal,
  isLoading,
}) => {
  const { t } = useI18n();

  return (
    <div className="bg-[var(--card-surface)] border border-[var(--sidebar-border)] p-4 rounded-md space-y-4 mb-6">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--sidebar-text)] opacity-60" />
          <input
            type="text"
            placeholder={t("Search by lead name, phone, or email...")}
            value={filters.search || ''}
            onChange={(e) => onFilterChange({ search: e.target.value, page: 1 })}
            className="w-full pl-10 pr-4 py-2.5 rounded-md bg-[var(--background)] border border-[var(--sidebar-border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-300)]/20 focus:border-[var(--color-primary-300)] transition-all text-[var(--foreground)] placeholder:text-[var(--sidebar-text)] placeholder:opacity-60 font-montserrat"
          />
        </div>


        <div className="flex items-center gap-2">


          <button
            onClick={onOpenCreateModal}
            className="px-4 py-2.5 rounded-md bg-[var(--color-primary-300)] hover:bg-[var(--color-primary-300)]/90 text-[#050505] text-xs font-bold shadow-[var(--shadow-btn)] flex items-center gap-2 transition-all active:scale-[0.98] font-montserrat cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            {t("New Lead")}
          </button>
        </div>
      </div>

      {/* Filter Options */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-[var(--sidebar-border)]">
        {/* Status Select */}
        <div>
          <label className="block text-[10px] font-bold tracking-widest text-[var(--sidebar-text)] opacity-60 uppercase mb-1.5 font-montserrat">
            {t("Status")}
          </label>
          <select
            value={filters.status || ''}
            onChange={(e) =>
              onFilterChange({ status: (e.target.value as LeadStatus) || undefined, page: 1 })
            }
            className="w-full px-3 py-2 rounded-md bg-[var(--background)] border border-[var(--sidebar-border)] text-xs font-medium text-[var(--foreground)] focus:outline-none focus:border-[var(--color-primary-300)] font-montserrat"
          >
            <option value="">{t("All Statuses")}</option>
            {Object.values(LeadStatus).map((st) => (
              <option key={st} value={st}>
                {t(st.replace('_', ' '))}
              </option>
            ))}
          </select>
        </div>


        <div>
          <label className="block text-[10px] font-bold tracking-widest text-[var(--sidebar-text)] opacity-60 uppercase mb-1.5 font-montserrat">
            {t("Priority")}
          </label>
          <select
            value={filters.priority || ''}
            onChange={(e) =>
              onFilterChange({
                priority: (e.target.value as 'HIGH' | 'MEDIUM' | 'LOW') || undefined,
                page: 1,
              })
            }
            className="w-full px-3 py-2 rounded-md bg-[var(--background)] border border-[var(--sidebar-border)] text-xs font-medium text-[var(--foreground)] focus:outline-none focus:border-[var(--color-primary-300)] font-montserrat"
          >
            <option value="">{t("All Priorities")}</option>
            <option value="HIGH">{t("High")}</option>
            <option value="MEDIUM">{t("Medium")}</option>
            <option value="LOW">{t("Low")}</option>
          </select>
        </div>


        <div>
          <label className="block text-[10px] font-bold tracking-widest text-[var(--sidebar-text)] opacity-60 uppercase mb-1.5 font-montserrat">
            {t("Source")}
          </label>
          <select
            value={filters.source || ''}
            onChange={(e) => onFilterChange({ source: e.target.value || undefined, page: 1 })}
            className="w-full px-3 py-2 rounded-md bg-[var(--background)] border border-[var(--sidebar-border)] text-xs font-medium text-[var(--foreground)] focus:outline-none focus:border-[var(--color-primary-300)] font-montserrat"
          >
            <option value="">{t("All Sources")}</option>
            {SOURCES.map((src) => (
              <option key={src} value={src}>
                {t(src)}
              </option>
            ))}
          </select>
        </div>


        <div>
          <label className="block text-[10px] font-bold tracking-widest text-[var(--sidebar-text)] opacity-60 uppercase mb-1.5 font-montserrat">
            {t("Created From")}
          </label>
          <input
            type="date"
            value={filters.createdFrom || ''}
            onChange={(e) => onFilterChange({ createdFrom: e.target.value || undefined, page: 1 })}
            className="w-full px-3 py-2 rounded-md bg-[var(--background)] border border-[var(--sidebar-border)] text-xs font-medium text-[var(--foreground)] focus:outline-none focus:border-[var(--color-primary-300)] font-montserrat"
          />
        </div>
      </div>
    </div>
  );
};
