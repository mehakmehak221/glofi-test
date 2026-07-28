'use client';

import React, { useState, useCallback } from 'react';
import { CreateLeadDto } from '@/types/crm';
import { X, UserPlus, Phone, Mail, AlertCircle, CheckCircle2 } from 'lucide-react';

interface CreateLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateLeadDto) => Promise<void>;
}

interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
}

interface TouchedFields {
  name: boolean;
  phone: boolean;
  email: boolean;
}

// ─── Validators ────────────────────────────────────────────────────────────────

const PHONE_ALLOWED_CHARS = /[^0-9+\s\-()]/g;
const PHONE_DIGIT_COUNT = (v: string) => (v.match(/\d/g) || []).length;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateName(value: string): string | undefined {
  if (!value.trim()) return 'Full name is required.';
  if (value.trim().length < 2) return 'Name must be at least 2 characters.';
  if (value.trim().length > 80) return 'Name must be 80 characters or fewer.';
  return undefined;
}

function validatePhone(value: string): string | undefined {
  if (!value.trim()) return 'Phone number is required.';
  const digits = PHONE_DIGIT_COUNT(value);
  if (digits < 7) return 'Phone number is too short — must have at least 7 digits.';
  if (digits > 15) return 'Phone number is too long — maximum 15 digits.';
  return undefined;
}

function validateEmail(value: string): string | undefined {
  if (!value.trim()) return undefined; // optional field
  if (!EMAIL_REGEX.test(value.trim())) return 'Enter a valid email address.';
  return undefined;
}

function validateAll(data: CreateLeadDto): FormErrors {
  return {
    name: validateName(data.name),
    phone: validatePhone(data.phone),
    email: validateEmail(data.email ?? ''),
  };
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

const inputBase =
  'w-full px-3.5 py-2.5 rounded-md bg-[var(--background)] border text-sm focus:outline-none focus:ring-2 text-[var(--foreground)] placeholder:text-[var(--sidebar-text)] placeholder:opacity-40 transition-colors';

function inputClass(hasError: boolean, isTouched: boolean, value: string) {
  const hasValue = value.trim().length > 0;
  if (isTouched && hasError)
    return `${inputBase} border-rose-500/60 focus:ring-rose-500/20 focus:border-rose-500`;
  if (isTouched && !hasError && hasValue)
    return `${inputBase} border-[var(--color-primary-300)]/50 focus:ring-[var(--color-primary-300)]/20 focus:border-[var(--color-primary-300)]`;
  return `${inputBase} border-[var(--sidebar-border)] focus:ring-[var(--color-primary-300)]/20 focus:border-[var(--color-primary-300)]`;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 flex items-center gap-1 text-[11px] font-medium text-rose-400 animate-in fade-in slide-in-from-top-1 duration-150">
      <AlertCircle className="w-3 h-3 shrink-0" />
      {message}
    </p>
  );
}

function FieldSuccess({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-primary-300)] pointer-events-none">
      <CheckCircle2 className="w-4 h-4" />
    </span>
  );
}

// ─── Component ─────────────────────────────────────────────────────────────────

const INITIAL_FORM: CreateLeadDto = {
  name: '',
  phone: '',
  email: '',
  source: 'Website',
  priority: 'MEDIUM',
};

const INITIAL_TOUCHED: TouchedFields = { name: false, phone: false, email: false };

