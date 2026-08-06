"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { BackArrowIcon } from "@/components/VectorImages";
import { mockInvestorActivities } from "@/data/investorActivity";
import { useI18n } from "@/providers/LocaleProvider";

const AVATAR_COLORS = [
  "#1E88E5",
  "#E53935",
  "#43A047",
  "#FB8C00",
  "#8E24AA",
];

export default function InvestorCommunityPage() {
  const router = useRouter();
  const { t } = useI18n();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <div className="p-4 sm:p-8 lg:p-12 bg-[var(--background)] min-h-screen">
      <div className="w-full">
        
        <div className="flex items-center gap-6 mb-10">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-[var(--dashboard-border)] bg-[var(--card-surface)] hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-all cursor-pointer group shadow-sm flex-shrink-0"
          >
            <BackArrowIcon className="w-4 h-4 text-[var(--foreground)] group-hover:text-[var(--background)] group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)] tracking-tight">
            {t("Our Investor Community")}
          </h1>
        </div>

        {/* List */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col bg-[var(--card-surface)] border border-[var(--dashboard-border)] rounded-lg divide-y divide-[var(--dashboard-border)] overflow-hidden shadow-sm"
        >
          {mockInvestorActivities.map((activity, index) => {
            const avatarColor = AVATAR_COLORS[index % AVATAR_COLORS.length];
            return (
              <motion.div
                key={activity.id}
                variants={itemVariants}
                className="flex items-center justify-between p-5 transition-all hover:bg-[var(--color-bg-light)]/40 group"
              >
                <div className="flex items-center gap-5 flex-1">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-base shadow-xl group-hover:scale-105 transition-transform"
                    style={{ backgroundColor: avatarColor }}
                  >
                    {activity.initials}
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="font-bold text-lg text-[var(--foreground)] tracking-tight">
                        {activity.investorName}
                      </span>
                      <span className="text-xs text-[var(--color-text-muted)] font-medium opacity-60">
                        {t("invested")} {t(activity.timeAgo)}
                      </span>
                    </div>
                    <span className="text-xs text-[var(--color-text-muted)] mt-1 font-montserrat font-medium">
                      {t(activity.assetName)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <span className="text-lg font-bold text-[var(--color-status-success)] tracking-tight">
                    ₹{activity.amount.toLocaleString("en-IN")}
                  </span>
                  <span className="text-[11px] text-[var(--color-text-muted)] mt-1 font-montserrat font-semibold uppercase tracking-wider opacity-60">
                    {activity.units} {t("Units")}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
