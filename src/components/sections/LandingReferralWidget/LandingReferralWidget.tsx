"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const GiftIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
  </svg>
);

export default function LandingReferralWidget() {
  const router = useRouter();

  return (
    <motion.button
      onClick={() => router.push("/sign-in")}
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      className="fixed bottom-8 right-8 z-[90] bg-[#056346] text-white px-5 py-3.5 rounded-full shadow-2xl flex items-center gap-2 hover:bg-[#044c36] hover:scale-105 transition-all group"
    >
      <GiftIcon className="w-5 h-5 animate-pulse" />
      <span className="font-semibold text-[15px]">Refer & Earn</span>
    </motion.button>
  );
}
