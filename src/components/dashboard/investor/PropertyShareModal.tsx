"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface PropertyShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyTitle: string;
  propertyId: string;
  showToast?: (message: string, type?: string) => void;
}

export default function PropertyShareModal({
  isOpen,
  onClose,
  propertyTitle,
  propertyId,
  showToast,
}: PropertyShareModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const getShareUrl = () => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/property?id=${propertyId}`;
    }
    return `https://www.glofiestates.com/property?id=${propertyId}`;
  };

  const shareUrl = getShareUrl();
  const shareText = `Check out this property on Glofi Estates: ${propertyTitle}\n${shareUrl}`;

  const triggerToast = (msg: string) => {
    if (showToast) {
      showToast(msg, "success");
    } else {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      triggerToast("Property link copied to clipboard!");
    } catch {
      const el = document.createElement("textarea");
      el.value = shareUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      triggerToast("Property link copied to clipboard!");
    }
  };

  const handleWhatsApp = () => {
    const encodedText = encodeURIComponent(shareText);
    window.open(`https://api.whatsapp.com/send?text=${encodedText}`, "_blank", "noopener,noreferrer");
    onClose();
  };

  const handleTelegram = () => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(`Check out this property on Glofi Estates: ${propertyTitle}`);
    window.open(`https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`, "_blank", "noopener,noreferrer");
    onClose();
  };

  const handleMoreApps = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: propertyTitle,
          text: shareText,
          url: shareUrl,
        });
        onClose();
        return;
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
      }
    }
    await handleCopyLink();
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md bg-[var(--sidebar-bg)] border border-[var(--sidebar-border)] rounded-3xl p-6 shadow-2xl z-10 overflow-hidden font-sans"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-[var(--header-text)] tracking-tight">
              Share Property
            </h3>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-[var(--card-surface)] text-[var(--color-text-muted)] hover:text-[var(--header-text)] transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Preview Card */}
          <div className="bg-[var(--card-surface)] border border-[var(--sidebar-border)] rounded-2xl p-4 mb-6 flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-semibold text-[var(--header-text)] truncate">
                {propertyTitle}
              </h4>
              <p className="text-xs text-[var(--color-text-muted)] truncate mt-0.5 font-mono">
                {shareUrl}
              </p>
            </div>
            <button
              onClick={handleCopyLink}
              title="Copy Link"
              className="w-9 h-9 rounded-xl bg-[var(--sidebar-bg)] border border-[var(--sidebar-border)] flex items-center justify-center text-[var(--sidebar-active-text)] hover:scale-105 transition-transform cursor-pointer shrink-0"
            >
              {copied ? (
                <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
              )}
            </button>
          </div>

          {/* 4 Share Tiles matching App exactly */}
          <div className="grid grid-cols-4 gap-3 text-center mb-2">
            {/* WhatsApp */}
            <button
              onClick={handleWhatsApp}
              className="flex flex-col items-center gap-2 group cursor-pointer"
            >
              <div className="w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center shadow-lg shadow-[#25D366]/20 group-hover:scale-105 transition-transform">
                <svg className="w-7 h-7 fill-white" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347z" />
                  <path d="M12 2a9.94 9.94 0 0 0-8.563 15.061L2.05 21.95l4.988-1.308A9.944 9.944 0 1 0 12 2zm0 18.083c-1.45 0-2.875-.386-4.123-1.118l-.296-.174-3.064.804.818-2.986-.192-.306A8.134 8.134 0 1 1 12 20.083z" />
                </svg>
              </div>
              <span className="text-xs font-medium text-[var(--header-text)]">WhatsApp</span>
            </button>

            {/* Telegram */}
            <button
              onClick={handleTelegram}
              className="flex flex-col items-center gap-2 group cursor-pointer"
            >
              <div className="w-14 h-14 rounded-full bg-[#0088CC] flex items-center justify-center shadow-lg shadow-[#0088CC]/20 group-hover:scale-105 transition-transform">
                <svg className="w-7 h-7 fill-white" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.25-5.54 3.69-.52.36-1 .54-1.42.53-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.24.37-.49 1.02-.74 3.99-1.74 6.66-2.89 8.01-3.45 3.81-1.59 4.6-1.87 5.12-1.88.11 0 .37.03.54.17.14.12.18.28.2.45-.02.07-.02.16-.04.29z" />
                </svg>
              </div>
              <span className="text-xs font-medium text-[var(--header-text)]">Telegram</span>
            </button>

            {/* Copy Link */}
            <button
              onClick={handleCopyLink}
              className="flex flex-col items-center gap-2 group cursor-pointer"
            >
              <div className="w-14 h-14 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform text-black">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <span className="text-xs font-medium text-[var(--header-text)]">Copy Link</span>
            </button>

            {/* More Apps */}
            <button
              onClick={handleMoreApps}
              className="flex flex-col items-center gap-2 group cursor-pointer"
            >
              <div className="w-14 h-14 rounded-full bg-[var(--card-surface)] border border-[var(--sidebar-border)] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform text-[var(--header-text)]">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
              </div>
              <span className="text-xs font-medium text-[var(--header-text)]">More Apps</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
