'use client';

import React from 'react';
import { Lead, LeadStatus } from '@/types/crm';
import { Phone, Mail, ChevronRight, Clock, AlertCircle, Pencil } from 'lucide-react';

interface LeadTableProps {
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
  onEditLead: (lead: Lead) => void;
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

export const LeadTable: React.FC<LeadTableProps> = ({ leads, onSelectLead, onEditLead, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-[var(--card-surface)] border border-[var(--sidebar-border)] rounded-md p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[var(--color-primary-300)] border-t-transparent mb-3" />
        <p className="text-sm text-[var(--sidebar-text)] opacity-60 font-montserrat">Fetching assigned leads...</p>
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="bg-[var(--card-surface)] border border-[var(--sidebar-border)] rounded-md p-10 text-center font-montserrat">
        <div className="w-12 h-12 rounded-full bg-[var(--sidebar-border)] flex items-center justify-center mx-auto mb-4 text-[var(--sidebar-text)] opacity-65">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-[var(--foreground)] mb-1">No Leads Found</h3>
        <p className="text-xs text-[var(--sidebar-text)] opacity-60 max-w-sm mx-auto">
          No leads are currently assigned to you or match your active filter criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[var(--card-surface)] border border-[var(--sidebar-border)] rounded-md overflow-hidden font-montserrat">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[var(--sidebar-border)] bg-[var(--background)]/20">
              <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-[var(--sidebar-text)] opacity-65">Lead Info</th>
              <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-[var(--sidebar-text)] opacity-65">Contact</th>
              <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-[var(--sidebar-text)] opacity-65">Source</th>
              <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-[var(--sidebar-text)] opacity-65">Priority</th>
              <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-[var(--sidebar-text)] opacity-65">Status</th>
              <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-[var(--sidebar-text)] opacity-65">Last Updated</th>
              <th className="px-5 py-4 text-right text-[10px] font-bold uppercase tracking-wider text-[var(--sidebar-text)] opacity-65">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--sidebar-border)]">
            {leads.map((lead) => (
              <tr
                key={lead.id}
                onClick={() => onSelectLead(lead)}
                className="hover:bg-[var(--sidebar-border)]/10 transition-colors cursor-pointer group"
              >
                <td className="px-5 py-4">
                  <div>
                    <p className="text-sm font-bold text-[var(--foreground)] group-hover:text-[var(--color-primary-300)] transition-colors">
                      {lead.name}
                    </p>
                    <p className="text-[10px] text-[var(--sidebar-text)] opacity-50 mt-0.5 font-mono">
                      ID: {lead.id.slice(-8)}
                    </p>
                  </div>
                </td>

                <td className="px-5 py-4">
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-1.5 text-[var(--foreground)] font-semibold">
                      <Phone className="w-3 h-3 text-[var(--sidebar-text)] opacity-60" />
                      <span>{lead.phone}</span>
                    </div>
                    {lead.email && (
                      <div className="flex items-center gap-1.5 text-[var(--sidebar-text)] opacity-70">
                        <Mail className="w-3 h-3 opacity-60" />
                        <span>{lead.email}</span>
                      </div>
                    )}
                  </div>
                </td>

                <td className="px-5 py-4">
                  <span className="text-xs font-semibold text-[var(--foreground)] opacity-90">
                    {lead.source || 'Direct'}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] ${getPriorityBadgeClass(lead.priority)}`}>
                    {lead.priority || 'MEDIUM'}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadgeClass(lead.status)}`}>
                    {lead.status.replace('_', ' ')}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <div className="flex items-center gap-1.5 text-xs text-[var(--sidebar-text)] opacity-70">
                    <Clock className="w-3.5 h-3.5 opacity-60" />
                    <span>{new Date(lead.updatedAt).toLocaleDateString()}</span>
                  </div>
                </td>

                <td className="px-5 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      title="Edit Lead"
                      onClick={(e) => { e.stopPropagation(); onEditLead(lead); }}
                      className="inline-flex items-center justify-center w-7 h-7 rounded bg-[var(--background)]/60 border border-[var(--sidebar-border)] text-[var(--sidebar-text)] hover:text-[var(--color-primary-300)] hover:border-[var(--color-primary-300)]/30 hover:bg-[var(--color-primary-300)]/10 transition-all cursor-pointer"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      title="View Details"
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
