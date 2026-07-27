"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useGetMyTicketsQuery,
  useGetTicketByIdQuery,
  usePostUserReplyMutation,
  useCreatePublicTicketMutation,
} from "@/store/api/supportApi";
import { useGetProfileQuery } from "@/store/api/authApi";
import {
  TicketStatus,
  TicketPriority,
  TicketCategory,
  SupportTicket,
} from "@/types/support";

const STATUS_STYLES: Record<string, string> = {
  OPEN: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  IN_PROGRESS: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  WAITING_FOR_USER: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  RESOLVED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  CLOSED: "bg-neutral-500/10 text-neutral-400 border-neutral-500/20",
  ESCALATED: "bg-red-500/10 text-red-400 border-red-500/20",
};

const PRIORITY_STYLES: Record<string, string> = {
  LOW: "bg-neutral-500/10 text-neutral-400 border-neutral-500/20",
  MEDIUM: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  HIGH: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  URGENT: "bg-red-500/10 text-red-400 border-red-500/20",
};

function fmtDate(d: string) {
  if (!d) return "–";
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}
function fmtTime(d: string) {
  if (!d) return "";
  return new Date(d).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${STATUS_STYLES[status] ?? "bg-neutral-500/10 text-neutral-400 border-neutral-500/20"}`}>
      {status?.replace(/_/g, " ")}
    </span>
  );
}

function PriorityDot({ priority }: { priority: string }) {
  const colors: Record<string, string> = {
    LOW: "bg-neutral-400",
    MEDIUM: "bg-amber-400",
    HIGH: "bg-orange-500",
    URGENT: "bg-red-500",
  };
  return <span className={`inline-block w-2 h-2 rounded-full ${colors[priority] ?? "bg-neutral-400"}`} />;
}

function TicketDrawer({ ticketId, onClose }: { ticketId: string; onClose: () => void }) {
  const { data: ticket, isLoading, refetch } = useGetTicketByIdQuery(ticketId);
  const [postReply, { isLoading: isSending }] = usePostUserReplyMutation();
  const [replyText, setReplyText] = useState("");
  const [sendError, setSendError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [ticket?.messages?.length]);

  const handleSend = async () => {
    if (!replyText.trim()) return;
    setSendError(null);
    try {
      await postReply({ ticketId, message: replyText.trim() }).unwrap();
      setReplyText("");
      refetch();
    } catch (err: any) {
      setSendError(err?.data?.message ?? "Failed to send reply.");
    }
  };

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", stiffness: 280, damping: 28 }}
      className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-[var(--card-surface)] border-l border-[var(--sidebar-border)] flex flex-col shadow-2xl"
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--sidebar-border)] shrink-0">
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">Ticket Thread</span>
          {ticket && <span className="text-xs font-mono font-bold text-[var(--foreground)]">{ticket.ticketNumber}</span>}
        </div>
        <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--sidebar-active-bg)] text-[var(--color-text-muted)] hover:text-[var(--foreground)] transition-colors cursor-pointer border-0 bg-transparent">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
        </button>
      </div>

      {ticket && (
        <div className="px-5 py-3 border-b border-[var(--sidebar-border)] shrink-0 bg-[var(--background)]/50">
          <p className="text-sm font-bold text-[var(--foreground)] mb-2 leading-snug">{ticket.subject}</p>
          <div className="flex flex-wrap gap-2 items-center">
            <StatusBadge status={ticket.status} />
            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${PRIORITY_STYLES[ticket.priority] ?? ""}`}>
              <PriorityDot priority={ticket.priority} />
              {ticket.priority}
            </span>
            <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border bg-[var(--sidebar-active-bg)] text-[var(--color-text-muted)] border-[var(--sidebar-border)]">
              {ticket.category}
            </span>
            <span className="text-[10px] text-[var(--color-text-muted)]">Opened {fmtDate(ticket.createdAt)}</span>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
        {isLoading && (
          <div className="flex justify-center py-12">
            <div className="w-7 h-7 border-2 border-[var(--color-primary-300)]/20 border-t-[var(--color-primary-300)] rounded-full animate-spin" />
          </div>
        )}
        {ticket?.messages?.map((msg) => (
          <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex flex-col gap-1 ${msg.isAdmin ? "items-start" : "items-end"}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${msg.isAdmin ? "bg-[var(--background)] border border-[var(--sidebar-border)] text-[var(--foreground)] rounded-tl-none" : "bg-[var(--color-primary-300)] text-black rounded-tr-none"}`}>
              {msg.message}
            </div>
            <div className="flex items-center gap-1.5 px-1">
              <span className="text-[10px] text-[var(--color-text-muted)]">{msg.isAdmin ? "Support Team" : "You"}</span>
              <span className="text-[10px] text-[var(--color-text-muted)] opacity-60">·</span>
              <span className="text-[10px] text-[var(--color-text-muted)] opacity-60">{fmtDate(msg.createdAt)} {fmtTime(msg.createdAt)}</span>
            </div>
          </motion.div>
        ))}
        {ticket?.messages?.length === 0 && !isLoading && (
          <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
            <div className="w-12 h-12 rounded-full bg-[var(--sidebar-active-bg)] flex items-center justify-center mb-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--color-text-muted)]" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
            </div>
            <p className="text-xs text-[var(--color-text-muted)]">No messages yet.</p>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {ticket && ticket.status !== TicketStatus.CLOSED && ticket.status !== TicketStatus.RESOLVED && (
        <div className="px-4 py-4 border-t border-[var(--sidebar-border)] shrink-0 bg-[var(--background)]/50">
          {sendError && <p className="text-xs text-red-400 mb-2 px-1">{sendError}</p>}
          <div className="flex gap-2 items-end">
            <textarea
              rows={2}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder="Type your reply… (Enter to send)"
              className="flex-1 resize-none px-4 py-3 rounded-xl border border-[var(--sidebar-border)] bg-[var(--card-surface)] text-sm text-[var(--foreground)] placeholder-[var(--color-text-muted)] outline-none focus:border-[var(--color-primary-300)] transition"
            />
            <button onClick={handleSend} disabled={isSending || !replyText.trim()} className="h-11 w-11 shrink-0 flex items-center justify-center rounded-xl bg-[var(--color-primary-300)] text-black disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer border-0 transition-all hover:opacity-90">
              {isSending ? <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" /> : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4 20-7z" /></svg>}
            </button>
          </div>
        </div>
      )}
      {ticket && (ticket.status === TicketStatus.RESOLVED || ticket.status === TicketStatus.CLOSED) && (
        <div className="px-5 py-3 border-t border-[var(--sidebar-border)] shrink-0">
          <p className="text-xs text-center text-[var(--color-text-muted)]">
            This ticket is <strong>{ticket.status}</strong>. Raise a new ticket if you need further assistance.
          </p>
        </div>
      )}
    </motion.div>
  );
}

function NewTicketModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [createTicket, { isLoading }] = useCreatePublicTicketMutation();
  const { data: profileData } = useGetProfileQuery();
  const [storedEmail] = useState(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("email") || "";
  });
  const [form, setForm] = useState({
    email: "",
    subject: "",
    description: "",
    category: TicketCategory.GENERAL,
    priority: TicketPriority.MEDIUM,
  });
  const [error, setError] = useState<string | null>(null);
  const resolvedEmail = form.email || profileData?.email || storedEmail;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!resolvedEmail.trim()) {
      setError("We could not find your account email. Please refresh and try again.");
      return;
    }
    try {
      await createTicket({
        ...form,
        email: resolvedEmail.trim(),
      }).unwrap();
      onCreated();
    } catch (err: any) {
      setError(err?.data?.message ?? "Failed to create ticket. Please try again.");
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} transition={{ type: "spring", stiffness: 300, damping: 25 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-md bg-[var(--card-surface)] border border-[var(--sidebar-border)] rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--sidebar-border)]">
          <h3 className="text-base font-bold text-[var(--foreground)]">New Support Ticket</h3>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[var(--sidebar-active-bg)] text-[var(--color-text-muted)] cursor-pointer border-0 bg-transparent transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          {error && <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">{error}</div>}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Email</label>
            <input
              type="email"
              required
              value={resolvedEmail}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="name@example.com"
              className="h-10 px-3 rounded-lg border border-[var(--sidebar-border)] bg-[var(--background)] text-sm text-[var(--foreground)] outline-none focus:border-[var(--color-primary-300)] transition"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Subject</label>
            <input type="text" required placeholder="Briefly describe your issue" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="h-10 px-3 rounded-lg border border-[var(--sidebar-border)] bg-[var(--background)] text-sm text-[var(--foreground)] outline-none focus:border-[var(--color-primary-300)] transition" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as TicketCategory })} className="h-10 px-3 rounded-lg border border-[var(--sidebar-border)] bg-[var(--background)] text-sm text-[var(--foreground)] outline-none cursor-pointer">
                {Object.values(TicketCategory).map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Priority</label>
              <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as TicketPriority })} className="h-10 px-3 rounded-lg border border-[var(--sidebar-border)] bg-[var(--background)] text-sm text-[var(--foreground)] outline-none cursor-pointer">
                {Object.values(TicketPriority).map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Description</label>
            <textarea required rows={4} placeholder="Please describe your issue in detail…" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="px-3 py-2.5 rounded-lg border border-[var(--sidebar-border)] bg-[var(--background)] text-sm text-[var(--foreground)] outline-none focus:border-[var(--color-primary-300)] transition resize-none" />
          </div>
          <button type="submit" disabled={isLoading} className="h-11 w-full rounded-xl bg-[var(--color-primary-300)] text-black font-bold text-xs uppercase tracking-wider border-0 cursor-pointer disabled:opacity-50 transition-all hover:opacity-90">
            {isLoading ? "Raising Ticket…" : "Raise Ticket"}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

function TicketRow({ ticket, onClick }: { ticket: SupportTicket; onClick: () => void }) {
  return (
    <motion.tr initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="border-b border-[var(--sidebar-border)] hover:bg-[var(--sidebar-active-bg)] transition-colors cursor-pointer group" onClick={onClick}>
      <td className="px-5 py-4">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-mono text-[var(--color-text-muted)]">{ticket.ticketNumber}</span>
          <span className="text-sm font-semibold text-[var(--foreground)] group-hover:text-[var(--color-primary-300)] transition-colors line-clamp-1">{ticket.subject}</span>
        </div>
      </td>
      <td className="px-5 py-4"><StatusBadge status={ticket.status} /></td>
      <td className="px-5 py-4">
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${PRIORITY_STYLES[ticket.priority] ?? ""}`}>
          <PriorityDot priority={ticket.priority} />{ticket.priority}
        </span>
      </td>
      <td className="px-5 py-4">
        <span className="inline-flex px-2 py-0.5 rounded-full border bg-[var(--sidebar-active-bg)] border-[var(--sidebar-border)] text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">{ticket.category}</span>
      </td>
      <td className="px-5 py-4 text-xs text-[var(--color-text-muted)]">
        <div className="flex items-center gap-1.5">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
          {ticket._count?.messages ?? 0}
        </div>
      </td>
      <td className="px-5 py-4 text-xs text-[var(--color-text-muted)]">{fmtDate(ticket.createdAt)}</td>
      <td className="px-5 py-4">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-[var(--color-text-muted)] group-hover:text-[var(--color-primary-300)] transition-colors ml-auto"><path d="m9 18 6-6-6-6" /></svg>
      </td>
    </motion.tr>
  );
}

