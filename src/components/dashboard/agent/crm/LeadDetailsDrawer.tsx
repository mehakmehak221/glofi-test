'use client';

import React, { useState, useEffect } from 'react';
import {
  Lead,
  LeadStatus,
  ALLOWED_STATUS_TRANSITIONS,
  FollowUpStatus,
  LeadNote,
  FollowUp,
  LeadActivity,
  ScheduleFollowUpDto,
} from '@/types/crm';
import { agentCrmApi } from '@/services/agentCrmApi';
import { getStatusBadgeClass, getPriorityBadgeClass } from './LeadTable';
import { ScheduleFollowUpModal } from './ScheduleFollowUpModal';
import {
  X,
  Phone,
  Mail,
  Calendar,
  Clock,
  MessageSquare,
  Activity,
  CheckCircle2,
  XCircle,
  Plus,
  ArrowRight,
  Send,
  User,
} from 'lucide-react';

interface LeadDetailsDrawerProps {
  leadId: string | null;
  onClose: () => void;
  onLeadUpdated: () => void;
}

export const LeadDetailsDrawer: React.FC<LeadDetailsDrawerProps> = ({
  leadId,
  onClose,
  onLeadUpdated,
}) => {
  const [lead, setLead] = useState<Lead | null>(null);
  const [notes, setNotes] = useState<LeadNote[]>([]);
  const [timeline, setTimeline] = useState<LeadActivity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'activity' | 'notes' | 'followups'>('activity');

  const [newNoteText, setNewNoteText] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    if (leadId) {
      loadLeadDetails(leadId);
    }
  }, [leadId]);

  const loadLeadDetails = async (id: string) => {
    try {
      setIsLoading(true);
      const [leadData, notesData, timelineData] = await Promise.all([
        agentCrmApi.getLeadById(id),
        agentCrmApi.getNotes(id),
        agentCrmApi.getLeadTimeline(id),
      ]);
      setLead(leadData);
      setNotes(notesData);
      setTimeline(timelineData);
    } catch (err) {
      console.error('Error loading lead details:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!leadId) return null;

  const handleStatusChange = async (nextStatus: LeadStatus) => {
    if (!lead) return;
    try {
      setIsUpdatingStatus(true);
      const updated = await agentCrmApi.updateLead(lead.id, { status: nextStatus });
      setLead(updated);
      await loadLeadDetails(lead.id);
      onLeadUpdated();
    } catch (err) {
      alert('Failed to update status.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lead || !newNoteText.trim()) return;
    try {
      setIsAddingNote(true);
      await agentCrmApi.addNote(lead.id, newNoteText);
      setNewNoteText('');
      await loadLeadDetails(lead.id);
      onLeadUpdated();
    } catch (err) {
      alert('Failed to add note.');
    } finally {
      setIsAddingNote(false);
    }
  };

  const handleScheduleFollowUp = async (data: ScheduleFollowUpDto) => {
    if (!lead) return;
    await agentCrmApi.scheduleFollowUp(lead.id, data);
    await loadLeadDetails(lead.id);
    onLeadUpdated();
  };

  const handleUpdateFollowUpStatus = async (
    followUpId: string,
    status: FollowUpStatus.COMPLETED | FollowUpStatus.CANCELLED
  ) => {
    if (!lead) return;
    await agentCrmApi.updateFollowUpStatus(followUpId, status);
    await loadLeadDetails(lead.id);
    onLeadUpdated();
  };

  const allowedNextStatuses = lead ? ALLOWED_STATUS_TRANSITIONS[lead.status] || [] : [];

  return (
    <>
      <div className="fixed inset-0 z-40 bg-[var(--color-bg-dark)]/50 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-2xl bg-[var(--form-surface)] border-l border-[var(--sidebar-border)] shadow-2xl flex flex-col animate-slide-left font-montserrat">
        {isLoading || !lead ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-[var(--color-primary-300)] border-t-transparent mb-3" />
            <p className="text-xs text-[var(--sidebar-text)] opacity-60">Loading lead profile...</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="p-6 border-b border-[var(--sidebar-border)] space-y-4">
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1 mr-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl font-bold text-[var(--foreground)] truncate">{lead.name}</h2>
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0 ${getPriorityBadgeClass(lead.priority)}`}>
                      {lead.priority || 'NORMAL'}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--sidebar-text)] opacity-50 mt-0.5 truncate">Lead ID: {lead.id}</p>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-md text-[var(--sidebar-text)] hover:text-[var(--foreground)] hover:bg-[var(--color-primary-300)]/10 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status & Transition Actions */}
              <div className="bg-[var(--background)]/35 p-4 rounded-md border border-[var(--sidebar-border)] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[var(--sidebar-text)] opacity-60 uppercase tracking-widest">Current Status</span>
                  <span className={`px-3 py-1 rounded text-xs font-bold ${getStatusBadgeClass(lead.status)}`}>
                    {lead.status.replace('_', ' ')}
                  </span>
                </div>

                {allowedNextStatuses.length > 0 && (
                  <div className="pt-2 border-t border-[var(--sidebar-border)]">
                    <div className="text-[10px] font-bold text-[var(--sidebar-text)] opacity-60 uppercase tracking-widest mb-2">
                      Allowed Next Transitions
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {allowedNextStatuses.map((st) => (
                        <button
                          key={st}
                          disabled={isUpdatingStatus}
                          onClick={() => handleStatusChange(st)}
                          className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                            st === LeadStatus.LOST
                              ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20'
                              : 'bg-[var(--color-primary-300)] hover:bg-[var(--color-primary-300)]/90 text-[#050505] shadow-[var(--shadow-btn)]'
                          }`}
                        >
                          <span>Move to {st.replace('_', ' ')}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-2 text-[var(--foreground)] opacity-80 min-w-0">
                  <Phone className="w-4 h-4 text-[var(--color-primary-300)] shrink-0" />
                  <span className="font-semibold truncate">{lead.phone}</span>
                </div>
                {lead.email && (
                  <div className="flex items-center gap-2 text-[var(--foreground)] opacity-70 min-w-0">
                    <Mail className="w-4 h-4 text-[var(--color-primary-300)] shrink-0" />
                    <span className="truncate">{lead.email}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-[var(--sidebar-border)] px-6 bg-[var(--background)]/20">
              {[
                { key: 'activity', icon: Activity, label: `Timeline & Activity (${timeline.length})` },
                { key: 'notes', icon: MessageSquare, label: `Notes (${notes.length})` },
                { key: 'followups', icon: Calendar, label: `Follow-ups (${lead.followUps?.length || 0})` },
              ].map(({ key, icon: Icon, label }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key as typeof activeTab)}
                  className={`py-3 px-4 text-[11px] font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
                    activeTab === key
                      ? 'border-[var(--color-primary-300)] text-[var(--color-primary-300)]'
                      : 'border-transparent text-[var(--sidebar-text)] opacity-60 hover:opacity-100 hover:text-[var(--foreground)]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Timeline Tab */}
              {activeTab === 'activity' && (
                <div className="space-y-4">
                  {timeline.length === 0 ? (
                    <p className="text-xs text-[var(--sidebar-text)] opacity-60 text-center py-8">No activity recorded yet.</p>
                  ) : (
                    <div className="relative pl-6 border-l-2 border-[var(--sidebar-border)] space-y-6">
                      {timeline.map((act) => (
                        <div key={act.id} className="relative">
                          <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-[var(--form-surface)] border-2 border-[var(--color-primary-300)]" />
                          <div className="bg-[var(--background)]/35 p-3.5 rounded-md border border-[var(--sidebar-border)] space-y-1">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-bold text-[var(--foreground)]">
                                {act.type.replace('_', ' ')}
                              </span>
                              <span className="text-[var(--sidebar-text)] opacity-50">
                                {new Date(act.createdAt).toLocaleString()}
                              </span>
                            </div>
                            {act.metadata && (
                              <p className="text-xs text-[var(--sidebar-text)] opacity-60 font-mono">
                                {JSON.stringify(act.metadata)}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Notes Tab */}
              {activeTab === 'notes' && (
                <div className="space-y-4">
                  <form onSubmit={handleAddNote} className="space-y-2">
                    <textarea
                      rows={3}
                      placeholder="Add a new internal note or call transcript..."
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      className="w-full p-3 rounded-md bg-[var(--background)] border border-[var(--sidebar-border)] text-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-300)]/20 focus:border-[var(--color-primary-300)] text-[var(--foreground)] placeholder:text-[var(--sidebar-text)] placeholder:opacity-40 resize-none"
                    />
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={isAddingNote || !newNoteText.trim()}
                        className="px-4 py-2 rounded-md bg-[var(--color-primary-300)] hover:bg-[var(--color-primary-300)]/90 text-[#050505] disabled:opacity-50 text-xs font-bold flex items-center gap-1.5 transition-all shadow-[var(--shadow-btn)] cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        {isAddingNote ? 'Posting...' : 'Post Note'}
                      </button>
                    </div>
                  </form>

                  <div className="space-y-3 pt-2">
                    {notes.length === 0 ? (
                      <p className="text-xs text-[var(--sidebar-text)] opacity-60 text-center py-6">No notes added for this lead yet.</p>
                    ) : (
                      notes.map((n) => (
                        <div
                          key={n.id}
                          className="bg-[var(--background)]/35 p-4 rounded-md border border-[var(--sidebar-border)] space-y-2"
                        >
                          <p className="text-xs text-[var(--foreground)] opacity-80 leading-relaxed whitespace-pre-line">
                            {n.note}
                          </p>
                          <div className="flex items-center justify-between text-[10px] text-[var(--sidebar-text)] opacity-50 pt-2 border-t border-[var(--sidebar-border)]">
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3 text-[var(--color-primary-300)]" />
                              {n.author?.agentProfile?.fullName || 'Agent'}
                            </span>
                            <span>{new Date(n.createdAt).toLocaleString()}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Follow-ups Tab */}
              {activeTab === 'followups' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold text-[var(--foreground)] uppercase tracking-widest opacity-70">Scheduled Actions</h4>
                    <button
                      onClick={() => setIsScheduleModalOpen(true)}
                      className="px-3 py-1.5 rounded-md bg-[var(--color-primary-300)] hover:bg-[var(--color-primary-300)]/90 text-[#050505] text-xs font-bold flex items-center gap-1 shadow-[var(--shadow-btn)] transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Schedule Follow-up
                    </button>
                  </div>

                  <div className="space-y-3">
                    {(!lead.followUps || lead.followUps.length === 0) ? (
                      <p className="text-xs text-[var(--sidebar-text)] opacity-60 text-center py-8">No follow-ups scheduled.</p>
                    ) : (
                      lead.followUps.map((fu) => (
                        <div
                          key={fu.id}
                          className="bg-[var(--background)]/35 p-4 rounded-md border border-[var(--sidebar-border)] flex items-start justify-between gap-4"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h5 className="text-xs font-bold text-[var(--foreground)]">{fu.title}</h5>
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  fu.status === FollowUpStatus.COMPLETED
                                    ? 'bg-[var(--color-primary-300)]/15 text-[var(--color-primary-300)]'
                                    : fu.status === FollowUpStatus.CANCELLED
                                    ? 'bg-rose-500/15 text-rose-400'
                                    : 'bg-amber-500/15 text-amber-400'
                                }`}
                              >
                                {fu.status}
                              </span>
                            </div>
                            {fu.description && (
                              <p className="text-xs text-[var(--sidebar-text)] opacity-60">{fu.description}</p>
                            )}
                            <div className="flex items-center gap-1 text-[11px] text-[var(--sidebar-text)] opacity-50 pt-1">
                              <Clock className="w-3 h-3 text-[var(--color-primary-300)]" />
                              Due: {new Date(fu.dueAt).toLocaleString()}
                            </div>
                          </div>

                          {fu.status === FollowUpStatus.PENDING && (
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                title="Mark Completed"
                                onClick={() => handleUpdateFollowUpStatus(fu.id, FollowUpStatus.COMPLETED)}
                                className="p-1.5 rounded-md bg-[var(--color-primary-300)]/10 text-[var(--color-primary-300)] hover:bg-[var(--color-primary-300)]/20 transition-colors cursor-pointer"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                              <button
                                title="Cancel Follow-up"
                                onClick={() => handleUpdateFollowUpStatus(fu.id, FollowUpStatus.CANCELLED)}
                                className="p-1.5 rounded-md bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors cursor-pointer"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <ScheduleFollowUpModal
        isOpen={isScheduleModalOpen}
        leadName={lead?.name}
        onClose={() => setIsScheduleModalOpen(false)}
        onSubmit={handleScheduleFollowUp}
      />
    </>
  );
};
