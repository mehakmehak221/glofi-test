'use client';

import React from 'react';
import { Lead, LeadStatus } from '@/types/crm';
import { Phone, Mail, ChevronRight, Clock, AlertCircle, Pencil, Trash2 } from 'lucide-react';
import { useI18n } from '@/providers/LocaleProvider';

interface LeadTableProps {
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
  onEditLead: (lead: Lead) => void;
  onDeleteLead: (lead: Lead) => void;
  isLoading?: boolean;
}

export const getStatusBadgeClass = (status: LeadStatus) => {
  switch (status) {
    case LeadStatus.NEW:
      return 'bg-[var(--badge-bg)] text-[var(--badge-text)] border border-[var(--badge-border)]';
    case LeadStatus.CONTACTED:
      return 'bg-amber-500/10 text-amber-500 border border-amber-500/20';
    case LeadStatus.INTERESTED:
      return 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
    case LeadStatus.KYC_STARTED:
      return 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20';
    case LeadStatus.INVESTED:
      return 'bg-[var(--color-primary-300)]/10 text-[var(--color-primary-300)] border border-[var(--color-primary-300)]/25';
    case LeadStatus.CLOSED:
      return 'bg-[var(--color-primary-300)] text-[#050505] font-bold border border-[var(--color-primary-300)]';
    case LeadStatus.LOST:
      return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
    default:
      return 'bg-[var(--sidebar-border)] text-[var(--sidebar-text)] border border-[var(--sidebar-border)]';
  }
};

export const getPriorityBadgeClass = (priority?: string) => {
  switch (priority?.toUpperCase()) {
    case 'HIGH':
      return 'bg-rose-500/10 text-rose-400 font-bold';
    case 'MEDIUM':
      return 'bg-amber-500/10 text-amber-400 font-medium';
    case 'LOW':
      return 'bg-[var(--sidebar-border)] text-[var(--sidebar-text)] font-normal';
    default:
      return 'bg-[var(--sidebar-border)] text-[var(--sidebar-text)]';
  }
};

