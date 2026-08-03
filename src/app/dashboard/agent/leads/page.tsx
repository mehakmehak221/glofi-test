'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Lead, QueryLeadsDto, CreateLeadDto, UpdateLeadDto } from '@/types/crm';
import { agentCrmApi } from '@/services/agentCrmApi';
import { LeadFilters } from '@/components/dashboard/agent/crm/LeadFilters';
import { LeadTable } from '@/components/dashboard/agent/crm/LeadTable';
import { CreateLeadModal } from '@/components/dashboard/agent/crm/CreateLeadModal';
import { EditLeadModal } from '@/components/dashboard/agent/crm/EditLeadModal';
import { LeadDetailsDrawer } from '@/components/dashboard/agent/crm/LeadDetailsDrawer';
import { Users, UserPlus, CheckCircle2, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

interface LeadStats {
  totalAssigned: number;
  newLeads: number;
  inContact: number;
  converted: number;
}

export default function AgentLeadsPage() {
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

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleFilterChange = (newFilters: Partial<QueryLeadsDto>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: newFilters.page !== undefined ? newFilters.page : 1, // Reset page on filter change unless page itself changed
    }));
  };

  const handleCreateLead = async (data: CreateLeadDto) => {
    await agentCrmApi.createLead(data);
    // Refresh both the paginated list and the KPI stats
    await Promise.all([fetchLeads(), fetchStats()]);
  };

  const handleResetFilters = () => {
    setFilters({ page: 1, limit: 10 });
  };

  const handleEditLead = async (data: UpdateLeadDto) => {
    if (!leadForEdit) return;
    await agentCrmApi.updateLead(leadForEdit.id, data);
    await Promise.all([fetchLeads(), fetchStats()]);
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 max-w-[1200px] mx-auto font-montserrat space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-1 rounded-md bg-[var(--badge-bg)] border border-[var(--badge-border)] text-[var(--badge-text)] text-[10px] font-bold uppercase tracking-widest">
            Agent Workspace
          </span>
          <span className="text-xs text-[var(--sidebar-text)] opacity-60">• Lead Pipeline</span>
        </div>
        <h1 className="text-3xl font-bold text-[var(--foreground)] tracking-tight">
          Assigned Leads & CRM
        </h1>
        <p className="text-sm text-[var(--sidebar-text)] opacity-60 mt-1">
          Manage your investor prospects, track status transitions, add notes, and schedule follow-ups.
        </p>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Assigned */}
        <div className="bg-[var(--card-surface)] border border-[var(--sidebar-border)] rounded-md p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-md bg-[var(--color-primary-300)]/10 text-[var(--color-primary-300)] flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-[var(--foreground)]">{stats.totalAssigned}</p>
            <p className="text-xs font-semibold text-[var(--sidebar-text)] opacity-60 uppercase tracking-wider">Total Leads</p>
          </div>
        </div>

        {/* New Leads */}
        <div className="bg-[var(--card-surface)] border border-[var(--sidebar-border)] rounded-md p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-md bg-[var(--badge-bg)] text-[var(--badge-text)] border border-[var(--badge-border)] flex items-center justify-center">
            <UserPlus className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-[var(--foreground)]">{stats.newLeads}</p>
            <p className="text-xs font-semibold text-[var(--sidebar-text)] opacity-60 uppercase tracking-wider">New Leads</p>
          </div>
        </div>

        {/* In Contact */}
        <div className="bg-[var(--card-surface)] border border-[var(--sidebar-border)] rounded-md p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-md bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-[var(--foreground)]">{stats.inContact}</p>
            <p className="text-xs font-semibold text-[var(--sidebar-text)] opacity-60 uppercase tracking-wider">In Contact</p>
          </div>
        </div>

        {/* Converted */}
        <div className="bg-[var(--card-surface)] border border-[var(--sidebar-border)] rounded-md p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-md bg-[var(--color-primary-300)]/10 text-[var(--color-primary-300)] border border-[var(--color-primary-300)]/25 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-[var(--foreground)]">{stats.converted}</p>
            <p className="text-xs font-semibold text-[var(--sidebar-text)] opacity-60 uppercase tracking-wider">Converted</p>
          </div>
        </div>
      </div>

      {/* Filters Section */}
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
      />

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-3 bg-[var(--card-surface)] border border-[var(--sidebar-border)] rounded-md text-xs">
          <span className="text-[var(--sidebar-text)] opacity-60 font-medium">
            Page {filters.page || 1} of {totalPages} ({total} total leads)
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

      <LeadDetailsDrawer
        leadId={selectedLeadId}
        onClose={() => setSelectedLeadId(null)}
        onLeadUpdated={fetchLeads}
      />
    </div>
  );
}
