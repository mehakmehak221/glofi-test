"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { BackArrowIcon } from "@/components/VectorImages";
import { mockInvestorActivities } from "@/data/investorActivity";

const AVATAR_COLORS = [
  "#1E88E5",
  "#E53935",
  "#43A047",
  "#FB8C00",
  "#8E24AA",
];

export default function InvestorCommunityPage() {
  const router = useRouter();

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
            className="w-12 h-12 flex items-center justify-center rounded-full border border-[var(--color-border-subtle)] bg-white/5 hover:bg-white/10 transition-all cursor-pointer group"
          >
            <BackArrowIcon className="w-5 h-5 text-[var(--foreground)] group-hover:-translate-x-1 transition-transform" />
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)] tracking-tight">
            Our Investor Community
          </h1>
        </div>

        {/* List */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col"
        >
          {mockInvestorActivities.map((activity, index) => {
            const avatarColor = AVATAR_COLORS[index % AVATAR_COLORS.length];
            return (
              <motion.div
                key={activity.id}
                variants={itemVariants}
                className="flex items-center justify-between p-5 rounded-2xl transition-all hover:bg-white/5 group border-b border-transparent hover:border-[var(--color-border-subtle)]"
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
                        invested {activity.timeAgo}
                      </span>
                    </div>
                    <span className="text-xs text-[var(--color-text-muted)] mt-1 font-montserrat font-medium">
                      {activity.assetName}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <span className="text-lg font-bold text-[var(--color-status-success)] tracking-tight">
                    ₹{activity.amount.toLocaleString("en-IN")}
                  </span>
                  <span className="text-[11px] text-[var(--color-text-muted)] mt-1 font-montserrat font-semibold uppercase tracking-wider opacity-60">
                    {activity.units} Units
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
