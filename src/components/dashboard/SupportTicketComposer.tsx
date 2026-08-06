"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCreatePublicTicketMutation } from "@/store/api/supportApi";
import { TicketCategory, TicketPriority } from "@/types/support";
import { useI18n } from "@/providers/LocaleProvider";

type SupportTicketComposerProps = {
  title?: string;
  subtitle?: string;
  description?: string;
  defaultEmail?: string;
  compact?: boolean;
  className?: string;
};

type FieldErrors = {
  email?: string;
  subject?: string;
  description?: string;
};

function validateEmail(value: string, t: (k: string) => string): string | undefined {
  if (!value.trim()) return t("Email is required.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return t("Enter a valid email address.");
}

function validateSubject(value: string, t: (k: string) => string): string | undefined {
  if (!value.trim()) return t("Subject is required.");
  if (value.trim().length < 5) return t("Subject must be at least 5 characters.");
  if (value.trim().length > 150) return t("Subject must be 150 characters or less.");
}

function validateDescription(value: string, t: (k: string) => string): string | undefined {
  if (!value.trim()) return t("Description is required.");
  if (value.trim().length < 20) return t("Please provide at least 20 characters of detail.");
  if (value.trim().length > 2000) return t("Description must be 2000 characters or less.");
}

export default function SupportTicketComposer({
  title,
  defaultEmail = "",
  compact = false,
  className = "",
}: SupportTicketComposerProps) {
  const { t } = useI18n();
  const [createTicket, { isLoading }] = useCreatePublicTicketMutation();
  const resolvedTitle = title ? t(title) : t("Raise a Ticket");
  const [form, setForm] = useState({
    email: defaultEmail,
    subject: "",
    description: "",
    category: TicketCategory.GENERAL,
    priority: TicketPriority.MEDIUM,
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const resolvedEmail = form.email || defaultEmail;
  // resolvedTitle defined above
  const descLen = form.description.length;
  const descLimit = 2000;
  const headerPadding = compact ? "px-4 py-4 sm:px-5 sm:py-5" : "px-5 py-5 sm:px-6 sm:py-6";
  const contentPadding = compact ? "p-4 sm:p-5" : "p-5 sm:p-6";
  const fieldGap = compact ? "gap-3" : "gap-4";

  const markTouched = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field: keyof FieldErrors) => {
    markTouched(field);
    let err: string | undefined;
    if (field === "email") err = validateEmail(resolvedEmail, t);
    if (field === "subject") err = validateSubject(form.subject, t);
    if (field === "description") err = validateDescription(form.description, t);
    setFieldErrors((prev) => ({ ...prev, [field]: err }));
  };

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSubmitError(""); // Clear any API submit errors when user corrects inputs
    if (touched[field] || fieldErrors[field]) {
      let err: string | undefined;
      if (field === "email") err = validateEmail(value || defaultEmail, t);
      if (field === "subject") err = validateSubject(value, t);
      if (field === "description") err = validateDescription(value, t);
      setFieldErrors((prev) => ({ ...prev, [field]: err }));
    }
  };

  const runFullValidation = (): boolean => {
    const errors: FieldErrors = {
      email: validateEmail(resolvedEmail, t),
      subject: validateSubject(form.subject, t),
      description: validateDescription(form.description, t),
    };
    setFieldErrors(errors);
    setTouched({ email: true, subject: true, description: true });
    return !errors.email && !errors.subject && !errors.description;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    setSuccessMessage("");

    if (!runFullValidation()) return;

    try {
      const ticket = await createTicket({
        ...form,
        email: resolvedEmail.trim(),
      }).unwrap();

      setSuccessMessage(ticket?.ticketNumber ? t("Ticket {number} raised successfully.").replace("{number}", ticket.ticketNumber) : t("Ticket raised successfully."));
      setForm((prev) => ({
        ...prev,
        subject: "",
        description: "",
        category: TicketCategory.GENERAL,
        priority: TicketPriority.MEDIUM,
      }));
      setFieldErrors({});
      setTouched({});
    } catch (err: any) {
      setSubmitError(err?.data?.message ?? t("Failed to create ticket. Please try again."));
    }
  };

  return (
    <div className={`overflow-hidden rounded-md border border-[var(--sidebar-border)] bg-[var(--card-surface)] shadow-sm ${className}`}>
      <div className={`border-b border-[var(--sidebar-border)] bg-[linear-gradient(135deg,rgba(0,218,175,0.10),transparent)] ${headerPadding}`}>
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--sidebar-active-text)]">{t("Support")}</p>
        <h3 className="mt-1 text-lg font-bold text-[var(--foreground)]">{resolvedTitle}</h3>
      </div>

      <div className={contentPadding}>
        <AnimatePresence>
          {successMessage ? (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-5 flex items-center gap-3 rounded-md border border-emerald-500/20 bg-emerald-500/5 p-4 text-sm font-medium text-emerald-400 backdrop-blur-sm"
            >
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="leading-normal">{successMessage}</span>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {submitError ? (
          <div className="mb-5 flex items-center gap-3 rounded-md border border-red-500/20 bg-red-500/5 p-4 text-sm font-medium text-red-400 backdrop-blur-sm">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-red-400">
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <span className="leading-normal">{submitError}</span>
          </div>
        ) : null}

        <form onSubmit={handleSubmit} noValidate className={`grid grid-cols-1 ${fieldGap}`}>
          <div className={`grid grid-cols-1 sm:grid-cols-2 ${fieldGap}`}>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">{t("Email")}</label>
              <input
                type="email"
                value={resolvedEmail}
                onChange={(e) => handleChange("email", e.target.value)}
                onBlur={() => handleBlur("email")}
                placeholder={t("name@example.com")}
                className={`h-11 rounded-md border bg-[var(--background)] px-4 text-sm md:text-base text-[var(--foreground)] outline-none transition ${fieldErrors.email ? "border-red-500/60 focus:border-red-500" : "border-[var(--sidebar-border)] focus:border-[var(--color-primary-300)]"}`}
              />
              {fieldErrors.email ? <p className="text-[11px] text-red-400">{fieldErrors.email}</p> : null}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">{t("Subject")}</label>
              <input
                type="text"
                value={form.subject}
                onChange={(e) => handleChange("subject", e.target.value)}
                onBlur={() => handleBlur("subject")}
                placeholder={t("Short issue summary")}
                maxLength={150}
                className={`h-11 rounded-md border bg-[var(--background)] px-4 text-sm md:text-base text-[var(--foreground)] outline-none transition ${fieldErrors.subject ? "border-red-500/60 focus:border-red-500" : "border-[var(--sidebar-border)] focus:border-[var(--color-primary-300)]"}`}
              />
              {fieldErrors.subject ? <p className="text-[11px] text-red-400">{fieldErrors.subject}</p> : null}
            </div>
          </div>

          <div className={`grid grid-cols-1 sm:grid-cols-2 ${fieldGap}`}>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">{t("Category")}</label>
              <select
                value={form.category}
                onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value as TicketCategory }))}
                className="h-11 rounded-md border border-[var(--sidebar-border)] bg-[var(--background)] px-4 text-sm md:text-base text-[var(--foreground)] outline-none cursor-pointer"
              >
                {Object.values(TicketCategory).map((category) => (
                  <option key={category} value={category}>{t(category)}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">{t("Priority")}</label>
              <select
                value={form.priority}
                onChange={(e) => setForm((prev) => ({ ...prev, priority: e.target.value as TicketPriority }))}
                className="h-11 rounded-md border border-[var(--sidebar-border)] bg-[var(--background)] px-4 text-sm md:text-base text-[var(--foreground)] outline-none cursor-pointer"
              >
                {Object.values(TicketPriority).map((priority) => (
                  <option key={priority} value={priority}>{t(priority)}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">{t("Description")}</label>
              <span className={`text-[10px] tabular-nums ${descLen > descLimit * 0.9 ? "text-amber-400" : "text-[var(--color-text-muted)]"}`}>
                {descLen}/{descLimit}
              </span>
            </div>
            <textarea
              rows={compact ? 4 : 5}
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              onBlur={() => handleBlur("description")}
              placeholder={t("Describe the issue in a few lines...")}
              maxLength={descLimit}
              className={`rounded-md border bg-[var(--background)] px-4 py-3 text-sm md:text-base text-[var(--foreground)] outline-none transition resize-none ${fieldErrors.description ? "border-red-500/60 focus:border-red-500" : "border-[var(--sidebar-border)] focus:border-[var(--color-primary-300)]"}`}
            />
            {fieldErrors.description ? <p className="text-[11px] text-red-400">{fieldErrors.description}</p> : null}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex h-11 w-full items-center justify-center rounded-md bg-[var(--color-primary-300)] px-5 py-3 text-sm font-bold leading-none text-black transition hover:brightness-95 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:hover:scale-100 cursor-pointer border-0"
          >
            {isLoading ? t("Raising Ticket...") : t("Raise Ticket")}
          </button>
        </form>
      </div>
    </div>
  );
}
