'use client';

import React, { useState } from 'react';
import { ScheduleFollowUpDto } from '@/types/crm';
import { X, Calendar, AlertCircle } from 'lucide-react';

interface ScheduleFollowUpModalProps {
  isOpen: boolean;
  leadName?: string;
  onClose: () => void;
  onSubmit: (data: ScheduleFollowUpDto) => Promise<void>;
}

export const ScheduleFollowUpModal: React.FC<ScheduleFollowUpModalProps> = ({
  isOpen,
  leadName,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('10:00');
  const [reminder, setReminder] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dueDate) {
      setError('Title and Due Date are required.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      const dueIso = new Date(`${dueDate}T${dueTime}:00`).toISOString();
      const reminderIso = reminder
        ? new Date(new Date(dueIso).getTime() - 30 * 60000).toISOString()
        : undefined;

      await onSubmit({
        title,
        description: description.trim() || undefined,
        dueAt: dueIso,
        reminderAt: reminderIso,
      });

      setTitle('');
      setDescription('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to schedule follow-up.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--color-bg-dark)]/70 backdrop-blur-sm font-montserrat">
      <div className="bg-[var(--form-surface)] border border-[var(--sidebar-border)] rounded-md shadow-2xl w-full max-w-md overflow-hidden">

        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--sidebar-border)]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-md bg-[var(--color-primary-300)]/10 text-[var(--color-primary-300)] flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--foreground)]">Schedule Follow-up</h3>
              <p className="text-xs text-[var(--sidebar-text)] opacity-60">{leadName ? `For ${leadName}` : 'Set task reminder'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-md text-[var(--sidebar-text)] hover:text-[var(--foreground)] hover:bg-[var(--color-primary-300)]/10 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[var(--sidebar-text)] opacity-80 mb-1.5 uppercase tracking-wider">
              Title / Action Item <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Call regarding KYC document submission"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-md bg-[var(--background)] border border-[var(--sidebar-border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-300)]/20 focus:border-[var(--color-primary-300)] text-[var(--foreground)] placeholder:text-[var(--sidebar-text)] placeholder:opacity-40"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[var(--sidebar-text)] opacity-80 mb-1.5 uppercase tracking-wider">
                Due Date <span className="text-rose-400">*</span>
              </label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-[var(--background)] border border-[var(--sidebar-border)] text-xs font-medium text-[var(--foreground)] focus:outline-none focus:border-[var(--color-primary-300)]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--sidebar-text)] opacity-80 mb-1.5 uppercase tracking-wider">
                Due Time
              </label>
              <input
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-[var(--background)] border border-[var(--sidebar-border)] text-xs font-medium text-[var(--foreground)] focus:outline-none focus:border-[var(--color-primary-300)]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--sidebar-text)] opacity-80 mb-1.5 uppercase tracking-wider">
              Description / Instructions
            </label>
            <textarea
              rows={2}
              placeholder="Notes on what needs to be discussed..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-md bg-[var(--background)] border border-[var(--sidebar-border)] text-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-300)]/20 focus:border-[var(--color-primary-300)] text-[var(--foreground)] placeholder:text-[var(--sidebar-text)] placeholder:opacity-40 resize-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="reminder"
              checked={reminder}
              onChange={(e) => setReminder(e.target.checked)}
              className="rounded border-[var(--sidebar-border)] accent-[var(--color-primary-300)]"
            />
            <label htmlFor="reminder" className="text-xs text-[var(--sidebar-text)] opacity-80 select-none cursor-pointer">
              Set automated 30-minute prior reminder
            </label>
          </div>


          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--sidebar-border)]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-md text-xs font-bold text-[var(--sidebar-text)] hover:text-[var(--foreground)] hover:bg-[var(--color-primary-300)]/5 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-md bg-[var(--color-primary-300)] hover:bg-[var(--color-primary-300)]/90 text-[#050505] text-xs font-bold shadow-[var(--shadow-btn)] flex items-center gap-2 transition-all cursor-pointer disabled:opacity-60"
            >
              {isSubmitting ? 'Scheduling...' : 'Save Follow-up'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
