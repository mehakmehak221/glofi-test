'use client';

import React, { useState } from 'react';
import { CreateLeadDto } from '@/types/crm';
import { X, UserPlus, Phone, Mail, AlertCircle } from 'lucide-react';

interface CreateLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateLeadDto) => Promise<void>;
}

export const CreateLeadModal: React.FC<CreateLeadModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<CreateLeadDto>({
    name: '',
    phone: '',
    email: '',
    source: 'Website',
    priority: 'MEDIUM',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      setError('Lead name and phone number are required.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onSubmit(formData);
      setFormData({ name: '', phone: '', email: '', source: 'Website', priority: 'MEDIUM' });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create lead.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--color-bg-dark)]/70 backdrop-blur-sm font-montserrat">
      <div className="bg-[var(--form-surface)] border border-[var(--sidebar-border)] rounded-md shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--sidebar-border)]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-md bg-[var(--color-primary-300)]/10 text-[var(--color-primary-300)] flex items-center justify-center">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--foreground)]">Create New Lead</h3>
              <p className="text-xs text-[var(--sidebar-text)] opacity-60">Add a new prospective client to your pipeline</p>
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
              Full Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Jane Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-md bg-[var(--background)] border border-[var(--sidebar-border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-300)]/20 focus:border-[var(--color-primary-300)] text-[var(--foreground)] placeholder:text-[var(--sidebar-text)] placeholder:opacity-40"
            />
          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[var(--sidebar-text)] opacity-80 mb-1.5 uppercase tracking-wider">
                Phone Number <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--sidebar-text)] opacity-50" />
                <input
                  type="text"
                  required
                  placeholder="+971 50 123 4567"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-md bg-[var(--background)] border border-[var(--sidebar-border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-300)]/20 focus:border-[var(--color-primary-300)] text-[var(--foreground)] placeholder:text-[var(--sidebar-text)] placeholder:opacity-40"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--sidebar-text)] opacity-80 mb-1.5 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--sidebar-text)] opacity-50" />
                <input
                  type="email"
                  placeholder="jane@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-md bg-[var(--background)] border border-[var(--sidebar-border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-300)]/20 focus:border-[var(--color-primary-300)] text-[var(--foreground)] placeholder:text-[var(--sidebar-text)] placeholder:opacity-40"
                />
              </div>
            </div>
          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[var(--sidebar-text)] opacity-80 mb-1.5 uppercase tracking-wider">
                Lead Source
              </label>
              <select
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                className="w-full px-3 py-2.5 rounded-md bg-[var(--background)] border border-[var(--sidebar-border)] text-xs font-medium text-[var(--foreground)] focus:outline-none focus:border-[var(--color-primary-300)]"
              >
                <option value="Website">Website</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Referral">Referral</option>
                <option value="Event">Event</option>
                <option value="Direct">Direct</option>
                <option value="WhatsApp">WhatsApp</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--sidebar-text)] opacity-80 mb-1.5 uppercase tracking-wider">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value as 'HIGH' | 'MEDIUM' | 'LOW' })
                }
                className="w-full px-3 py-2.5 rounded-md bg-[var(--background)] border border-[var(--sidebar-border)] text-xs font-medium text-[var(--foreground)] focus:outline-none focus:border-[var(--color-primary-300)]"
              >
                <option value="HIGH">High Priority</option>
                <option value="MEDIUM">Medium Priority</option>
                <option value="LOW">Low Priority</option>
              </select>
            </div>
          </div>

          {/* Buttons */}
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
              {isSubmitting ? 'Creating...' : 'Create Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
