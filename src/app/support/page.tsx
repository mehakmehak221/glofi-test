"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCreatePublicTicketMutation } from "@/store/api/supportApi";
import { TicketCategory, TicketPriority } from "@/types/support";
import { ChevronLeftIcon, SparkleIcon, UploadIcon } from "@/components/VectorImages";

export default function PublicSupportPage() {
  const [formData, setFormData] = useState({
    email: "",
    subject: "",
    description: "",
    category: TicketCategory.GENERAL,
    priority: TicketPriority.LOW,
  });

  const [attachmentKeysStr, setAttachmentKeysStr] = useState("");
  const [ticketNumber, setTicketNumber] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [createTicket, { isLoading }] = useCreatePublicTicketMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    try {
      const attachmentKeys = attachmentKeysStr
        ? attachmentKeysStr.split(",").map((s) => s.trim()).filter(Boolean)
        : undefined;

      const result = await createTicket({
        ...formData,
        attachmentKeys,
      }).unwrap();

      if (result?.ticketNumber) {
        setTicketNumber(result.ticketNumber);
      } else {
        setTicketNumber("SUP-SUCCESS");
      }
    } catch (err: any) {
      console.error("Failed to submit support request:", err);
      setErrorMsg(
        err?.data?.message || "Failed to submit your request. Please check your details and try again."
      );
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 theme-purple">
      <div className="w-full max-w-md space-y-8">
        
        {/* Back Link */}
        <div className="text-left">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-neutral-500 hover:text-neutral-900 dark:hover:text-white text-sm transition-colors group"
          >
            <ChevronLeftIcon className="group-hover:-translate-x-0.5 transition-transform" />
            Back to home
          </Link>
        </div>

        {/* Card Container */}
        <div className="rounded-2xl border border-[var(--sidebar-border)] bg-[var(--card-surface)] shadow-2xl p-6 sm:p-8">
          <AnimatePresence mode="wait">
            {!ticketNumber ? (
              <motion.div
                key="form-step"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Header */}
                <div>
                  <h2 className="text-2xl font-black text-[var(--foreground)] font-montserrat">Support Center</h2>
                  <p className="mt-2 text-xs text-[var(--sidebar-text)] opacity-70 leading-relaxed">
                    Have a question or facing an issue? Raise a query ticket below and our team will get back to you shortly.
                  </p>
                </div>

                {errorMsg && (
                  <div className="p-3.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold">
                    {errorMsg}
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="public-email" className="text-[10px] font-bold uppercase tracking-wider text-[var(--sidebar-text)]">
                      Your Email Address
                    </label>
                    <input
                      id="public-email"
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="h-11 px-4 rounded-lg border border-[var(--sidebar-border)] bg-[var(--background)] text-xs text-[var(--foreground)] outline-none transition focus:border-[var(--color-primary-300)]"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="public-subject" className="text-[10px] font-bold uppercase tracking-wider text-[var(--sidebar-text)]">
                      Subject
                    </label>
                    <input
                      id="public-subject"
                      type="text"
                      required
                      placeholder="KYC Verification, Deposit help, etc..."
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="h-11 px-4 rounded-lg border border-[var(--sidebar-border)] bg-[var(--background)] text-xs text-[var(--foreground)] outline-none transition focus:border-[var(--color-primary-300)]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="public-category" className="text-[10px] font-bold uppercase tracking-wider text-[var(--sidebar-text)]">
                        Category
                      </label>
                      <select
                        id="public-category"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value as TicketCategory })}
                        className="h-11 px-3 rounded-lg border border-[var(--sidebar-border)] bg-[var(--background)] text-xs text-[var(--foreground)] outline-none cursor-pointer"
                      >
                        {Object.values(TicketCategory).map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="public-priority" className="text-[10px] font-bold uppercase tracking-wider text-[var(--sidebar-text)]">
                        Priority
                      </label>
                      <select
                        id="public-priority"
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value as TicketPriority })}
                        className="h-11 px-3 rounded-lg border border-[var(--sidebar-border)] bg-[var(--background)] text-xs text-[var(--foreground)] outline-none cursor-pointer"
                      >
                        {Object.values(TicketPriority).map((priority) => (
                          <option key={priority} value={priority}>{priority}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="public-description" className="text-[10px] font-bold uppercase tracking-wider text-[var(--sidebar-text)]">
                      How can we help?
                    </label>
                    <textarea
                      id="public-description"
                      required
                      rows={5}
                      placeholder="Please share details about your query here..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="p-4 rounded-lg border border-[var(--sidebar-border)] bg-[var(--background)] text-xs text-[var(--foreground)] outline-none transition focus:border-[var(--color-primary-300)] resize-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="public-attachments" className="text-[10px] font-bold uppercase tracking-wider text-[var(--sidebar-text)]">
                      Attachments (Comma-separated S3 keys, Optional)
                    </label>
                    <input
                      id="public-attachments"
                      type="text"
                      placeholder="uploads/file1.png, uploads/file2.jpg"
                      value={attachmentKeysStr}
                      onChange={(e) => setAttachmentKeysStr(e.target.value)}
                      className="h-11 px-4 rounded-lg border border-[var(--sidebar-border)] bg-[var(--background)] text-xs text-[var(--foreground)] outline-none transition focus:border-[var(--color-primary-300)]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 mt-2 rounded-lg bg-[var(--color-primary-300)] text-black font-bold text-xs uppercase tracking-wider transition-all hover:scale-[1.01] disabled:opacity-50 border-0 cursor-pointer shadow-md"
                  >
                    {isLoading ? "Submitting Request..." : "Raise Ticket"}
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="success-step"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8 space-y-6"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400">
                  <SparkleIcon className="w-8 h-8" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-[var(--foreground)] font-montserrat">Support Request Created!</h3>
                  <p className="text-xs text-[var(--sidebar-text)] opacity-70">
                    We have successfully registered your request.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-dashed border-[var(--sidebar-border)] bg-[var(--background)]">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--sidebar-text)] opacity-60">Your Ticket Number</p>
                  <p className="mt-2 text-lg font-mono font-bold text-[var(--foreground)]">{ticketNumber}</p>
                </div>

                <p className="text-xs text-[var(--sidebar-text)] opacity-60 leading-relaxed max-w-xs mx-auto">
                  A confirmation email has been dispatched with tracking details. Our team will investigate and contact you shortly.
                </p>

                <div className="pt-4 flex flex-col gap-2">
                  <Link
                    href="/sign-in"
                    className="h-11 rounded-lg bg-[var(--color-primary-300)] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center no-underline transition hover:scale-[1.01] border-0"
                  >
                    Sign In to Portal
                  </Link>
                  <button
                    onClick={() => {
                      setTicketNumber(null);
                      setFormData({
                        email: "",
                        subject: "",
                        description: "",
                        category: TicketCategory.GENERAL,
                        priority: TicketPriority.LOW,
                      });
                      setAttachmentKeysStr("");
                    }}
                    className="h-11 rounded-lg border border-[var(--sidebar-border)] bg-transparent text-[var(--foreground)] font-bold text-xs uppercase tracking-wider transition hover:bg-[var(--background)] cursor-pointer"
                  >
                    Raise Another Ticket
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