export const LeadTable: React.FC<LeadTableProps> = ({ leads, onSelectLead, onEditLead, onDeleteLead, isLoading }) => {
  const { t } = useI18n();

  if (isLoading) {
    return (
      <div className="bg-[var(--card-surface)] border border-[var(--sidebar-border)] rounded-md p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[var(--color-primary-300)] border-t-transparent mb-3" />
        <p className="text-sm text-[var(--sidebar-text)] opacity-60 font-montserrat">{t("Fetching assigned leads...")}</p>
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="bg-[var(--card-surface)] border border-[var(--sidebar-border)] rounded-md p-12 text-center">
        <div className="w-12 h-12 rounded-full bg-[var(--color-primary-300)]/10 flex items-center justify-center mx-auto mb-3">
          <AlertCircle className="w-6 h-6 text-[var(--color-primary-300)]" />
        </div>
        <h4 className="text-base font-bold text-[var(--foreground)] mb-1 font-montserrat">{t("No Leads Found")}</h4>
        <p className="text-xs text-[var(--sidebar-text)] opacity-60 max-w-sm mx-auto font-montserrat">
          {t("No leads match your active filters or you haven't been assigned any leads yet.")}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[var(--card-surface)] border border-[var(--sidebar-border)] rounded-md overflow-hidden font-montserrat">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[var(--background)]/35 border-b border-[var(--sidebar-border)] text-[var(--sidebar-text)] uppercase tracking-widest font-bold text-[10px] opacity-60">
              <th className="py-3.5 px-5">{t("Lead Info")}</th>
              <th className="py-3.5 px-5">{t("Contact")}</th>
              <th className="py-3.5 px-5">{t("Source")}</th>
              <th className="py-3.5 px-5">{t("Priority")}</th>
              <th className="py-3.5 px-5">{t("Status")}</th>
              <th className="py-3.5 px-5">{t("Last Activity")}</th>
              <th className="py-3.5 px-5 text-right">{t("Actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--sidebar-border)]">
            {leads.map((lead) => (
              <tr
                key={lead.id}
                onClick={() => onSelectLead(lead)}
                className="hover:bg-[var(--color-primary-300)]/5 cursor-pointer transition-colors group"
              >

                <td className="py-3.5 px-5">
                  <div className="font-bold text-[var(--foreground)] group-hover:text-[var(--color-primary-300)] transition-colors">
                    {lead.name}
                  </div>
                  <div className="text-[11px] text-[var(--sidebar-text)] opacity-50 mt-0.5">ID: {lead.id.slice(-6)}</div>
                </td>


                <td className="py-3.5 px-5 space-y-0.5">
                  <div className="flex items-center gap-1.5 text-[var(--foreground)] opacity-80 font-medium">
                    <Phone className="w-3 h-3 text-[var(--sidebar-text)] opacity-60 shrink-0" />
                    {lead.phone}
                  </div>
                  {lead.email && (
                    <div className="flex items-center gap-1.5 text-[var(--sidebar-text)] opacity-60 text-[11px]">
                      <Mail className="w-3 h-3 shrink-0" />
                      {lead.email}
                    </div>
                  )}
                </td>

                <td className="py-3.5 px-5">
                  <span className="px-2 py-0.5 rounded bg-[var(--background)]/60 text-[var(--sidebar-text)] font-medium text-[11px] border border-[var(--sidebar-border)]">
                    {t(lead.source || 'Direct')}
                  </span>
                </td>


                <td className="py-3.5 px-5">
                  <span className={`px-2 py-0.5 rounded text-[10px] tracking-wide ${getPriorityBadgeClass(lead.priority)}`}>
                    {t(lead.priority || 'NORMAL')}
                  </span>
                </td>

                <td className="py-3.5 px-5">
                  <span className={`px-2.5 py-1 rounded text-[10px] font-bold inline-block ${getStatusBadgeClass(lead.status)}`}>
                    {t(lead.status.replace('_', ' '))}
                  </span>
                </td>


                <td className="py-3.5 px-5 text-[var(--sidebar-text)] opacity-60 text-[11px]">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 shrink-0" />
                    {lead.lastContactedAt
                      ? new Date(lead.lastContactedAt).toLocaleDateString()
                      : new Date(lead.createdAt).toLocaleDateString()}
                  </div>
                </td>


                <td className="py-3.5 px-5 text-right">
                  <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* Edit */}
                    <button
                      title={t("Edit Lead")}
                      onClick={(e) => { e.stopPropagation(); onEditLead(lead); }}
                      className="inline-flex items-center justify-center w-7 h-7 rounded bg-[var(--background)]/60 border border-[var(--sidebar-border)] text-[var(--sidebar-text)] hover:text-[var(--color-primary-300)] hover:border-[var(--color-primary-300)]/30 hover:bg-[var(--color-primary-300)]/10 transition-all cursor-pointer"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    {/* Delete */}
                    <button
                      title={t("Delete Lead")}
                      onClick={(e) => { e.stopPropagation(); onDeleteLead(lead); }}
                      className="inline-flex items-center justify-center w-7 h-7 rounded bg-[var(--background)]/60 border border-[var(--sidebar-border)] text-[var(--sidebar-text)] hover:text-rose-400 hover:border-rose-500/30 hover:bg-rose-500/10 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    {/* View / Drawer */}
                    <button
                      title={t("View Details")}
                      onClick={(e) => { e.stopPropagation(); onSelectLead(lead); }}
                      className="inline-flex items-center justify-center w-7 h-7 rounded bg-[var(--background)]/60 border border-[var(--sidebar-border)] text-[var(--sidebar-text)] hover:text-[var(--color-primary-300)] hover:border-[var(--color-primary-300)]/30 hover:bg-[var(--color-primary-300)]/10 transition-all cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
