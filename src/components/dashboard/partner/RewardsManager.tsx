"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useGetProfileQuery } from "@/store/api/authApi";
import {
  useApproveRewardMutation,
  useCancelRewardMutation,
  useCreateRewardCampaignMutation,
  useCreateRewardCouponMutation,
  useGetRewardsDashboardQuery,
  useGetRewardsLogQuery,
  useIssueManualRewardMutation,
  useUpdateRewardCampaignMutation,
} from "@/store/api/rewardsApi";
import { CouponType, RewardCampaignType } from "@/types/rewards";
import { getCookie } from "@/utils/cookieUtils";

const REWARD_STATUSES = ["PENDING", "APPROVED", "CREDITED", "CANCELLED"] as const;

function formatMoney(value: number | string | null | undefined) {
  const num = typeof value === "string" ? Number(value) : value;
  if (num === null || num === undefined || Number.isNaN(num)) return "₹0";
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(num);
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

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-[var(--sidebar-border)] bg-[var(--card-surface)] p-5">
      <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">{label}</p>
      <p className="mt-3 text-3xl font-black text-[var(--foreground)]">{value}</p>
    </div>
  );
}

function StatusPill({ status }: { status?: string }) {
  const tone =
    status === "CREDITED"
      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
      : status === "APPROVED"
        ? "border-amber-500/20 bg-amber-500/10 text-amber-400"
        : status === "CANCELLED"
          ? "border-red-500/20 bg-red-500/10 text-red-400"
          : "border-purple-500/20 bg-purple-500/10 text-purple-400";

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${tone}`}>
      {status || "—"}
    </span>
  );
}

export default function RewardsManager() {
  const [hasAuthToken, setHasAuthToken] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const token = getCookie("access_token") || localStorage.getItem("access_token");
      setHasAuthToken(Boolean(token));
      setAuthChecked(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const { data: profileData } = useGetProfileQuery(undefined, { skip: !authChecked || !hasAuthToken });
  const { data: dashboardData, isLoading: dashboardLoading, isError: dashboardError } = useGetRewardsDashboardQuery(undefined, {
    skip: !authChecked || !hasAuthToken,
  });
  const { data: logData, isLoading: logLoading, isError: logError, refetch } = useGetRewardsLogQuery(
    { page, limit: 10, status: statusFilter || undefined },
    { skip: !authChecked || !hasAuthToken }
  );

  const [createCampaign, { isLoading: creatingCampaign }] = useCreateRewardCampaignMutation();
  const [updateCampaign, { isLoading: updatingCampaign }] = useUpdateRewardCampaignMutation();
  const [createCoupon, { isLoading: creatingCoupon }] = useCreateRewardCouponMutation();
  const [approveReward, { isLoading: approvingReward }] = useApproveRewardMutation();
  const [cancelReward, { isLoading: cancellingReward }] = useCancelRewardMutation();
  const [issueManualReward, { isLoading: issuingManual }] = useIssueManualRewardMutation();

  const [campaignForm, setCampaignForm] = useState({
    name: "",
    type: "INVESTMENT_BONUS" as RewardCampaignType,
    rewardAmount: "",
    rewardPercentage: "",
    minimumInvestment: "",
    maximumReward: "",
    startDate: "",
    endDate: "",
    description: "",
    isActive: true,
  });

  const [couponForm, setCouponForm] = useState<{
    code: string;
    type: CouponType;
    value: string;
    minimumInvestment: string;
    maximumDiscount: string;
    usageLimit: string;
    expiresAt: string;
  }>({
    code: "",
    type: "FIXED",
    value: "",
    minimumInvestment: "",
    maximumDiscount: "",
    usageLimit: "",
    expiresAt: "",
  });

  const [manualForm, setManualForm] = useState({
    userId: "",
    amount: "",
    reason: "",
  });

  const [actionError, setActionError] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  const rewardLog = logData?.rewards ?? logData?.data ?? [];
  const pagination = logData?.pagination;
  const campaignPerformance = dashboardData?.campaignPerformance ?? [];

  const handleCampaignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasAuthToken) {
      setActionError("Please sign in again before creating a campaign.");
      return;
    }
    setActionError("");
    setActionMessage("");

    try {
      await createCampaign({
        name: campaignForm.name.trim(),
        type: campaignForm.type,
        ...(campaignForm.rewardAmount ? { rewardAmount: Number(campaignForm.rewardAmount) } : {}),
        ...(campaignForm.rewardPercentage ? { rewardPercentage: Number(campaignForm.rewardPercentage) } : {}),
        ...(campaignForm.minimumInvestment ? { minimumInvestment: Number(campaignForm.minimumInvestment) } : {}),
        ...(campaignForm.maximumReward ? { maximumReward: Number(campaignForm.maximumReward) } : {}),
        ...(campaignForm.startDate ? { startDate: campaignForm.startDate } : {}),
        ...(campaignForm.endDate ? { endDate: campaignForm.endDate } : {}),
        description: campaignForm.description.trim() || undefined,
        isActive: campaignForm.isActive,
      }).unwrap();
      setActionMessage("Campaign created successfully.");
      setCampaignForm({
        name: "",
        type: "INVESTMENT_BONUS",
        rewardAmount: "",
        rewardPercentage: "",
        minimumInvestment: "",
        maximumReward: "",
        startDate: "",
        endDate: "",
        description: "",
        isActive: true,
      });
    } catch (err: any) {
      setActionError(err?.data?.message || "Failed to create campaign.");
    }
  };

  const handleCouponSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasAuthToken) {
      setActionError("Please sign in again before creating a coupon.");
      return;
    }
    setActionError("");
    setActionMessage("");

    try {
      await createCoupon({
        code: couponForm.code.trim(),
        type: couponForm.type,
        value: Number(couponForm.value),
        ...(couponForm.minimumInvestment ? { minimumInvestment: Number(couponForm.minimumInvestment) } : {}),
        ...(couponForm.maximumDiscount ? { maximumDiscount: Number(couponForm.maximumDiscount) } : {}),
        ...(couponForm.usageLimit ? { usageLimit: Number(couponForm.usageLimit) } : {}),
        ...(couponForm.expiresAt ? { expiresAt: couponForm.expiresAt } : {}),
      }).unwrap();
      setActionMessage("Coupon created successfully.");
      setCouponForm({
        code: "",
        type: "FIXED",
        value: "",
        minimumInvestment: "",
        maximumDiscount: "",
        usageLimit: "",
        expiresAt: "",
      });
    } catch (err: any) {
      setActionError(err?.data?.message || "Failed to create coupon.");
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasAuthToken) {
      setActionError("Please sign in again before issuing a manual reward.");
      return;
    }
    setActionError("");
    setActionMessage("");

    try {
      await issueManualReward({
        userId: manualForm.userId.trim(),
        amount: Number(manualForm.amount),
        reason: manualForm.reason.trim(),
      }).unwrap();
      setActionMessage("Manual reward issued successfully.");
      setManualForm({ userId: "", amount: "", reason: "" });
    } catch (err: any) {
      setActionError(err?.data?.message || "Failed to issue manual reward.");
    }
  };

  const toggleCampaign = async (item: { id: string; isActive?: boolean }) => {
    if (!hasAuthToken) {
      setActionError("Please sign in again before updating campaigns.");
      return;
    }
    setActionError("");
    setActionMessage("");
    try {
      await updateCampaign({ id: item.id, isActive: !item.isActive }).unwrap();
      setActionMessage(`Campaign ${item.isActive ? "deactivated" : "activated"} successfully.`);
    } catch (err: any) {
      setActionError(err?.data?.message || "Failed to update campaign.");
    }
  };

  const handleRewardAction = async (id: string, action: "approve" | "cancel") => {
    if (!hasAuthToken) {
      setActionError("Please sign in again before approving or cancelling rewards.");
      return;
    }
    setActionError("");
    setActionMessage("");
    try {
      if (action === "approve") {
        await approveReward(id).unwrap();
      } else {
        await cancelReward(id).unwrap();
      }
      setActionMessage(`Reward ${action}d successfully.`);
      refetch();
    } catch (err: any) {
      setActionError(err?.data?.message || `Failed to ${action} reward.`);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-[var(--background)] min-h-screen text-[var(--sidebar-text)]">
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--header-text)]">Rewards Management</h1>
        <p className="text-xs text-[var(--color-text-muted)] mt-1">Manage campaigns, coupons, and reward processing.</p>
        {/* {authChecked && !hasAuthToken ? (
          <p className="text-xs text-amber-500 mt-2">No access token was found. Sign in again to load rewards data.</p>
        ) : profileData?.email ? (
          <p className="text-xs text-[var(--color-text-muted)] mt-2">Signed in as {profileData.email}</p>
        ) : null} */}
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard label="Total rewards issued" value={dashboardLoading ? "..." : formatMoney(dashboardData?.totalRewardsIssued ?? 0)} />
        <StatCard label="Wallet credits" value={dashboardLoading ? "..." : dashboardData?.totalWalletCredits ?? 0} />
        <StatCard label="Active campaigns" value={dashboardLoading ? "..." : dashboardData?.activeCampaigns ?? 0} />
      </div>

      {actionError ? <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs text-red-400">{actionError}</div> : null}
      {actionMessage ? <div className="mb-6 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-400">{actionMessage}</div> : null}
      {dashboardError ? (
        <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs text-red-400">
          Failed to load rewards dashboard. This usually means the token is missing or the backend does not allow this role on the rewards admin endpoints.
        </div>
      ) : null}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        <SectionCard title="Campaign Performance" subtitle="Overview of reward campaign impact and activation.">
          {dashboardLoading ? (
            <div className="py-8 text-sm text-[var(--color-text-muted)]">Loading dashboard...</div>
          ) : campaignPerformance.length === 0 ? (
            <div className="py-8 text-sm text-[var(--color-text-muted)]">No campaigns returned by the API.</div>
          ) : (
            <div className="space-y-3">
              {campaignPerformance.map((campaign) => (
                <div key={campaign.id} className="rounded-xl border border-[var(--sidebar-border)] bg-[var(--background)] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-[var(--foreground)]">{campaign.name}</p>
                      <p className="text-xs text-[var(--color-text-muted)] mt-1">{campaign.type}</p>
                    </div>
                    <StatusPill status={campaign.isActive ? "CREDITED" : "PENDING"} />
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="text-[var(--color-text-muted)]">Rewards count</p>
                      <p className="font-semibold text-[var(--foreground)]">{campaign.rewardsCount ?? 0}</p>
                    </div>
                    <div>
                      <p className="text-[var(--color-text-muted)]">Amount issued</p>
                      <p className="font-semibold text-[var(--foreground)]">{formatMoney(campaign.totalAmountIssued ?? 0)}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleCampaign(campaign)}
                    className="mt-4 h-9 px-4 rounded-lg border border-[var(--sidebar-border)] bg-[var(--card-surface)] text-xs font-bold uppercase tracking-wider text-[var(--foreground)] cursor-pointer hover:border-[var(--color-primary-300)]"
                  >
                    {campaign.isActive ? "Deactivate" : "Activate"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard title="Reward Log" subtitle="Approve, cancel, and review pending reward items.">
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <select
              value={statusFilter}
              onChange={(e) => {
                setPage(1);
                setStatusFilter(e.target.value);
              }}
              className="h-10 px-3 rounded-lg border border-[var(--sidebar-border)] bg-[var(--background)] text-sm text-[var(--foreground)] outline-none cursor-pointer"
            >
              <option value="">All statuses</option>
              {REWARD_STATUSES.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          <div className="space-y-3">
            {authChecked && !hasAuthToken ? (
              <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-xs text-amber-500">
                Rewards data is locked until you sign in again.
              </div>
            ) : logLoading ? (
              <div className="py-8 text-sm text-[var(--color-text-muted)]">Loading rewards log...</div>
            ) : logError ? (
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs text-red-400">Failed to load rewards log.</div>
            ) : rewardLog.length === 0 ? (
              <div className="py-8 text-sm text-[var(--color-text-muted)]">No rewards found.</div>
            ) : (
              rewardLog.map((item) => (
                <div key={item.id} className="rounded-xl border border-[var(--sidebar-border)] bg-[var(--background)] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-[var(--foreground)]">{item.user?.email || item.user?.fullName || item.id}</p>
                      <p className="text-xs text-[var(--color-text-muted)] mt-1">{item.reason || item.campaign?.name || "Reward item"}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-[var(--foreground)]">{formatMoney(item.amount)}</p>
                      <StatusPill status={item.status} />
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleRewardAction(item.id, "approve")}
                      disabled={approvingReward}
                      className="h-9 px-4 rounded-lg bg-[var(--color-primary-300)] text-black text-xs font-bold uppercase tracking-wider border-0 disabled:opacity-50"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRewardAction(item.id, "cancel")}
                      disabled={cancellingReward}
                      className="h-9 px-4 rounded-lg border border-[var(--sidebar-border)] bg-[var(--card-surface)] text-xs font-bold uppercase tracking-wider text-[var(--foreground)] disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          {pagination && pagination.totalPages > 1 ? (
            <div className="mt-4 flex items-center justify-between gap-3 text-xs text-[var(--color-text-muted)]">
              <button disabled={!pagination.hasPreviousPage} onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-3 py-1.5 rounded-md border border-[var(--sidebar-border)] bg-[var(--card-surface)] text-[var(--foreground)] disabled:opacity-40 disabled:cursor-not-allowed">
                Prev
              </button>
              <span>
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button disabled={!pagination.hasNextPage} onClick={() => setPage((p) => p + 1)} className="px-3 py-1.5 rounded-md border border-[var(--sidebar-border)] bg-[var(--card-surface)] text-[var(--foreground)] disabled:opacity-40 disabled:cursor-not-allowed">
                Next
              </button>
            </div>
          ) : null}
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        <SectionCard title="Create Campaign" subtitle="Launch a new reward campaign.">
          <form onSubmit={handleCampaignSubmit} className="space-y-3">
            <input value={campaignForm.name} onChange={(e) => setCampaignForm({ ...campaignForm, name: e.target.value })} placeholder="Campaign name" className="h-10 w-full rounded-lg border border-[var(--sidebar-border)] bg-[var(--background)] px-4 text-sm outline-none focus:border-[var(--color-primary-300)]" />
            <select value={campaignForm.type} onChange={(e) => setCampaignForm({ ...campaignForm, type: e.target.value as RewardCampaignType })} className="h-10 w-full rounded-lg border border-[var(--sidebar-border)] bg-[var(--background)] px-4 text-sm outline-none cursor-pointer">
              {["REFERRAL", "FIRST_INVESTMENT", "INVESTMENT_BONUS", "PROMOTIONAL", "MANUAL", "CASHBACK"].map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <input value={campaignForm.rewardAmount} onChange={(e) => setCampaignForm({ ...campaignForm, rewardAmount: e.target.value })} type="number" placeholder="Reward amount" className="h-10 w-full rounded-lg border border-[var(--sidebar-border)] bg-[var(--background)] px-4 text-sm outline-none focus:border-[var(--color-primary-300)]" />
            <input value={campaignForm.minimumInvestment} onChange={(e) => setCampaignForm({ ...campaignForm, minimumInvestment: e.target.value })} type="number" placeholder="Minimum investment" className="h-10 w-full rounded-lg border border-[var(--sidebar-border)] bg-[var(--background)] px-4 text-sm outline-none focus:border-[var(--color-primary-300)]" />
            <input value={campaignForm.startDate} onChange={(e) => setCampaignForm({ ...campaignForm, startDate: e.target.value })} type="datetime-local" className="h-10 w-full rounded-lg border border-[var(--sidebar-border)] bg-[var(--background)] px-4 text-sm outline-none focus:border-[var(--color-primary-300)]" />
            <input value={campaignForm.endDate} onChange={(e) => setCampaignForm({ ...campaignForm, endDate: e.target.value })} type="datetime-local" className="h-10 w-full rounded-lg border border-[var(--sidebar-border)] bg-[var(--background)] px-4 text-sm outline-none focus:border-[var(--color-primary-300)]" />
            <textarea value={campaignForm.description} onChange={(e) => setCampaignForm({ ...campaignForm, description: e.target.value })} placeholder="Description" rows={3} className="w-full rounded-lg border border-[var(--sidebar-border)] bg-[var(--background)] px-4 py-3 text-sm outline-none focus:border-[var(--color-primary-300)] resize-none" />
            <label className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
              <input type="checkbox" checked={campaignForm.isActive} onChange={(e) => setCampaignForm({ ...campaignForm, isActive: e.target.checked })} />
              Active
            </label>
            <button type="submit" disabled={creatingCampaign} className="h-10 w-full rounded-xl bg-[var(--color-primary-300)] text-black font-bold text-xs uppercase tracking-wider border-0 disabled:opacity-50">
              {creatingCampaign ? "Creating..." : "Create Campaign"}
            </button>
          </form>
        </SectionCard>

        <SectionCard title="Create Coupon" subtitle="Add a coupon code for user redemptions.">
          <form onSubmit={handleCouponSubmit} className="space-y-3">
            <input value={couponForm.code} onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value })} placeholder="Coupon code" className="h-10 w-full rounded-lg border border-[var(--sidebar-border)] bg-[var(--background)] px-4 text-sm outline-none focus:border-[var(--color-primary-300)]" />
            <select value={couponForm.type} onChange={(e) => setCouponForm({ ...couponForm, type: e.target.value as "FIXED" | "PERCENTAGE" })} className="h-10 w-full rounded-lg border border-[var(--sidebar-border)] bg-[var(--background)] px-4 text-sm outline-none cursor-pointer">
              <option value="FIXED">FIXED</option>
              <option value="PERCENTAGE">PERCENTAGE</option>
            </select>
            <input value={couponForm.value} onChange={(e) => setCouponForm({ ...couponForm, value: e.target.value })} type="number" placeholder="Coupon value" className="h-10 w-full rounded-lg border border-[var(--sidebar-border)] bg-[var(--background)] px-4 text-sm outline-none focus:border-[var(--color-primary-300)]" />
            <input value={couponForm.minimumInvestment} onChange={(e) => setCouponForm({ ...couponForm, minimumInvestment: e.target.value })} type="number" placeholder="Minimum investment" className="h-10 w-full rounded-lg border border-[var(--sidebar-border)] bg-[var(--background)] px-4 text-sm outline-none focus:border-[var(--color-primary-300)]" />
            <input value={couponForm.maximumDiscount} onChange={(e) => setCouponForm({ ...couponForm, maximumDiscount: e.target.value })} type="number" placeholder="Maximum discount" className="h-10 w-full rounded-lg border border-[var(--sidebar-border)] bg-[var(--background)] px-4 text-sm outline-none focus:border-[var(--color-primary-300)]" />
            <input value={couponForm.usageLimit} onChange={(e) => setCouponForm({ ...couponForm, usageLimit: e.target.value })} type="number" placeholder="Usage limit" className="h-10 w-full rounded-lg border border-[var(--sidebar-border)] bg-[var(--background)] px-4 text-sm outline-none focus:border-[var(--color-primary-300)]" />
            <input value={couponForm.expiresAt} onChange={(e) => setCouponForm({ ...couponForm, expiresAt: e.target.value })} type="datetime-local" className="h-10 w-full rounded-lg border border-[var(--sidebar-border)] bg-[var(--background)] px-4 text-sm outline-none focus:border-[var(--color-primary-300)]" />
            <button type="submit" disabled={creatingCoupon} className="h-10 w-full rounded-xl bg-[var(--color-primary-300)] text-black font-bold text-xs uppercase tracking-wider border-0 disabled:opacity-50">
              {creatingCoupon ? "Creating..." : "Create Coupon"}
            </button>
          </form>
        </SectionCard>

        <SectionCard title="Manual Reward" subtitle="Issue a wallet credit manually.">
          <form onSubmit={handleManualSubmit} className="space-y-3">
            <input value={manualForm.userId} onChange={(e) => setManualForm({ ...manualForm, userId: e.target.value })} placeholder="User ID" className="h-10 w-full rounded-lg border border-[var(--sidebar-border)] bg-[var(--background)] px-4 text-sm outline-none focus:border-[var(--color-primary-300)]" />
            <input value={manualForm.amount} onChange={(e) => setManualForm({ ...manualForm, amount: e.target.value })} type="number" placeholder="Amount" className="h-10 w-full rounded-lg border border-[var(--sidebar-border)] bg-[var(--background)] px-4 text-sm outline-none focus:border-[var(--color-primary-300)]" />
            <textarea value={manualForm.reason} onChange={(e) => setManualForm({ ...manualForm, reason: e.target.value })} placeholder="Reason" rows={4} className="w-full rounded-lg border border-[var(--sidebar-border)] bg-[var(--background)] px-4 py-3 text-sm outline-none focus:border-[var(--color-primary-300)] resize-none" />
            <button type="submit" disabled={issuingManual} className="h-10 w-full rounded-xl bg-[var(--color-primary-300)] text-black font-bold text-xs uppercase tracking-wider border-0 disabled:opacity-50">
              {issuingManual ? "Issuing..." : "Issue Reward"}
            </button>
          </form>
        </SectionCard>
      </div>
    </div>
  );
}
