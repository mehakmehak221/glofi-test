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
      whileTap={{ scale: 0.995 }}
      onClick={() => router.push("/dashboard/investor/community")}
      className="flex flex-col sm:flex-row items-center justify-between gap-6 px-6 sm:px-8 py-6 bg-[var(--marketplace-banner-bg)] border border-[var(--marketplace-banner-border)] rounded-[32px] cursor-pointer shadow-2xl mb-10 backdrop-blur-xl group relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--sidebar-active-bg)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="flex flex-col md:flex-row items-center md:items-center gap-6 sm:gap-10 relative z-10 w-full sm:w-auto">
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
          <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--marketplace-banner-text-secondary)] font-bold mb-1">Total Community Depth</span>
          <h2 className="text-2xl sm:text-3xl font-black text-[var(--marketplace-banner-text-primary)] tracking-tighter">
            ₹62.1 Lacs <span className="text-[var(--marketplace-banner-text-secondary)] font-medium text-lg">invested</span>
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex -space-x-4">
            {avatars.map((avatar, index) => (
              <div
                key={index}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-[3px] border-[var(--marketplace-banner-bg)] flex items-center justify-center text-[10px] sm:text-xs font-black text-white overflow-hidden shadow-2xl transition-all duration-300 group-hover:-translate-y-1"
                style={{
                  backgroundColor: avatar.color,
                  zIndex: avatars.length - index,
                  boxShadow: `0 8px 16px -4px ${avatar.color}40`
                }}
              >
                {avatar.initials}
              </div>
            ))}
            <div
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-[3px] border-[var(--marketplace-banner-bg)] flex items-center justify-center text-[10px] sm:text-xs font-black text-white z-10 shadow-xl group-hover:-translate-y-1 transition-all duration-300"
              style={{
                backgroundColor: "var(--marketplace-banner-chip-bg)"
              }}
            >
              +12
            </div>
          </div>
          <div className="flex flex-col items-center sm:items-start">
            <span className="text-sm font-bold text-[var(--marketplace-banner-text-primary)]">Active Investors</span>
            <span className="text-[10px] text-[var(--marketplace-banner-text-secondary)] font-medium">Joined in last 24h</span>
          </div>
        </div>
      </div>

      <div className="w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center border border-[var(--marketplace-banner-border)] bg-[var(--marketplace-banner-arrow-bg)] text-[var(--marketplace-banner-arrow-fg)] group-hover:bg-[var(--marketplace-banner-text-primary)] group-hover:text-[var(--marketplace-banner-bg)] transition-all duration-500 shadow-inner overflow-hidden relative z-10">
        <svg className="w-6 h-6 transition-transform duration-500 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </div>
    </motion.div>
  );
}

export function FeatureBannerSmall({ icon: Icon, title, subtitle, color, onClick }) {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="p-8 bg-[var(--marketplace-feature-card-bg)] border border-[var(--marketplace-feature-card-border)] rounded-[32px] cursor-pointer transition-all duration-500 flex flex-col justify-between shadow-2xl backdrop-blur-xl group relative overflow-hidden min-h-[220px]"
    >
      <div
        className="absolute -right-4 -top-4 w-24 h-24 blur-[60px] rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-500"
        style={{ backgroundColor: color }}
      />

      <div className="relative z-10">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-8 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-inner"
          style={{
            backgroundColor: `${color}15`,
            color: color,
            boxShadow: `0 10px 20px -5px ${color}30`
          }}
        >
          <Icon className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-black text-[var(--marketplace-feature-card-title)] mb-2 leading-[1.1] tracking-tighter transition-all duration-500">{title}</h3>
        <p className="text-[11px] text-[var(--marketplace-feature-card-subtitle)] font-montserrat font-semibold uppercase tracking-widest group-hover:text-[var(--marketplace-feature-card-title)] transition-colors">{subtitle}</p>
      </div>

      <div className="mt-6 flex justify-end opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 relative z-10">
        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[var(--search-bg)] border border-[var(--sidebar-border)]">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </div>
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
    <div className="mb-12">
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
