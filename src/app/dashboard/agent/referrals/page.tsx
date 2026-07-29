"use client";

import type { ComponentType } from "react";
import { useMemo, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShareIcon,
  CopyIcon,
  LinkIcon,
  ChartLineIcon,
  DollarIcon,
  UserGroupIcon,
  SparkleIcon,
  LoadingSpinner,
  PropertyIcon,
  GuideIcon,
} from "@/components/VectorImages";
import { useGetAssetsQuery } from "@/store/api/assetApi";
import {
  useGenerateAssetShareLinkMutation,
  useGetSharedAssetsQuery,
  useGetAgentAssetShareReportQuery,
  useGetReferralLinksQuery,
  useCreateReferralLinkMutation,
  useUpdateReferralLinkMutation,
  useDeleteReferralLinkMutation,
} from "@/store/api/agentApi";
import ShareAssetModal from "@/components/dashboard/asset-share/ShareAssetModal";
import { copyToClipboard } from "@/utils/assetShare";

const formatCurrency = (value: number) => `AED ${value.toLocaleString("en-US")}`;

function MetricCard({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  hint: string;
  icon: ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-2xl border border-[var(--sidebar-border)] bg-[var(--card-surface)] p-5">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--sidebar-text)] opacity-60">{label}</p>
        <span className="rounded-lg bg-[var(--sidebar-active-bg)] p-2 text-[var(--sidebar-active-text)]">
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-5 text-3xl font-bold text-[var(--foreground)] font-montserrat">{value}</p>
      <p className="mt-2 text-xs font-medium text-[var(--sidebar-text)] opacity-60">{hint}</p>
    </div>
  );
}

