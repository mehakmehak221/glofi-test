'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Lead, QueryLeadsDto, CreateLeadDto, UpdateLeadDto } from '@/types/crm';
import { agentCrmApi } from '@/services/agentCrmApi';
import { LeadFilters } from '@/components/dashboard/agent/crm/LeadFilters';
import { LeadTable } from '@/components/dashboard/agent/crm/LeadTable';
import { CreateLeadModal } from '@/components/dashboard/agent/crm/CreateLeadModal';
import { EditLeadModal } from '@/components/dashboard/agent/crm/EditLeadModal';
import { DeleteLeadModal } from '@/components/dashboard/agent/crm/DeleteLeadModal';
import { LeadDetailsDrawer } from '@/components/dashboard/agent/crm/LeadDetailsDrawer';
import { Users, UserPlus, CheckCircle2, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { useI18n } from '@/providers/LocaleProvider';

interface LeadStats {
  totalAssigned: number;
  newLeads: number;
  inContact: number;
  converted: number;
}

export default function AgentLeadsPage() {
  const { t } = useI18n();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const [stats, setStats] = useState<LeadStats>({
    totalAssigned: 0,
    newLeads: 0,
    inContact: 0,
    converted: 0,
  });

  const [filters, setFilters] = useState<QueryLeadsDto>({ page: 1, limit: 10 });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [leadForEdit, setLeadForEdit] = useState<Lead | null>(null);
  const [leadForDelete, setLeadForDelete] = useState<Lead | null>(null);


  const fetchStats = useCallback(async () => {
    try {
      const res = await agentCrmApi.getLeads({ page: 1, limit: 9999 });
      const allLeads = res.items;
      setStats({
        totalAssigned: res.total,
        newLeads: allLeads.filter((l) => l.status === 'NEW').length,
        inContact: allLeads.filter(
          (l) => l.status === 'CONTACTED' || l.status === 'INTERESTED'
        ).length,
        converted: allLeads.filter(
          (l) => l.status === 'INVESTED' || l.status === 'CLOSED'
        ).length,
      });
    } catch (err) {
      console.error('Failed to fetch lead stats:', err);
    }
  }, []);

  const fetchLeads = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await agentCrmApi.getLeads(filters);
      setLeads(res.items);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error('Failed to fetch leads:', err);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  const handleFilterChange = (newFilters: Partial<QueryLeadsDto>) =>
    setFilters((prev) => ({ ...prev, ...newFilters }));

  const handleResetFilters = () => setFilters({ page: 1, limit: 10 });

  const handleCreateLead = async (data: CreateLeadDto) => {
    await agentCrmApi.createLead(data);
    // Refresh both the paginated list and the KPI stats
    await Promise.all([fetchLeads(), fetchStats()]);
  };

  const handleEditLead = async (data: UpdateLeadDto) => {
    if (!leadForEdit) return;
    await agentCrmApi.updateLead(leadForEdit.id, data);
    await Promise.all([fetchLeads(), fetchStats()]);
  };

  const handleDeleteLead = async () => {
    if (!leadForDelete) return;
    await agentCrmApi.deleteLead(leadForDelete.id);
    await Promise.all([fetchLeads(), fetchStats()]);
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 max-w-[1200px] mx-auto font-montserrat space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-1 rounded-md bg-[var(--badge-bg)] border border-[var(--badge-border)] text-[var(--badge-text)] text-[10px] font-bold uppercase tracking-widest">
            {t("Agent Workspace")}
          </span>
          <span className="text-xs text-[var(--sidebar-text)] opacity-60">• {t("Lead Pipeline")}</span>
        </div>
        <h1 className="text-3xl font-bold text-[var(--foreground)] tracking-tight">
          {t("Assigned Leads & CRM")}
        </h1>
        <p className="text-sm text-[var(--sidebar-text)] opacity-60 mt-1">
          {t("Manage your investor prospects, track status transitions, add notes, and schedule follow-ups.")}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: 'Total Assigned', value: stats.totalAssigned, icon: Users, color: 'text-[var(--color-primary-300)]' },
          { label: 'New Leads', value: stats.newLeads, icon: UserPlus, color: 'text-[var(--color-primary-300)]' },
          { label: 'In Contact', value: stats.inContact, icon: Clock, color: 'text-amber-400' },
          { label: 'Converted', value: stats.converted, icon: CheckCircle2, color: 'text-[var(--color-primary-300)]' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-[var(--card-surface)] border border-[var(--sidebar-border)] rounded-md p-6 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-[var(--sidebar-text)] opacity-60 uppercase tracking-widest mb-1">{t(label)}</p>
              <p className={`text-3xl font-bold ${color}`}>{value}</p>
            </div>
            <div className={`w-10 h-10 rounded-md bg-[var(--color-primary-300)]/10 flex items-center justify-center ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
          </div>
        ))}
      </div>

      {/* Filter Component */}
      <LeadFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        isLoading={isLoading}
      />

      {/* Leads Table */}
      <LeadTable
        leads={leads}
        isLoading={isLoading}
        onSelectLead={(lead) => setSelectedLeadId(lead.id)}
        onEditLead={(lead) => setLeadForEdit(lead)}
        onDeleteLead={(lead) => setLeadForDelete(lead)}
      />

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-3 bg-[var(--card-surface)] border border-[var(--sidebar-border)] rounded-md text-xs">
          <span className="text-[var(--sidebar-text)] opacity-60 font-medium">
            {t("Page {page} of {totalPages} ({total} total leads)", { page: filters.page || 1, totalPages, total })}
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={(filters.page || 1) <= 1}
              onClick={() => handleFilterChange({ page: (filters.page || 1) - 1 })}
              className="p-2 rounded-md border border-[var(--sidebar-border)] text-[var(--sidebar-text)] disabled:opacity-30 hover:text-[var(--foreground)] hover:bg-[var(--color-primary-300)]/5 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              disabled={(filters.page || 1) >= totalPages}
              onClick={() => handleFilterChange({ page: (filters.page || 1) + 1 })}
              className="p-2 rounded-md border border-[var(--sidebar-border)] text-[var(--sidebar-text)] disabled:opacity-30 hover:text-[var(--foreground)] hover:bg-[var(--color-primary-300)]/5 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <CreateLeadModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateLead}
      />

      <EditLeadModal
        isOpen={leadForEdit !== null}
        lead={leadForEdit}
        onClose={() => setLeadForEdit(null)}
        onSubmit={handleEditLead}
      />

      <DeleteLeadModal
        isOpen={leadForDelete !== null}
        lead={leadForDelete}
        onClose={() => setLeadForDelete(null)}
        onConfirm={handleDeleteLead}
      />

      <LeadDetailsDrawer
        leadId={selectedLeadId}
        onClose={() => setSelectedLeadId(null)}
        onLeadUpdated={fetchLeads}
      />
    </div>
  );
}
