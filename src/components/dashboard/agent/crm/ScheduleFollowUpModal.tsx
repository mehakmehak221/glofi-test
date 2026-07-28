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

interface FieldErrors {
  title?: string;
  dueDate?: string;
  dueTime?: string;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="flex items-center gap-1.5 text-[11px] text-rose-400 font-medium mt-1">
      <AlertCircle className="w-3 h-3 shrink-0" />
      {message}
    </p>
  );
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
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Per-field error state
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // UI helpers — recomputed on every render so min values stay accurate.
  const nowForUi = new Date();
  const todayStr = nowForUi.toLocaleDateString('en-CA');
  const currentTimeStr = nowForUi.toTimeString().slice(0, 5);
  const minTime = dueDate === todayStr ? currentTimeStr : undefined;

  // ─── Validators ──────────────────────────────────────────────────────────────

  const validateTitle = (val: string): string | undefined => {
    if (!val.trim()) return 'Title is required.';
    if (val.trim().length < 3) return 'Title must be at least 3 characters.';
    if (val.trim().length > 200) return 'Title must be 200 characters or less.';
  };

  const validateDueDate = (val: string): string | undefined => {
    if (!val) return 'Due date is required.';
    if (val < todayStr) return 'Due date cannot be in the past.';
  };

  const validateDueTime = (val: string, date: string): string | undefined => {
    if (date === todayStr && val < currentTimeStr) {
      return 'Time cannot be in the past for today.';
    }
  };

  // ─── Blur handlers ────────────────────────────────────────────────────────────

  const handleBlur = (field: keyof FieldErrors) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    let err: string | undefined;
    if (field === 'title') err = validateTitle(title);
    if (field === 'dueDate') err = validateDueDate(dueDate);
    if (field === 'dueTime') err = validateDueTime(dueTime, dueDate);
    setFieldErrors((prev) => ({ ...prev, [field]: err }));
  };

  // ─── Change handlers (live re-validation once touched) ───────────────────────

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (touched.title) {
      setFieldErrors((prev) => ({ ...prev, title: validateTitle(val) }));
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.value;
    setDueDate(picked);

    // If agent switches back to today and the saved time is now in the past, reset it.
    if (picked === todayStr && dueTime < currentTimeStr) {
      setDueTime(currentTimeStr);
    }

    if (touched.dueDate) {
      setFieldErrors((prev) => ({ ...prev, dueDate: validateDueDate(picked) }));
    }
  };

  const handleTimeChange = (val: string) => {
    setDueTime(val);
    if (touched.dueTime) {
      setFieldErrors((prev) => ({ ...prev, dueTime: validateDueTime(val, dueDate) }));
    }
  };

  // ─── Full validation on submit ────────────────────────────────────────────────

  const runFullValidation = (): boolean => {
    const errors: FieldErrors = {
      title: validateTitle(title),
      dueDate: validateDueDate(dueDate),
      dueTime: validateDueTime(dueTime, dueDate),
    };
    setFieldErrors(errors);
    setTouched({ title: true, dueDate: true, dueTime: true });
    return !errors.title && !errors.dueDate && !errors.dueTime;
  };

  // ─── Submit ───────────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    if (!runFullValidation()) return;

    // Hard guard against past datetime (covers copy-paste / JS manipulation).
    const submittedAt = new Date();
    const dueIso = new Date(`${dueDate}T${dueTime}:00`).toISOString();
    if (new Date(dueIso) <= submittedAt) {
      setSubmitError('Due date and time must be in the future.');
      return;
    }

    try {
      setIsSubmitting(true);
      const reminderIso = reminder
        ? new Date(new Date(dueIso).getTime() - 30 * 60000).toISOString()
        : undefined;

      await onSubmit({
        title,
        description: description.trim() || undefined,
        dueAt: dueIso,
        reminderAt: reminderIso,
      });

      handleClose();
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to schedule follow-up.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Close (resets all state) ─────────────────────────────────────────────────

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setDueDate('');
    setDueTime('10:00');
    setReminder(true);
    setSubmitError(null);
    setFieldErrors({});
    setTouched({});
    onClose();
  };

  if (!isOpen) return null;

  // ─── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--color-bg-dark)]/70 backdrop-blur-sm font-montserrat">
      <div className="bg-[var(--form-surface)] border border-[var(--sidebar-border)] rounded-md shadow-2xl w-full max-w-md overflow-hidden">

        {/* Header */}
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
            onClick={handleClose}
            className="w-8 h-8 rounded-md text-[var(--sidebar-text)] hover:text-[var(--foreground)] hover:bg-[var(--color-primary-300)]/10 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="p-6 space-y-4">

          {/* Submit-level error (API errors) */}
          {submitError && (
            <div className="p-3 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-[var(--sidebar-text)] opacity-80 mb-1.5 uppercase tracking-wider">
              Title / Action Item <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Call regarding KYC document submission"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              onBlur={() => handleBlur('title')}
              className={`w-full px-3.5 py-2.5 rounded-md bg-[var(--background)] border text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-300)]/20 text-[var(--foreground)] placeholder:text-[var(--sidebar-text)] placeholder:opacity-40 transition ${fieldErrors.title
                  ? 'border-rose-500/60 focus:border-rose-500'
                  : 'border-[var(--sidebar-border)] focus:border-[var(--color-primary-300)]'
                }`}
            />
            <FieldError message={fieldErrors.title} />
          </div>

          {/* Due Date + Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[var(--sidebar-text)] opacity-80 mb-1.5 uppercase tracking-wider">
                Due Date <span className="text-rose-400">*</span>
              </label>
              <input
                type="date"
                value={dueDate}
                min={todayStr}
                onChange={handleDateChange}
                onBlur={() => handleBlur('dueDate')}
                className={`w-full px-3 py-2 rounded-md bg-[var(--background)] border text-xs font-medium text-[var(--foreground)] focus:outline-none transition ${fieldErrors.dueDate
                    ? 'border-rose-500/60 focus:border-rose-500'
                    : 'border-[var(--sidebar-border)] focus:border-[var(--color-primary-300)]'
                  }`}
              />
              <FieldError message={fieldErrors.dueDate} />
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--sidebar-text)] opacity-80 mb-1.5 uppercase tracking-wider">
                Due Time
              </label>
              <input
                type="time"
                value={dueTime}
                min={minTime}
                onChange={(e) => handleTimeChange(e.target.value)}
                onBlur={() => handleBlur('dueTime')}
                className={`w-full px-3 py-2 rounded-md bg-[var(--background)] border text-xs font-medium text-[var(--foreground)] focus:outline-none transition ${fieldErrors.dueTime
                    ? 'border-rose-500/60 focus:border-rose-500'
                    : 'border-[var(--sidebar-border)] focus:border-[var(--color-primary-300)]'
                  }`}
              />
              <FieldError message={fieldErrors.dueTime} />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-[var(--sidebar-text)] opacity-80 mb-1.5 uppercase tracking-wider">
              Description / Instructions
            </label>
            <textarea
              rows={2}
              placeholder="Notes on what needs to be discussed..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-md bg-[var(--background)] border border-[var(--sidebar-border)] text-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-300)]/20 focus:border-[var(--color-primary-300)] text-[var(--foreground)] placeholder:text-[var(--sidebar-text)] placeholder:opacity-40 resize-none transition"
            />
          </div>

          {/* Reminder checkbox */}
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

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--sidebar-border)]">
            <button
              type="button"
              onClick={handleClose}
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