export default function AgentReferralsPage() {
  const [activeTab, setActiveTab] = useState<"asset" | "campaign">("asset");

  // Asset Sharing States
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<any | null>(null);
  const [selectedShareUrl, setSelectedShareUrl] = useState<string | null>(null);
  const [reportAssetId, setReportAssetId] = useState<string | null>(null);

  // Custom Referral Link States
  const [createDestUrl, setCreateDestUrl] = useState("");
  const [createCustomCode, setCreateCustomCode] = useState("");
  const [createError, setCreateError] = useState("");
  const [createSuccess, setCreateSuccess] = useState("");

  // Edit Referral Modal States
  const [editingLink, setEditingLink] = useState<any | null>(null);
  const [editDestUrl, setEditDestUrl] = useState("");
  const [editIsActive, setEditIsActive] = useState(true);
  const [editError, setEditError] = useState("");

  const { data: assetsData, isLoading: assetsLoading } = useGetAssetsQuery({
    status: "LIVE",
    limit: 12,
    page: 1,
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const { data: sharedAssets, isLoading: sharedLoading } = useGetSharedAssetsQuery();
  const [generateShareLink, { isLoading: isGenerating }] = useGenerateAssetShareLinkMutation();

  // Custom Referral Links RTK Hooks
  const { data: referralLinks, isLoading: referralLinksLoading } = useGetReferralLinksQuery();
  const [createReferralLink, { isLoading: isCreatingLink }] = useCreateReferralLinkMutation();
  const [updateReferralLink, { isLoading: isUpdatingLink }] = useUpdateReferralLinkMutation();
  const [deleteReferralLink] = useDeleteReferralLinkMutation();

  const liveAssets = assetsData?.data || [];
  const sharedList = useMemo(() => sharedAssets || [], [sharedAssets]);
  const customLinksList = useMemo(() => referralLinks || [], [referralLinks]);

  const selectedReportAssetId = reportAssetId ?? sharedList[0]?.assetId ?? null;

  const {
    data: shareReport,
    isLoading: reportLoading,
    isError: reportIsError,
    error: reportError,
  } = useGetAgentAssetShareReportQuery(selectedReportAssetId || "", {
    skip: !selectedReportAssetId,
  });

  const report404 = Boolean(reportIsError && (reportError as { status?: number } | undefined)?.status === 404);

  // Unified Overview metrics
  const summary = useMemo(() => {
    const assetTotals = sharedList.reduce(
      (acc, item) => {
        const stats = item.stats;
        acc.clicks += stats?.totalClicks || 0;
        acc.registrations += stats?.registeredUsersCount || 0;
        acc.volume += stats?.totalInvestmentAmount || 0;
        return acc;
      },
      { clicks: 0, registrations: 0, volume: 0 }
    );

    const customTotals = customLinksList.reduce(
      (acc, item) => {
        const stats = item.stats;
        acc.clicks += stats?.totalClicks || 0;
        acc.registrations += stats?.registeredUsersCount || 0;
        acc.volume += stats?.totalInvestmentAmount || 0;
        return acc;
      },
      { clicks: 0, registrations: 0, volume: 0 }
    );

    return [
      {
        label: "Total Links",
        value: sharedList.length + customLinksList.length,
        hint: `${sharedList.length} asset links, ${customLinksList.length} campaign links`,
        icon: PropertyIcon,
      },
      {
        label: "Total Clicks",
        value: assetTotals.clicks + customTotals.clicks,
        hint: "Total visitors across all referral links",
        icon: LinkIcon,
      },
      {
        label: "Registrations",
        value: assetTotals.registrations + customTotals.registrations,
        hint: "Signed up investors via your links",
        icon: UserGroupIcon,
      },
      {
        label: "Total Investments",
        value: formatCurrency(assetTotals.volume + customTotals.volume),
        hint: "Total funds invested through referrals",
        icon: DollarIcon,
      },
    ];
  }, [sharedList, customLinksList]);

  const openShareModal = (asset: any) => {
    const existing = sharedList.find((item) => String(item.assetId) === String(asset.id));
    setSelectedAsset(asset);
    setSelectedShareUrl(existing?.shareUrl ?? null);
    setShareModalOpen(true);
  };

  const handleGenerateShareLink = async (customCode?: string) => {
    if (!selectedAsset?.id) return;
    const response = await generateShareLink({
      assetId: selectedAsset.id,
      body: customCode ? { customCode } : undefined,
    }).unwrap();
    setSelectedShareUrl(response.shareUrl);
  };

  const handleCopy = async (url: string, id: string) => {
    await copyToClipboard(url);
    setCopiedId(id);
    window.setTimeout(() => setCopiedId((current) => (current === id ? null : current)), 1500);
  };

  // Custom Campaign Links handlers
  const handleCreateCustomLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError("");
    setCreateSuccess("");

    if (!createDestUrl) {
      setCreateError("Destination URL is required.");
      return;
    }

    try {
      const response = await createReferralLink({
        destinationUrl: createDestUrl.trim(),
        customCode: createCustomCode.trim() || undefined,
      }).unwrap();

      setCreateSuccess(`Referral link created successfully! Code: ${response.code}`);
      setCreateDestUrl("");
      setCreateCustomCode("");
    } catch (err: any) {
      setCreateError(err.data?.message || err.message || "Failed to create referral link.");
    }
  };

  const handleToggleActive = async (link: any) => {
    try {
      await updateReferralLink({
        id: link.id,
        isActive: !link.isActive,
      }).unwrap();
    } catch (err: any) {
      console.error("Failed to toggle referral link status", err);
    }
  };

  const handleOpenEditModal = (link: any) => {
    setEditingLink(link);
    setEditDestUrl(link.destinationUrl);
    setEditIsActive(link.isActive);
    setEditError("");
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditError("");
    if (!editingLink) return;

    try {
      await updateReferralLink({
        id: editingLink.id,
        destinationUrl: editDestUrl.trim(),
        isActive: editIsActive,
      }).unwrap();
      setEditingLink(null);
    } catch (err: any) {
      setEditError(err.data?.message || err.message || "Failed to update referral link.");
    }
  };

  const handleDeleteLink = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this referral link?")) return;
    try {
      await deleteReferralLink(id).unwrap();
    } catch (err: any) {
      alert(err.data?.message || err.message || "Failed to delete referral link.");
    }
  };

  if (assetsLoading || sharedLoading || referralLinksLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="flex items-center gap-3 text-[var(--foreground)] opacity-60 font-montserrat">
          <LoadingSpinner />
          Loading referrals dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen max-w-[1400px] p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-col gap-3"
      >
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--sidebar-text)] opacity-60">
          Agent Panel
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)] font-montserrat">
          Referrals & Marketing
        </h1>
        <p className="max-w-3xl text-sm text-[var(--sidebar-text)] opacity-60">
          Generate unique referral codes and custom destination links. Track your campaign conversions, clicks, registrations, and investor activities in real time.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-8">
        {summary.map((item) => (
          <MetricCard key={item.label} {...item} />
        ))}
      </div>

      {/* Tabs Switcher */}
      <div className="mb-6 flex border-b border-[var(--sidebar-border)]">
        <button
          onClick={() => setActiveTab("asset")}
          className={`px-6 pb-4 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${
            activeTab === "asset"
              ? "border-[var(--color-primary-300)] text-[var(--color-primary-300)]"
              : "border-transparent text-[var(--sidebar-text)] opacity-60 hover:opacity-100"
          }`}
        >
          Asset-Specific Links
        </button>
        <button
          onClick={() => setActiveTab("campaign")}
          className={`px-6 pb-4 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${
            activeTab === "campaign"
              ? "border-[var(--color-primary-300)] text-[var(--color-primary-300)]"
              : "border-transparent text-[var(--sidebar-text)] opacity-60 hover:opacity-100"
          }`}
        >
          Custom Campaign Links
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "asset" ? (
          <motion.div
            key="asset-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 gap-8 xl:grid-cols-[1.25fr_0.95fr]"
          >
            <section className="rounded-2xl border border-[var(--sidebar-border)] bg-[var(--card-surface)] p-6">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--sidebar-text)] opacity-60">Live Assets</p>
                  <h2 className="mt-2 text-xl font-bold text-[var(--foreground)] font-montserrat">Shareable inventory</h2>
                </div>
                <span className="rounded-full border border-[var(--color-primary-300)]/20 bg-[var(--color-primary-300)]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-primary-300)]">
                  {liveAssets.length} live
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 2xl:grid-cols-1">
                {liveAssets.map((asset: any) => {
                  const existing = sharedList.find((item) => String(item.assetId) === String(asset.id));
                  const image = asset.images?.[0];

                  return (
                    <motion.div
                      key={asset.id}
                      whileHover={{ y: -2 }}
                      className="overflow-hidden rounded-2xl border border-[var(--sidebar-border)] bg-[var(--background)]/70"
                    >
                      <div className="relative h-40 w-full bg-black/10">
                        {image ? (
                          <Image
                            src={image.startsWith("http") ? image : `/${image.replace(/^\/+/, "")}`}
                            alt={asset.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <PropertyIcon className="h-12 w-12 text-[var(--sidebar-text)] opacity-30" />
                          </div>
                        )}
                      </div>

                      <div className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-base font-bold text-[var(--foreground)] font-montserrat">{asset.title}</p>
                            <p className="mt-1 text-xs text-[var(--sidebar-text)] opacity-60">
                              {asset.location || "Location unavailable"}
                            </p>
                          </div>
                          <span className="rounded-full bg-[var(--sidebar-active-bg)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--sidebar-active-text)] whitespace-nowrap">
                            {asset.category || "Asset"}
                          </span>
                        </div>

                        <div className="mt-4 flex items-center justify-between text-xs text-[var(--sidebar-text)] opacity-60">
                          <span>Valuation</span>
                          <span className="font-bold text-[var(--foreground)]">
                            {formatCurrency(Number(asset.valuation || 0))}
                          </span>
                        </div>

                        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                          <button
                            type="button"
                            onClick={() => openShareModal(asset)}
                            className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-md bg-[var(--color-primary-300)] px-3 text-xs font-bold leading-none text-black transition hover:scale-[1.01]"
                          >
                            <ShareIcon className="h-4 w-4" />
                            {existing ? "Open Share" : "Generate"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setReportAssetId(String(asset.id))}
                            className="inline-flex min-h-11 items-center justify-center rounded-md border border-[var(--sidebar-border)] px-3 text-xs font-bold leading-none text-[var(--foreground)] transition hover:border-[var(--color-primary-300)]/40"
                          >
                            Inspect Report
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </section>

            <section className="space-y-8">
              <div className="rounded-2xl border border-[var(--sidebar-border)] bg-[var(--card-surface)] p-6">
                <div className="mb-6 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--sidebar-text)] opacity-60">Share Activity</p>
                    <h2 className="mt-2 text-xl font-bold text-[var(--foreground)] font-montserrat">Shared assets</h2>
                  </div>
                  <GuideIcon className="h-5 w-5 text-[var(--sidebar-text)] opacity-50" />
                </div>

                {sharedList.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-[var(--sidebar-border)] bg-[var(--background)]/60 p-6 text-sm text-[var(--sidebar-text)] opacity-60">
                    No share links yet. Pick a live asset and generate your first link.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {sharedList.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setReportAssetId(item.assetId)}
                        className={`w-full rounded-2xl border p-4 text-left transition ${
                          String(selectedReportAssetId) === String(item.assetId)
                            ? "border-[var(--color-primary-300)]/30 bg-[var(--color-primary-300)]/8"
                            : "border-[var(--sidebar-border)] bg-[var(--background)]/70 hover:border-[var(--color-primary-300)]/20"
                        }`}
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-[var(--foreground)] font-montserrat">
                              {item.asset?.title || "Untitled asset"}
                            </p>
                            <p className="mt-1 text-[11px] text-[var(--sidebar-text)] opacity-60">
                              {item.code} • {new Date(item.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                            <span className="rounded-full bg-[var(--sidebar-active-bg)] px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--sidebar-active-text)] whitespace-nowrap">
                              {item.stats?.totalClicks || 0} clicks
                            </span>
                            <span className="rounded-full bg-[var(--sidebar-active-bg)] px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--sidebar-active-text)] whitespace-nowrap">
                              {item.stats?.investmentsCount || 0} invests
                            </span>
                          </div>
                        </div>

                        <div className="mt-3 flex flex-col gap-2">
                          <div className="min-w-0 rounded-lg border border-[var(--sidebar-border)] bg-[var(--background)] px-3 py-2 text-xs text-[var(--sidebar-text)] opacity-70">
                            <span className="block truncate">{item.shareUrl}</span>
                          </div>
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              handleCopy(item.shareUrl, item.id);
                            }}
                            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-[var(--sidebar-border)] px-4 text-xs font-bold uppercase tracking-wider text-[var(--foreground)] sm:w-auto sm:self-end"
                          >
                            <CopyIcon className="h-4 w-4" />
                            {copiedId === item.id ? "Copied" : "Copy"}
                          </button>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-[var(--sidebar-border)] bg-[var(--card-surface)] p-6">
                <div className="mb-6 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--sidebar-text)] opacity-60">Performance</p>
                    <h2 className="mt-2 text-xl font-bold text-[var(--foreground)] font-montserrat">Asset report</h2>
                  </div>
                  <ChartLineIcon className="h-5 w-5 text-[var(--sidebar-text)] opacity-50" />
                </div>

                {!selectedReportAssetId ? (
                  <div className="rounded-2xl border border-dashed border-[var(--sidebar-border)] bg-[var(--background)]/60 p-6 text-sm text-[var(--sidebar-text)] opacity-60">
                    Select a shared asset to view its report.
                  </div>
                ) : reportLoading ? (
                  <div className="flex items-center gap-3 text-sm text-[var(--sidebar-text)] opacity-60">
                    <LoadingSpinner />
                    Loading report...
                  </div>
                ) : report404 ? (
                  <div className="rounded-2xl border border-dashed border-[var(--sidebar-border)] bg-[var(--background)]/60 p-6 text-sm text-[var(--sidebar-text)] opacity-60">
                    No share links yet. Click Share to get started.
                  </div>
                ) : (
                  <div className="space-y-5">
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: "Clicks", value: shareReport?.summary.totalClicks || 0 },
                        { label: "Registrations", value: shareReport?.summary.totalRegistrations || 0 },
                        { label: "Investments", value: shareReport?.summary.totalInvestments || 0 },
                        { label: "Volume", value: formatCurrency(shareReport?.summary.totalInvestmentAmount || 0) },
                      ].map((item) => (
                        <div key={item.label} className="rounded-xl border border-[var(--sidebar-border)] bg-[var(--background)] p-4">
                          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--sidebar-text)] opacity-60">{item.label}</p>
                          <p className="mt-3 text-2xl font-bold text-[var(--foreground)] font-montserrat">{item.value}</p>
                        </div>
                      ))}
                    </div>

                    <div className="rounded-xl border border-[var(--sidebar-border)] bg-[var(--background)] p-4">
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--sidebar-text)] opacity-60">Conversion Rate</p>
                      <p className="mt-3 text-2xl font-bold text-[var(--color-primary-300)] font-montserrat">
                        {shareReport?.summary.conversionRate || 0}%
                      </p>
                    </div>

                    <div className="space-y-3">
                      {(shareReport?.links || []).map((link) => (
                        <div key={link.id} className="rounded-xl border border-[var(--sidebar-border)] bg-[var(--background)] p-4">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="text-sm font-bold text-[var(--foreground)] font-montserrat">{link.code}</p>
                              <p className="mt-1 text-xs text-[var(--sidebar-text)] opacity-60 break-all">{link.shareUrl}</p>
                            </div>
                            <span className="rounded-full bg-[var(--sidebar-active-bg)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--sidebar-active-text)] whitespace-nowrap">
                              {link.stats.totalClicks} clicks
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          </motion.div>
        ) : (
          <motion.div
            key="campaign-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Create Custom Link Form */}
            <div className="rounded-2xl border border-[var(--sidebar-border)] bg-[var(--card-surface)] p-6">
              <h2 className="text-xl font-bold text-[var(--foreground)] font-montserrat mb-4">Create Custom Campaign Referral Link</h2>
              <form onSubmit={handleCreateCustomLink} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--sidebar-text)] opacity-60 mb-2">Destination URL *</label>
                    <input
                      type="url"
                      placeholder="e.g. https://glofi.com/properties/dubai-skyline"
                      value={createDestUrl}
                      onChange={(e) => setCreateDestUrl(e.target.value)}
                      className="w-full rounded-lg border border-[var(--sidebar-border)] bg-[var(--background)] p-3 text-sm text-[var(--foreground)] focus:border-[var(--color-primary-300)] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--sidebar-text)] opacity-60 mb-2">Custom Code (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. MYDUBAI2026"
                      value={createCustomCode}
                      onChange={(e) => setCreateCustomCode(e.target.value)}
                      className="w-full rounded-lg border border-[var(--sidebar-border)] bg-[var(--background)] p-3 text-sm text-[var(--foreground)] focus:border-[var(--color-primary-300)] focus:outline-none"
                    />
                  </div>
                </div>

                {createError && <p className="text-xs font-medium text-red-500">{createError}</p>}
                {createSuccess && <p className="text-xs font-medium text-green-500">{createSuccess}</p>}

                <button
                  type="submit"
                  disabled={isCreatingLink}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[var(--color-primary-300)] px-6 text-xs font-bold uppercase tracking-wider text-black transition hover:scale-[1.01] disabled:opacity-50"
                >
                  {isCreatingLink ? <LoadingSpinner /> : "Generate Referral Link"}
                </button>
              </form>
            </div>

            {/* Custom Links List */}
            <div className="rounded-2xl border border-[var(--sidebar-border)] bg-[var(--card-surface)] p-6">
              <h2 className="text-xl font-bold text-[var(--foreground)] font-montserrat mb-6">Your Campaign Links</h2>

              {customLinksList.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[var(--sidebar-border)] bg-[var(--background)]/60 p-6 text-sm text-[var(--sidebar-text)] opacity-60 text-center">
                  No custom campaign referral links generated yet. Use the form above to generate your first link!
                </div>
              ) : (
                <div className="space-y-4">
                  {customLinksList.map((link) => {
                    const stats = link.stats || {
                      totalClicks: 0,
                      leadsCount: 0,
                      registeredUsersCount: 0,
                      kycCompletedCount: 0,
                      investmentsCount: 0,
                      totalInvestmentAmount: 0,
                      conversionRate: 0,
                    };

                    const referralUrl = `https://glofi.com/?ref=${link.code}`;

                    return (
                      <div
                        key={link.id}
                        className="rounded-2xl border border-[var(--sidebar-border)] bg-[var(--background)]/70 p-5 space-y-4"
                      >
                        {/* Header info */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-3">
                              <span className="text-lg font-bold text-[var(--foreground)] font-mono">{link.code}</span>
                              <span
                                className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                                  link.isActive
                                    ? "bg-green-500/10 text-green-500 border border-green-500/20"
                                    : "bg-red-500/10 text-red-500 border border-red-500/20"
                                }`}
                              >
                                {link.isActive ? "Active" : "Inactive"}
                              </span>
                            </div>
                            <p className="mt-1 text-xs text-[var(--sidebar-text)] opacity-60 truncate max-w-xl">
                              Destination: <a href={link.destinationUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-[var(--color-primary-300)]">{link.destinationUrl}</a>
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleCopy(referralUrl, link.id)}
                              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md border border-[var(--sidebar-border)] px-3 text-xs font-semibold text-[var(--foreground)] hover:border-[var(--color-primary-300)]/40 transition"
                            >
                              <CopyIcon className="h-3.5 w-3.5" />
                              {copiedId === link.id ? "Copied" : "Copy Link"}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOpenEditModal(link)}
                              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md border border-[var(--sidebar-border)] px-3 text-xs font-semibold text-[var(--foreground)] hover:border-[var(--color-primary-300)]/40 transition"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleToggleActive(link)}
                              className={`inline-flex h-9 items-center justify-center px-3 text-xs font-semibold rounded-md border transition ${
                                link.isActive
                                  ? "border-red-500/20 text-red-500 hover:bg-red-500/5"
                                  : "border-green-500/20 text-green-500 hover:bg-green-500/5"
                              }`}
                            >
                              {link.isActive ? "Deactivate" : "Activate"}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteLink(link.id)}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-red-500/20 text-red-500 hover:bg-red-500/5 transition"
                            >
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>

                        {/* Real-time Stats Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 pt-3 border-t border-[var(--sidebar-border)]">
                          <div className="rounded-xl border border-[var(--sidebar-border)] bg-[var(--card-surface)]/40 p-3">
                            <p className="text-[9px] font-bold uppercase tracking-wider text-[var(--sidebar-text)] opacity-60">Clicks</p>
                            <p className="mt-1 text-lg font-bold text-[var(--foreground)] font-montserrat">{stats.totalClicks}</p>
                          </div>
                          <div className="rounded-xl border border-[var(--sidebar-border)] bg-[var(--card-surface)]/40 p-3">
                            <p className="text-[9px] font-bold uppercase tracking-wider text-[var(--sidebar-text)] opacity-60">Leads</p>
                            <p className="mt-1 text-lg font-bold text-[var(--foreground)] font-montserrat">{stats.leadsCount}</p>
                          </div>
                          <div className="rounded-xl border border-[var(--sidebar-border)] bg-[var(--card-surface)]/40 p-3">
                            <p className="text-[9px] font-bold uppercase tracking-wider text-[var(--sidebar-text)] opacity-60">Signups</p>
                            <p className="mt-1 text-lg font-bold text-[var(--foreground)] font-montserrat">{stats.registeredUsersCount}</p>
                          </div>
                          <div className="rounded-xl border border-[var(--sidebar-border)] bg-[var(--card-surface)]/40 p-3">
                            <p className="text-[9px] font-bold uppercase tracking-wider text-[var(--sidebar-text)] opacity-60">KYC</p>
                            <p className="mt-1 text-lg font-bold text-[var(--foreground)] font-montserrat">{stats.kycCompletedCount}</p>
                          </div>
                          <div className="rounded-xl border border-[var(--sidebar-border)] bg-[var(--card-surface)]/40 p-3">
                            <p className="text-[9px] font-bold uppercase tracking-wider text-[var(--sidebar-text)] opacity-60">Invests</p>
                            <p className="mt-1 text-lg font-bold text-[var(--foreground)] font-montserrat">{stats.investmentsCount}</p>
                          </div>
                          <div className="rounded-xl border border-[var(--sidebar-border)] bg-[var(--card-surface)]/40 p-3 sm:col-span-2">
                            <p className="text-[9px] font-bold uppercase tracking-wider text-[var(--sidebar-text)] opacity-60">Volume</p>
                            <p className="mt-1 text-base font-bold text-[var(--color-primary-300)] font-montserrat truncate">
                              {formatCurrency(stats.totalInvestmentAmount)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-[var(--sidebar-text)] opacity-60">
                          <span>Created {new Date(link.createdAt).toLocaleDateString()}</span>
                          <span className="font-semibold text-[var(--foreground)]">Conversion Rate: {stats.conversionRate || 0}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-8 rounded-2xl border border-[var(--sidebar-border)] bg-[var(--card-surface)] p-6">
        <div className="mb-6 flex items-center gap-3">
          <SparkleIcon className="h-5 w-5 text-[var(--color-primary-300)]" />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--sidebar-text)] opacity-60">Workflow</p>
            <h2 className="mt-2 text-xl font-bold text-[var(--foreground)] font-montserrat">How sharing works</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-[var(--sidebar-border)] bg-[var(--background)] p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--sidebar-text)] opacity-60">1. Generate</p>
            <p className="mt-3 text-sm text-[var(--sidebar-text)] opacity-70">
              Create a custom code or pick a live asset, then set a target page for the tracking source.
            </p>
          </div>
          <div className="rounded-2xl border border-[var(--sidebar-border)] bg-[var(--background)] p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--sidebar-text)] opacity-60">2. Distribute</p>
            <p className="mt-3 text-sm text-[var(--sidebar-text)] opacity-70">
              Share the generated referral links with prospective leads or on campaigns.
            </p>
          </div>
          <div className="rounded-2xl border border-[var(--sidebar-border)] bg-[var(--background)] p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--sidebar-text)] opacity-60">3. Attribute</p>
            <p className="mt-3 text-sm text-[var(--sidebar-text)] opacity-70">
              The platform captures clicks on landing and records signup, lead, and investment events automatically.
            </p>
          </div>
        </div>
      </div>

      <ShareAssetModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        assetTitle={selectedAsset?.title || "Selected asset"}
        assetValuation={String(selectedAsset?.valuation || 0)}
        shareUrl={selectedShareUrl}
        isGenerating={isGenerating}
        onGenerate={handleGenerateShareLink}
      />

      {/* Edit Destination Modal */}
      {editingLink && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-[var(--sidebar-border)] bg-[var(--card-surface)] p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-[var(--foreground)] font-montserrat mb-4">Edit Referral Link: {editingLink.code}</h3>
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--sidebar-text)] opacity-60 mb-2">Destination URL</label>
                <input
                  type="url"
                  required
                  value={editDestUrl}
                  onChange={(e) => setEditDestUrl(e.target.value)}
                  className="w-full rounded-lg border border-[var(--sidebar-border)] bg-[var(--background)] p-3 text-sm text-[var(--foreground)] focus:border-[var(--color-primary-300)] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="editIsActive"
                  checked={editIsActive}
                  onChange={(e) => setEditIsActive(e.target.checked)}
                  className="rounded border-[var(--sidebar-border)] bg-[var(--background)] text-[var(--color-primary-300)] focus:ring-0"
                />
                <label htmlFor="editIsActive" className="text-sm font-semibold text-[var(--foreground)] cursor-pointer">Active State</label>
              </div>

              {editError && <p className="text-xs font-medium text-red-500">{editError}</p>}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingLink(null)}
                  className="inline-flex h-10 items-center justify-center rounded-md border border-[var(--sidebar-border)] px-4 text-xs font-bold uppercase tracking-wider text-[var(--foreground)] hover:bg-neutral-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingLink}
                  className="inline-flex h-10 items-center justify-center rounded-md bg-[var(--color-primary-300)] px-5 text-xs font-bold uppercase tracking-wider text-black hover:scale-[1.01] transition disabled:opacity-50"
                >
                  {isUpdatingLink ? <LoadingSpinner /> : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
