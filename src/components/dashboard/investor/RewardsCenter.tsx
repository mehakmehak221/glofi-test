"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useGetProfileQuery } from "@/store/api/authApi";
import {
  useGetUserRewardsHistoryQuery,
  useGetUserRewardsQuery,
  useValidateCouponMutation,
} from "@/store/api/rewardsApi";
import { RewardCampaign, UserReward, CouponRedemption } from "@/types/rewards";
import { useI18n } from "@/providers/LocaleProvider";

function formatMoney(value: number | string | null | undefined) {
  const num = typeof value === "string" ? Number(value) : value;
  if (num === null || num === undefined || Number.isNaN(num)) return "₹0";
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(num);
}

function formatDate(value?: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatStatus(status?: string) {
  return status ? status.replace(/_/g, " ") : "—";
}

function SectionCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-[var(--sidebar-border)] bg-[var(--card-surface)] shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-[var(--sidebar-border)]">
        <h2 className="text-base font-bold text-[var(--foreground)]">{title}</h2>
        {subtitle ? <p className="text-xs text-[var(--color-text-muted)] mt-1">{subtitle}</p> : null}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function CampaignCard({ campaign }: { campaign: RewardCampaign }) {
  const { t } = useI18n();
  return (
    <div className="rounded-xl border border-[var(--sidebar-border)] bg-[var(--background)] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-[var(--foreground)]">{campaign.name}</p>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">{campaign.description || campaign.type}</p>
        </div>
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full border ${campaign.isActive ? "border-emerald-500/20 text-emerald-400 bg-emerald-500/10" : "border-neutral-500/20 text-neutral-400 bg-neutral-500/10"}`}>
          {campaign.isActive ? t("Active") : t("Inactive")}
        </span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
        <div>
          <p className="text-[var(--color-text-muted)]">{t("Reward")}</p>
          <p className="font-semibold text-[var(--foreground)]">{formatMoney(campaign.rewardAmount ?? campaign.rewardPercentage ?? 0)}</p>
        </div>
        <div>
          <p className="text-[var(--color-text-muted)]">{t("Min investment")}</p>
          <p className="font-semibold text-[var(--foreground)]">{formatMoney(campaign.minimumInvestment ?? 0)}</p>
        </div>
      </div>
    </div>
  );
}

function RewardRow({ reward }: { reward: UserReward }) {
  const { t } = useI18n();
  return (
    <div className="rounded-xl border border-[var(--sidebar-border)] bg-[var(--background)] p-4 flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-semibold text-[var(--foreground)]">{reward.campaign?.name || t("Reward")}</p>
        <p className="text-xs text-[var(--color-text-muted)] mt-1">{t("Credited")} {formatDate(reward.creditedAt)}</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-bold text-[var(--foreground)]">{formatMoney(reward.amount)}</p>
        <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">{t(reward.status)}</span>
      </div>
    </div>
  );
}

function RedemptionRow({ redemption }: { redemption: CouponRedemption }) {
  const { t } = useI18n();
  return (
    <div className="rounded-xl border border-[var(--sidebar-border)] bg-[var(--background)] p-4 flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-semibold text-[var(--foreground)]">{redemption.coupon?.code || t("Coupon redemption")}</p>
        <p className="text-xs text-[var(--color-text-muted)] mt-1">{t("Redeemed")} {formatDate(redemption.redeemedAt)}</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-bold text-[var(--foreground)]">{formatMoney(redemption.rewardAmount)}</p>
        <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">{redemption.coupon?.type || "—"}</span>
      </div>
    </div>
  );
}

export default function RewardsCenter() {
  const { t } = useI18n();
  const { data: profileData } = useGetProfileQuery();
  const { data: rewardsData, isLoading: rewardsLoading, isError: rewardsError } = useGetUserRewardsQuery();
  const { data: historyData, isLoading: historyLoading, isError: historyError } = useGetUserRewardsHistoryQuery();
  const [validateCoupon, { isLoading: validating }] = useValidateCouponMutation();
  const [couponCode, setCouponCode] = useState("");
  const [investmentAmount, setInvestmentAmount] = useState("");
  const [assetId, setAssetId] = useState("");
  const [validationState, setValidationState] = useState<{
    isValid?: boolean;
    discountAmount?: number;
    message?: string;
    coupon?: { code?: string; type?: string; value?: number };
  } | null>(null);
  const [validationError, setValidationError] = useState("");

  const activeCampaigns = rewardsData?.activeCampaigns ?? [];
  const userRewards = rewardsData?.userRewards ?? [];
  const historyRewards = historyData?.rewards ?? [];
  const couponRedemptions = historyData?.couponRedemptions ?? [];

  const totalRewards = userRewards.reduce((sum, reward) => sum + (Number(reward.amount) || 0), 0);
  const creditedRewards = userRewards.filter((reward) => reward.status === "CREDITED").length;

  const handleValidate = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");
    setValidationState(null);

    const amount = Number(investmentAmount);
    if (!couponCode.trim() || !Number.isFinite(amount) || amount <= 0) {
      setValidationError(t("Enter a coupon code and a valid investment amount."));
      return;
    }

    try {
      const result = await validateCoupon({
        code: couponCode.trim(),
        investmentAmount: amount,
        ...(assetId.trim() ? { assetId: assetId.trim() } : {}),
      }).unwrap();
      setValidationState(result);
    } catch (err: any) {
      setValidationError(err?.data?.message || err?.message || t("Coupon validation failed."));
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-[var(--background)] min-h-screen text-[var(--sidebar-text)]">
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--header-text)]">{t("Rewards")}</h1>
        <p className="text-xs text-[var(--color-text-muted)] mt-1">
          {t("Track rewards, validate coupons, and see current promotional campaigns.")}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="rounded-2xl border border-[var(--sidebar-border)] bg-[var(--card-surface)] p-5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">{t("Active campaigns")}</p>
          <p className="mt-3 text-3xl font-black text-[var(--foreground)]">{activeCampaigns.length}</p>
        </div>
        <div className="rounded-2xl border border-[var(--sidebar-border)] bg-[var(--card-surface)] p-5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">{t("Credited rewards")}</p>
          <p className="mt-3 text-3xl font-black text-[var(--foreground)]">{creditedRewards}</p>
        </div>
        <div className="rounded-2xl border border-[var(--sidebar-border)] bg-[var(--card-surface)] p-5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">{t("Total reward value")}</p>
          <p className="mt-3 text-3xl font-black text-[var(--foreground)]">{formatMoney(totalRewards)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        <SectionCard title={t("Validate Coupon")} subtitle={t("Check if a coupon applies to an investment before checkout.")}>
          <form onSubmit={handleValidate} className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input value={couponCode} onChange={(e) => setCouponCode(e.target.value)} placeholder={t("Coupon code")} className="h-11 rounded-lg border border-[var(--sidebar-border)] bg-[var(--background)] px-4 text-sm text-[var(--foreground)] outline-none focus:border-[var(--color-primary-300)]" />
              <input value={investmentAmount} onChange={(e) => setInvestmentAmount(e.target.value)} type="number" min="1" placeholder={t("Investment amount")} className="h-11 rounded-lg border border-[var(--sidebar-border)] bg-[var(--background)] px-4 text-sm text-[var(--foreground)] outline-none focus:border-[var(--color-primary-300)]" />
            </div>
            <input value={assetId} onChange={(e) => setAssetId(e.target.value)} placeholder={t("Asset ID (optional)")} className="h-11 rounded-lg border border-[var(--sidebar-border)] bg-[var(--background)] px-4 text-sm text-[var(--foreground)] outline-none focus:border-[var(--color-primary-300)] md:col-span-2" />
            {validationError ? <div className="md:col-span-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs text-red-400">{validationError}</div> : null}
            {validationState ? (
              <div className="md:col-span-2 rounded-lg border border-[var(--sidebar-border)] bg-[var(--background)] px-4 py-3 text-xs text-[var(--foreground)]">
                <p className="font-semibold">{validationState.isValid ? t("Coupon valid") : t("Coupon invalid")}</p>
                <p className="mt-1 text-[var(--color-text-muted)]">
                  {validationState.coupon?.code ? `${validationState.coupon.code} · ${validationState.coupon.type}` : validationState.message || t("Validation completed.")}
                </p>
                {typeof validationState.discountAmount === "number" ? (
                  <p className="mt-2 font-bold">Discount: {formatMoney(validationState.discountAmount)}</p>
                ) : null}
              </div>
            ) : null}
            <button type="submit" disabled={validating} className="md:col-span-2 h-11 rounded-xl bg-[var(--color-primary-300)] text-black font-bold text-xs uppercase tracking-wider border-0 disabled:opacity-50">
              {validating ? t("Validating...") : t("Validate Coupon")}
            </button>
          </form>
        </SectionCard>

        <SectionCard title={t("Rewards Summary")} subtitle={t("Current active rewards and credits available to you.")}>
          <div className="space-y-3">
            {rewardsLoading ? (
              <div className="py-10 text-center text-sm text-[var(--color-text-muted)]">{t("Loading rewards...")}</div>
            ) : rewardsError ? (
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs text-red-400">{t("Failed to load your rewards.")}</div>
            ) : userRewards.length === 0 ? (
              <div className="rounded-lg border border-[var(--sidebar-border)] bg-[var(--background)] px-4 py-6 text-sm text-[var(--color-text-muted)]">{t("No rewards found yet.")}</div>
            ) : (
              userRewards.map((reward) => <RewardRow key={reward.id} reward={reward} />)
            )}
          </div>
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        <SectionCard title={t("Active Campaigns")} subtitle={t("Live promotional campaigns and thresholds.")}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {activeCampaigns.length === 0 ? (
              <div className="rounded-lg border border-[var(--sidebar-border)] bg-[var(--background)] px-4 py-6 text-sm text-[var(--color-text-muted)] md:col-span-2">{t("No active campaigns right now.")}</div>
            ) : (
              activeCampaigns.map((campaign) => <CampaignCard key={campaign.id} campaign={campaign} />)
            )}
          </div>
        </SectionCard>

        <SectionCard title={t("Reward History")} subtitle={t("Historical rewards and coupon redemptions.")}>
          <div className="space-y-3">
            {historyLoading ? (
              <div className="py-10 text-center text-sm text-[var(--color-text-muted)]">{t("Loading history...")}</div>
            ) : historyError ? (
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs text-red-400">{t("Failed to load reward history.")}</div>
            ) : (
              <>
                {historyRewards.map((reward) => <RewardRow key={reward.id} reward={reward} />)}
                {couponRedemptions.map((redemption) => <RedemptionRow key={redemption.id} redemption={redemption} />)}
                {historyRewards.length === 0 && couponRedemptions.length === 0 ? (
                  <div className="rounded-lg border border-[var(--sidebar-border)] bg-[var(--background)] px-4 py-6 text-sm text-[var(--color-text-muted)]">{t("Nothing to show yet.")}</div>
                ) : null}
              </>
            )}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
