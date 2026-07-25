"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShareIcon, CopyIcon } from "@/components/VectorImages";
import { buildShareMessage, copyToClipboard, openWhatsAppShare } from "@/utils/assetShare";

type ShareAssetModalProps = {
  isOpen: boolean;
  onClose: () => void;
  assetTitle: string;
  assetValuation: string;
  shareUrl: string | null;
  isGenerating?: boolean;
  onGenerate: (customCode?: string) => Promise<void> | void;
};

export default function ShareAssetModal({
  isOpen,
  onClose,
  assetTitle,
  assetValuation,
  shareUrl,
  isGenerating = false,
  onGenerate,
}: ShareAssetModalProps) {
  const [customCode, setCustomCode] = useState("");
  const [copyLabel, setCopyLabel] = useState("COPY LINK");
  const hasShareUrl = Boolean(shareUrl);

  useEffect(() => {
    if (!isOpen) return;
    setCustomCode("");
    setCopyLabel("COPY LINK");
  }, [isOpen, shareUrl]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    if (!shareUrl) return;
    await copyToClipboard(shareUrl);
    setCopyLabel("COPIED");
    window.setTimeout(() => setCopyLabel("COPY LINK"), 1600);
  };

  const handleWhatsApp = () => {
    if (!shareUrl) return;
    openWhatsAppShare(shareUrl, assetTitle);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.98 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-2xl rounded-2xl border border-[var(--sidebar-border)] bg-[var(--card-surface)] shadow-2xl overflow-hidden"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-start justify-between gap-4 border-b border-[var(--sidebar-border)] p-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--sidebar-text)] opacity-60">Share Asset</p>
              <h3 className="mt-2 text-xl font-bold text-[var(--foreground)] font-montserrat">{assetTitle}</h3>
              <p className="text-xs text-[var(--sidebar-text)] opacity-60 mt-1">
                Valuation: AED {Number(assetValuation || 0).toLocaleString()}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-[var(--sidebar-border)] px-3 py-2 text-xs font-bold uppercase tracking-wider text-[var(--sidebar-text)] hover:text-[var(--foreground)]"
            >
              Close
            </button>
          </div>

          <div className="p-6 space-y-5">
            <div>
              <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--sidebar-text)] opacity-60">
                Optional vanity code
              </label>
              <input
                value={customCode}
                onChange={(event) => setCustomCode(event.target.value)}
                placeholder="MY-PROMO-CODE"
                className="h-12 w-full rounded-md border border-[var(--sidebar-border)] bg-[var(--background)] px-4 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--color-primary-300)]"
              />
            </div>

            <div className="rounded-xl border border-dashed border-[var(--sidebar-border)] bg-[var(--background)] p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--sidebar-text)] opacity-60">Generated Share URL</p>
              <p className="mt-2 break-all text-sm font-medium text-[var(--foreground)]">
                {hasShareUrl ? shareUrl : "Generate a link to preview it here."}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => onGenerate(customCode.trim() || undefined)}
                disabled={isGenerating}
                className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-md bg-[var(--color-primary-300)] px-4 text-sm font-bold text-black transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <ShareIcon className="h-4 w-4" />
                {isGenerating ? "GENERATING..." : hasShareUrl ? "REGENERATE LINK" : "GENERATE LINK"}
              </button>
              <button
                type="button"
                onClick={handleCopy}
                disabled={!shareUrl}
                className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-md border border-[var(--sidebar-border)] px-4 text-sm font-bold text-[var(--foreground)] transition hover:border-[var(--color-primary-300)]/40 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <CopyIcon className="h-4 w-4" />
                {copyLabel}
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={handleWhatsApp}
                disabled={!shareUrl}
                className="h-11 w-full rounded-md border border-[#25D366]/20 bg-[#25D366]/10 text-sm font-bold text-[#25D366] transition hover:bg-[#25D366]/15 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Share on WhatsApp
              </button>
            </div>

            <div className="rounded-xl border border-[var(--sidebar-border)] bg-[var(--background)] p-4 text-xs text-[var(--sidebar-text)] opacity-70">
              {buildShareMessage({
                shareUrl: shareUrl || "",
                assetTitle,
                assetValuation,
              })}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

