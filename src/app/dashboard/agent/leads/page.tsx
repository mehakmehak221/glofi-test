'use client';

import React, { useState, useEffect } from 'react';
import { Lead, QueryLeadsDto, CreateLeadDto } from '@/types/crm';
import { agentCrmApi } from '@/services/agentCrmApi';
import { LeadFilters } from '@/components/dashboard/agent/crm/LeadFilters';
import { LeadTable } from '@/components/dashboard/agent/crm/LeadTable';
import { CreateLeadModal } from '@/components/dashboard/agent/crm/CreateLeadModal';
import { LeadDetailsDrawer } from '@/components/dashboard/agent/crm/LeadDetailsDrawer';
import { Users, UserPlus, CheckCircle2, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

export default function AgentLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const [filters, setFilters] = useState<QueryLeadsDto>({ page: 1, limit: 10 });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

  useEffect(() => { fetchLeads(); }, [filters]);

  const fetchLeads = async () => {
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
  };

  const handleFilterChange = (newFilters: Partial<QueryLeadsDto>) =>
    setFilters((prev) => ({ ...prev, ...newFilters }));

  const handleResetFilters = () => setFilters({ page: 1, limit: 10 });

  const handleCreateLead = async (data: CreateLeadDto) => {
    await agentCrmApi.createLead(data);
    fetchLeads();
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

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: 'Total Assigned', value: total, icon: Users, color: 'text-[var(--color-primary-300)]' },
          { label: 'New Leads', value: leads.filter((l) => l.status === 'NEW').length, icon: UserPlus, color: 'text-[var(--color-primary-300)]' },
          { label: 'In Contact', value: leads.filter((l) => l.status === 'CONTACTED' || l.status === 'INTERESTED').length, icon: Clock, color: 'text-amber-400' },
          { label: 'Converted', value: leads.filter((l) => l.status === 'INVESTED' || l.status === 'CLOSED').length, icon: CheckCircle2, color: 'text-[var(--color-primary-300)]' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-[var(--card-surface)] border border-[var(--sidebar-border)] rounded-md p-6 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-[var(--sidebar-text)] opacity-60 uppercase tracking-widest mb-1">{label}</p>
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

      <LeadDetailsDrawer
        leadId={selectedLeadId}
        onClose={() => setSelectedLeadId(null)}
        onLeadUpdated={fetchLeads}
      />
    </div>
  );
}