function TicketCard({ ticket, onClick }: { ticket: SupportTicket; onClick: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} onClick={onClick} className="bg-[var(--card-surface)] border border-[var(--sidebar-border)] rounded-xl p-4 cursor-pointer hover:border-[var(--color-primary-300)]/40 transition-colors">
      <div className="flex items-start justify-between gap-3 mb-2">
        <span className="text-[10px] font-mono text-[var(--color-text-muted)]">{ticket.ticketNumber}</span>
        <StatusBadge status={ticket.status} />
      </div>
      <p className="text-sm font-semibold text-[var(--foreground)] mb-3 leading-snug">{ticket.subject}</p>
      <div className="flex flex-wrap gap-2">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${PRIORITY_STYLES[ticket.priority] ?? ""}`}>
          <PriorityDot priority={ticket.priority} />{ticket.priority}
        </span>
        <span className="inline-flex px-2 py-0.5 rounded-full border bg-[var(--sidebar-active-bg)] border-[var(--sidebar-border)] text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">{ticket.category}</span>
        <span className="text-[10px] text-[var(--color-text-muted)] flex items-center gap-1">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
          {ticket._count?.messages ?? 0} msgs
        </span>
        <span className="text-[10px] text-[var(--color-text-muted)]">{fmtDate(ticket.createdAt)}</span>
      </div>
    </motion.div>
  );
}

export default function SupportDashboard() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [successBanner, setSuccessBanner] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  const { data, isLoading, isError, refetch } = useGetMyTicketsQuery({
    page,
    limit: 10,
    status: statusFilter || undefined,
    category: categoryFilter || undefined,
    search: debouncedSearch || undefined,
  });

  const tickets = data?.data ?? [];
  const pagination = data?.pagination;

  const handleCreated = useCallback(() => {
    setShowNewModal(false);
    setSuccessBanner(true);
    refetch();
    setTimeout(() => setSuccessBanner(false), 4000);
  }, [refetch]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-[var(--background)] min-h-screen text-[var(--sidebar-text)]">
      <AnimatePresence>
        {successBanner && (
          <motion.div initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -40 }} className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-2.5 px-5 py-3 rounded-full bg-neutral-900 border border-neutral-700 text-white text-sm font-semibold shadow-2xl whitespace-nowrap">
            <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            Ticket raised successfully!
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--header-text)]">Support</h1>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">Track your support tickets and chat with our team.</p>
        </motion.div>
        <motion.button initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} onClick={() => setShowNewModal(true)} className="flex items-center gap-2 h-10 px-5 rounded-xl bg-[var(--color-primary-300)] text-black font-bold text-xs uppercase tracking-wider border-0 cursor-pointer shrink-0 transition-all hover:opacity-90 shadow-sm">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
          New Ticket
        </motion.button>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-xs">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input type="text" placeholder="Search tickets…" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="w-full h-9 pl-9 pr-3 rounded-lg border border-[var(--sidebar-border)] bg-[var(--card-surface)] text-sm text-[var(--foreground)] outline-none focus:border-[var(--color-primary-300)] transition" />
        </div>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="h-9 px-3 rounded-lg border border-[var(--sidebar-border)] bg-[var(--card-surface)] text-sm text-[var(--foreground)] outline-none cursor-pointer min-w-[130px]">
          <option value="">All Statuses</option>
          {Object.values(TicketStatus).map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
        </select>
        <select value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }} className="h-9 px-3 rounded-lg border border-[var(--sidebar-border)] bg-[var(--card-surface)] text-sm text-[var(--foreground)] outline-none cursor-pointer min-w-[130px]">
          <option value="">All Categories</option>
          {Object.values(TicketCategory).map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </motion.div>

      {isLoading && <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-[var(--color-primary-300)]/20 border-t-[var(--color-primary-300)] rounded-full animate-spin" /></div>}

      {isError && <div className="bg-[var(--color-status-error-bg)] border border-[var(--color-status-error-border)] text-[var(--color-status-error)] rounded-xl p-4 text-sm">Failed to load tickets. Please try refreshing.</div>}

      {!isLoading && !isError && tickets.length === 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[var(--card-surface)] border border-[var(--sidebar-border)] rounded-2xl p-16 flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[var(--sidebar-active-bg)] flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--color-text-muted)]" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
          </div>
          <div>
            <p className="text-sm font-bold text-[var(--foreground)] mb-1">{statusFilter || categoryFilter || debouncedSearch ? "No tickets match your filters" : "No support tickets yet"}</p>
            <p className="text-xs text-[var(--color-text-muted)]">{statusFilter || categoryFilter || debouncedSearch ? "Try adjusting your filters." : "Click 'New Ticket' to raise a support request."}</p>
          </div>
          {!(statusFilter || categoryFilter || debouncedSearch) && (
            <button onClick={() => setShowNewModal(true)} className="h-9 px-5 rounded-xl bg-[var(--color-primary-300)] text-black font-bold text-xs uppercase tracking-wider border-0 cursor-pointer">Raise a Ticket</button>
          )}
        </motion.div>
      )}

      {!isLoading && !isError && tickets.length > 0 && (
        <>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="hidden md:block bg-[var(--marketplace-card-bg)] border border-[var(--sidebar-border)] rounded-xl overflow-hidden shadow-sm mb-4">
            <div className="overflow-x-auto">
              <table className="w-full whitespace-nowrap min-w-[700px]">
                <thead>
                  <tr className="border-b border-[var(--sidebar-border)] bg-[var(--background)]/50">
                    {["Ticket", "Status", "Priority", "Category", "Messages", "Opened", ""].map((h) => (
                      <th key={h} className="text-left px-5 py-3.5 text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((ticket) => <TicketRow key={ticket.id} ticket={ticket} onClick={() => setSelectedTicketId(ticket.id)} />)}
                </tbody>
              </table>
            </div>
          </motion.div>

          <div className="md:hidden flex flex-col gap-3 mb-4">
            {tickets.map((ticket) => <TicketCard key={ticket.id} ticket={ticket} onClick={() => setSelectedTicketId(ticket.id)} />)}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-[var(--color-text-muted)]">Showing {(pagination.page - 1) * pagination.limit + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}</p>
              <div className="flex items-center gap-1.5">
                <button disabled={!pagination.hasPreviousPage} onClick={() => setPage((p) => p - 1)} className="px-3 py-1.5 rounded-md text-xs font-semibold border border-[var(--sidebar-border)] bg-[var(--card-surface)] text-[var(--header-text)] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">Prev</button>
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                  <button key={p} onClick={() => setPage(p)} className={`min-w-8 h-8 px-2 rounded-md text-xs font-semibold border cursor-pointer ${p === pagination.page ? "bg-[var(--btn-cta-bg)] text-[var(--btn-cta-text)] border-[var(--btn-cta-bg)]" : "bg-[var(--card-surface)] text-[var(--header-text)] border-[var(--sidebar-border)]"}`}>{p}</button>
                ))}
                <button disabled={!pagination.hasNextPage} onClick={() => setPage((p) => p + 1)} className="px-3 py-1.5 rounded-md text-xs font-semibold border border-[var(--sidebar-border)] bg-[var(--card-surface)] text-[var(--header-text)] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">Next</button>
              </div>
            </div>
          )}
        </>
      )}

      <AnimatePresence>
        {selectedTicketId && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]" onClick={() => setSelectedTicketId(null)} />
            <TicketDrawer ticketId={selectedTicketId} onClose={() => setSelectedTicketId(null)} />
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showNewModal && <NewTicketModal onClose={() => setShowNewModal(false)} onCreated={handleCreated} />}
      </AnimatePresence>
    </div>
  );
}
