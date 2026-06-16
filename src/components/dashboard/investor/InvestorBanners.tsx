"use client";

import { motion, Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import { TrendingUpIcon, SecondaryMarketplaceIcon, VerifiedIcon } from "@/components/VectorImages";
import { EarlyStarterClaimWidget } from "./EarlyStarterClaimWidget";


export function CommunityStatusBanner() {
  const router = useRouter();

  const avatars = [
    { initials: "R", color: "#00DAAF" },
    { initials: "M", color: "#FF4D4D" },
    { initials: "N", color: "#2E86DE" },
    { initials: "J", color: "#F39C12" },
  ];

  return (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => router.push("/dashboard/investor/community")}
      className="flex items-center justify-between gap-4 px-5 py-4 bg-[var(--marketplace-banner-bg)] border border-[var(--marketplace-banner-border)] rounded-2xl cursor-pointer shadow-sm mb-4 group"
    >
      {/* Left: stat */}
      <p className="text-[17px] font-black text-[var(--marketplace-banner-text-primary)] tracking-tight">
        ₹62.1 Lacs <span className="font-medium text-[var(--marketplace-banner-text-secondary)]">invested</span>
      </p>

      {/* Right: avatars + arrow */}
      <div className="flex items-center gap-3">
        <div className="flex -space-x-3">
          {avatars.map((avatar, index) => (
            <div
              key={index}
              className="w-9 h-9 rounded-full border-2 border-[var(--marketplace-banner-bg)] flex items-center justify-center text-[11px] font-black text-white shadow-sm"
              style={{ backgroundColor: avatar.color, zIndex: avatars.length - index }}
            >
              {avatar.initials}
            </div>
          ))}
        </div>
        <div className="w-8 h-8 rounded-full border border-[var(--marketplace-banner-border)] bg-[var(--marketplace-banner-arrow-bg)] flex items-center justify-center text-[var(--marketplace-banner-arrow-fg)] group-hover:bg-[var(--sidebar-active-text)] group-hover:text-white group-hover:border-[var(--sidebar-active-text)] transition-all duration-300 flex-shrink-0">
          <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </div>
      </div>
    </motion.div>
  );
}

export function FeatureBannerSmall({ icon: Icon, title, subtitle, color, onClick }) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="relative flex items-center gap-4 px-5 py-4 bg-[var(--marketplace-feature-card-bg)] border border-[var(--marketplace-feature-card-border)] rounded-2xl cursor-pointer transition-all duration-300 shadow-sm group overflow-hidden"
    >
      {/* Colored left accent */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
        style={{ backgroundColor: color }}
      />

      {/* Subtle glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
        style={{ background: `linear-gradient(135deg, ${color}08 0%, transparent 60%)` }}
      />

      {/* Icon */}
      <div
        className="relative z-10 w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
        style={{ backgroundColor: `${color}15`, color }}
      >
        <Icon className="w-5 h-5" />
      </div>

      {/* Text */}
      <div className="relative z-10 flex-1 min-w-0">
        <h3 className="text-sm font-extrabold text-[var(--marketplace-feature-card-title)] leading-tight tracking-tight truncate">{title}</h3>
        <p className="text-[11px] text-[var(--marketplace-feature-card-subtitle)] font-semibold uppercase tracking-wider mt-0.5 font-montserrat">{subtitle}</p>
      </div>

      {/* Arrow */}
      <div
        className="relative z-10 w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0"
        style={{ backgroundColor: `${color}20`, color }}
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </div>
    </motion.div>
  );
}

export function InvestorBanners() {
  const router = useRouter();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="mb-3">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <CommunityStatusBanner />
      </motion.div>

      <motion.div variants={itemVariants} className="mb-6">
        <EarlyStarterClaimWidget />
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <motion.div variants={itemVariants}>
          <FeatureBannerSmall
            icon={TrendingUpIcon}
            title="Get over 92% return"
            subtitle="within 5 years"
            color="#00DAAF"
            onClick={() => router.push("/dashboard/investor/returns-calculator")}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <FeatureBannerSmall
            icon={SecondaryMarketplaceIcon}
            title="Buy and Sell Anytime"
            subtitle="Zero lock-in period"
            color="#2E86DE"
            onClick={() => { }}
          />
        </motion.div>



        <motion.div variants={itemVariants}>
          <FeatureBannerSmall
            icon={VerifiedIcon}
            title="Only Top Properties"
            subtitle="Institutional grade"
            color="#12B76A"
            onClick={() => { }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
