'use client';

import React, { useState, useEffect } from 'react';
import { FollowUp, FollowUpStatus } from '@/types/crm';
import { agentCrmApi } from '@/services/agentCrmApi';
import { Calendar, Clock, CheckCircle2, XCircle, User } from 'lucide-react';
import { getStatusBadgeClass } from '@/components/dashboard/agent/crm/LeadTable';
import { useI18n } from '@/providers/LocaleProvider';

export default function AgentFollowUpsPage() {
  const { t } = useI18n();
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState<FollowUpStatus | ''>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { fetchFollowUps(); }, [statusFilter]);

  const fetchFollowUps = async () => {
    try {
      setIsLoading(true);
      const res = await agentCrmApi.getAgentFollowUps({ status: statusFilter || undefined });
      setFollowUps(res.items);
      setTotal(res.total);
    } catch (err) {
      console.error('Failed to fetch followups:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (
    followUpId: string,
    status: FollowUpStatus.COMPLETED | FollowUpStatus.CANCELLED
  ) => {
    try {
      await agentCrmApi.updateFollowUpStatus(followUpId, status);
      fetchFollowUps();
    } catch (err) {
      alert(t('Failed to update follow-up status.'));
    }
  };

  const TAB_FILTERS = [
    { label: t("All Follow-ups ({total})", { total }), value: '' as FollowUpStatus | '' },
    { label: t("Pending"), value: FollowUpStatus.PENDING },
    { label: t("Completed"), value: FollowUpStatus.COMPLETED },
    { label: t("Cancelled"), value: FollowUpStatus.CANCELLED },
  ];

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 max-w-[1200px] mx-auto font-montserrat space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-1 rounded-md bg-[var(--badge-bg)] border border-[var(--badge-border)] text-[var(--badge-text)] text-[10px] font-bold uppercase tracking-widest">
            {t("Agent Tasks")}
          </span>
          <span className="text-xs text-[var(--sidebar-text)] opacity-60">• {t("Follow-Up Queue")}</span>
        </div>
        <h1 className="text-3xl font-bold text-[var(--foreground)] tracking-tight">
          {t("Scheduled Follow-ups")}
        </h1>
        <p className="text-sm text-[var(--sidebar-text)] opacity-60 mt-1">
          {t("Stay on top of your client communications, call schedules, and KYC reminders.")}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-[var(--sidebar-border)] pb-3">
        {TAB_FILTERS.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setStatusFilter(value)}
            className={`px-4 py-2 rounded-md text-xs font-bold transition-all cursor-pointer ${
              statusFilter === value
                ? 'bg-[var(--color-primary-300)] text-[#050505] shadow-[var(--shadow-btn)]'
                : 'text-[var(--sidebar-text)] opacity-60 hover:opacity-100 hover:text-[var(--foreground)] hover:bg-[var(--color-primary-300)]/5'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* List */}
      {isLoading ? (
        <div className="bg-[var(--card-surface)] border border-[var(--sidebar-border)] rounded-md p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[var(--color-primary-300)] border-t-transparent mb-3" />
          <p className="text-sm text-[var(--sidebar-text)] opacity-60">{t("Loading follow-ups queue...")}</p>
        </div>
      ) : followUps.length === 0 ? (
        <div className="bg-[var(--card-surface)] border border-[var(--sidebar-border)] rounded-md p-12 text-center">
          <Calendar className="w-10 h-10 text-[var(--color-primary-300)] mx-auto mb-3 opacity-60" />
          <h4 className="text-base font-bold text-[var(--foreground)]">{t("No Follow-ups Found")}</h4>
          <p className="text-xs text-[var(--sidebar-text)] opacity-60 mt-1">{t("You have no scheduled follow-ups matching this view.")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {followUps.map((fu) => {
            const isOverdue = fu.status === FollowUpStatus.PENDING && new Date(fu.dueAt).getTime() < Date.now();

            return (
              <div
                key={fu.id}
                className={`bg-[var(--card-surface)] rounded-md border p-5 flex flex-col justify-between transition-all ${
                  isOverdue
                    ? 'border-rose-500/30'
                    : 'border-[var(--sidebar-border)]'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            fu.status === FollowUpStatus.COMPLETED
                              ? 'bg-[var(--color-primary-300)]/15 text-[var(--color-primary-300)]'
                              : fu.status === FollowUpStatus.CANCELLED
                              ? 'bg-rose-500/15 text-rose-400'
                              : isOverdue
                              ? 'bg-rose-500 text-white animate-pulse'
                              : 'bg-amber-500/15 text-amber-400'
                          }`}
                        >
                          {isOverdue ? t('OVERDUE') : t(fu.status)}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-[var(--foreground)]">{fu.title}</h3>
                    </div>

                    {fu.status === FollowUpStatus.PENDING && (
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          title={t("Mark Completed")}
                          onClick={() => handleUpdateStatus(fu.id, FollowUpStatus.COMPLETED)}
                          className="px-3 py-1.5 rounded-md bg-[var(--color-primary-300)] hover:bg-[var(--color-primary-300)]/90 text-[#050505] text-xs font-bold flex items-center gap-1 transition-all shadow-[var(--shadow-btn)] cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {t("Done")}
                        </button>
                        <button
                          title={t("Cancel Task")}
                          onClick={() => handleUpdateStatus(fu.id, FollowUpStatus.CANCELLED)}
                          className="p-1.5 rounded-md border border-[var(--sidebar-border)] text-[var(--sidebar-text)] hover:text-rose-400 transition-colors cursor-pointer"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {fu.description && (
                    <p className="text-xs text-[var(--sidebar-text)] opacity-70 bg-[var(--background)]/35 p-3 rounded-md border border-[var(--sidebar-border)]">
                      {fu.description}
                    </p>
                  )}

                  {/* Lead details card */}
                  {fu.lead && (
                    <div className="flex items-center justify-between p-3 rounded-md bg-[var(--background)]/35 border border-[var(--sidebar-border)]">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <User className="w-3.5 h-3.5 text-[var(--color-primary-300)]" />
                          <span className="text-xs font-bold text-[var(--foreground)]">
                            {fu.lead.name}
                          </span>
                        </div>
                        <div className="text-[11px] text-[var(--sidebar-text)] opacity-50 pl-5">{fu.lead.phone}</div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getStatusBadgeClass(fu.lead.status)}`}>
                        {t(fu.lead.status.replace('_', ' '))}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 mt-4 border-t border-[var(--sidebar-border)] text-[11px] text-[var(--sidebar-text)] opacity-50">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[var(--color-primary-300)]" />
                    <span>{t("Due: {due}", { due: new Date(fu.dueAt).toLocaleString() })}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