export const CreateLeadModal: React.FC<CreateLeadModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<CreateLeadDto>(INITIAL_FORM);
  const [touched, setTouched] = useState<TouchedFields>(INITIAL_TOUCHED);
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Re-validate a single field immediately on change when it has already been touched
  const handleChange = useCallback(
    (field: keyof CreateLeadDto, value: string) => {
      const next = { ...formData, [field]: value };
      setFormData(next);

      if (touched[field as keyof TouchedFields] !== undefined) {
        const allErrs = validateAll(next);
        setFieldErrors((prev) => ({ ...prev, [field]: allErrs[field as keyof FormErrors] }));
      }
    },
    [formData, touched]
  );

  const handlePhoneChange = useCallback(
    (raw: string) => {
      const sanitised = raw
        .replace(/(?!^)\+/g, '')
        .replace(PHONE_ALLOWED_CHARS, '')
        .slice(0, 20);
      handleChange('phone', sanitised);
    },
    [handleChange]
  );

  const handleBlur = useCallback(
    (field: keyof TouchedFields) => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      const allErrs = validateAll(formData);
      setFieldErrors((prev) => ({ ...prev, [field]: allErrs[field] }));
    },
    [formData]
  );

  const handleClose = () => {
    setFormData(INITIAL_FORM);
    setTouched(INITIAL_TOUCHED);
    setFieldErrors({});
    setSubmitError(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched and run full validation
    setTouched({ name: true, phone: true, email: true });
    const errors = validateAll(formData);
    setFieldErrors(errors);

    const hasErrors = Object.values(errors).some(Boolean);
    if (hasErrors) return;

    try {
      setIsSubmitting(true);
      setSubmitError(null);
      await onSubmit(formData);
      setFormData(INITIAL_FORM);
      setTouched(INITIAL_TOUCHED);
      setFieldErrors({});
      onClose();
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to create lead. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const nameValid = touched.name && !fieldErrors.name && formData.name.trim().length > 0;
  const phoneValid = touched.phone && !fieldErrors.phone && formData.phone.trim().length > 0;
  const emailValid = touched.email && !fieldErrors.email && (formData.email ?? '').trim().length > 0;

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
            type="button"
            onClick={handleClose}
            className="w-8 h-8 rounded-md text-[var(--sidebar-text)] hover:text-[var(--foreground)] hover:bg-[var(--color-primary-300)]/10 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="p-6 space-y-4">
          {/* API-level error banner */}
          {submitError && (
            <div className="p-3 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-[var(--sidebar-text)] opacity-80 mb-1.5 uppercase tracking-wider">
              Full Name <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. Jane Doe"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                onBlur={() => handleBlur('name')}
                className={inputClass(!!fieldErrors.name, touched.name, formData.name)}
                aria-invalid={touched.name && !!fieldErrors.name}
                aria-describedby="name-error"
              />
              <FieldSuccess show={nameValid} />
            </div>
            <FieldError message={touched.name ? fieldErrors.name : undefined} />
          </div>

          {/* Phone & Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Phone */}
            <div>
              <label className="block text-xs font-bold text-[var(--sidebar-text)] opacity-80 mb-1.5 uppercase tracking-wider">
                Phone Number <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--sidebar-text)] opacity-50 pointer-events-none" />
                <input
                  type="text"
                  placeholder="+971 50 123 4567"
                  value={formData.phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  onBlur={() => handleBlur('phone')}
                  className={`pl-9 pr-8 ${inputClass(!!fieldErrors.phone, touched.phone, formData.phone)}`}
                  aria-invalid={touched.phone && !!fieldErrors.phone}
                  aria-describedby="phone-error"
                />
                {phoneValid && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-primary-300)] pointer-events-none">
                    <CheckCircle2 className="w-4 h-4" />
                  </span>
                )}
              </div>
              <FieldError message={touched.phone ? fieldErrors.phone : undefined} />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-[var(--sidebar-text)] opacity-80 mb-1.5 uppercase tracking-wider">
                Email Address
                <span className="ml-1.5 text-[var(--sidebar-text)] opacity-40 font-normal normal-case tracking-normal">(optional)</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--sidebar-text)] opacity-50 pointer-events-none" />
                <input
                  type="email"
                  placeholder="jane@example.com"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  onBlur={() => handleBlur('email')}
                  className={`pl-9 pr-8 ${inputClass(!!fieldErrors.email, touched.email, formData.email ?? '')}`}
                  aria-invalid={touched.email && !!fieldErrors.email}
                  aria-describedby="email-error"
                />
                {emailValid && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-primary-300)] pointer-events-none">
                    <CheckCircle2 className="w-4 h-4" />
                  </span>
                )}
              </div>
              <FieldError message={touched.email ? fieldErrors.email : undefined} />
            </div>
          </div>

          {/* Source & Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[var(--sidebar-text)] opacity-80 mb-1.5 uppercase tracking-wider">
                Lead Source
              </label>
              <select
                value={formData.source}
                onChange={(e) => handleChange('source', e.target.value)}
                className="w-full px-3 py-2.5 rounded-md bg-[var(--background)] border border-[var(--sidebar-border)] text-xs font-medium text-[var(--foreground)] focus:outline-none focus:border-[var(--color-primary-300)] transition-colors"
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
                  handleChange('priority', e.target.value as 'HIGH' | 'MEDIUM' | 'LOW')
                }
                className="w-full px-3 py-2.5 rounded-md bg-[var(--background)] border border-[var(--sidebar-border)] text-xs font-medium text-[var(--foreground)] focus:outline-none focus:border-[var(--color-primary-300)] transition-colors"
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
              {isSubmitting ? 'Creating...' : 'Create Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
