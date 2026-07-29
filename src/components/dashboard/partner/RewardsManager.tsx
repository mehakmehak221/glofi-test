"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function RewardsManager() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-[var(--background)] min-h-screen text-[var(--sidebar-text)]">
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--header-text)]">Rewards</h1>
        <p className="mt-2 text-sm text-[var(--color-text-muted)]">
          Reward management tools are reserved for admin users. The partner dashboard now avoids admin-only reward APIs, so this page no longer triggers 403 errors.
        </p>

        <div className="mt-6 rounded-2xl border border-[var(--sidebar-border)] bg-[var(--card-surface)] p-5">
          <p className="text-sm font-semibold text-[var(--foreground)]">What changed</p>
          <ul className="mt-3 space-y-2 text-sm text-[var(--color-text-muted)] list-disc pl-5">
            <li>Removed partner-side calls to `admin/rewards/dashboard` and `admin/rewards`.</li>
            <li>Removed partner actions for approving, cancelling, creating, and manually issuing rewards.</li>
            <li>Kept the user reward flow intact through the investor rewards APIs.</li>
          </ul>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/dashboard/partner/overview" className="inline-flex h-10 items-center rounded-xl bg-[var(--color-primary-300)] px-4 text-sm font-bold text-black no-underline">
            Back to overview
          </Link>
          <Link href="/dashboard/investor/rewards" className="inline-flex h-10 items-center rounded-xl border border-[var(--sidebar-border)] bg-[var(--card-surface)] px-4 text-sm font-bold text-[var(--foreground)] no-underline">
            View user rewards flow
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
