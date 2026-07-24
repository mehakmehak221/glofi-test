"use client";

import type { ComponentType } from "react";
import { useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
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
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<any | null>(null);
  const [selectedShareUrl, setSelectedShareUrl] = useState<string | null>(null);
  const [reportAssetId, setReportAssetId] = useState<string | null>(null);

  const { data: assetsData, isLoading: assetsLoading } = useGetAssetsQuery({
    status: "LIVE",
    limit: 12,
    page: 1,
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const { data: sharedAssets, isLoading: sharedLoading } = useGetSharedAssetsQuery();
  const [generateShareLink, { isLoading: isGenerating }] = useGenerateAssetShareLinkMutation();

  const liveAssets = assetsData?.data || [];
  const sharedList = useMemo(() => sharedAssets || [], [sharedAssets]);

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

  const summary = useMemo(() => {
    const totals = sharedList.reduce(
      (acc, item) => {
        const stats = item.stats;
        acc.shares += 1;
        acc.clicks += stats?.totalClicks || 0;
        acc.registrations += stats?.registeredUsersCount || 0;
        acc.investments += stats?.investmentsCount || 0;
        acc.volume += stats?.totalInvestmentAmount || 0;
        return acc;
      },
      { shares: 0, clicks: 0, registrations: 0, investments: 0, volume: 0 }
    );

    return [
      {
        label: "Shared Assets",
        value: totals.shares,
        hint: "Links generated from the agent panel",
        icon: PropertyIcon,
      },
      {
        label: "Total Clicks",
        value: totals.clicks,
        hint: "Visitor opens tracked by attribution",
        icon: LinkIcon,
      },
      {
        label: "Registrations",
        value: totals.registrations,
        hint: "Users who signed up after clicking",
        icon: UserGroupIcon,
      },
      {
        label: "Investment Volume",
        value: formatCurrency(totals.volume),
        hint: "Total amount invested via shared links",
        icon: DollarIcon,
      },
    ];
  }, [sharedList]);

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

  const handleCopy = async (item: any) => {
    if (!item.shareUrl) return;
    await copyToClipboard(item.shareUrl);
    setCopiedId(item.id);
    window.setTimeout(() => setCopiedId((current) => (current === item.id ? null : current)), 1500);
  };

  if (assetsLoading || sharedLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="flex items-center gap-3 text-[var(--foreground)] opacity-60 font-montserrat">
          <LoadingSpinner />
          Loading asset sharing dashboard...
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
          Asset Sharing
        </h1>
        <p className="max-w-3xl text-sm text-[var(--sidebar-text)] opacity-60">
          Generate unique referral links for live assets, share them through WhatsApp or copy-link, and monitor clicks, registrations, and investments in one place.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-8">
        {summary.map((item) => (
          <MetricCard key={item.label} {...item} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1.25fr_0.95fr]">
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
                      <span className="rounded-full bg-[var(--sidebar-active-bg)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--sidebar-active-text)]">
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
                        <span className="rounded-full bg-[var(--sidebar-active-bg)] px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--sidebar-active-text)]">
                          {item.stats?.totalClicks || 0} clicks
                        </span>
                        <span className="rounded-full bg-[var(--sidebar-active-bg)] px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--sidebar-active-text)]">
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
                          handleCopy(item);
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
                        <span className="rounded-full bg-[var(--sidebar-active-bg)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--sidebar-active-text)]">
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
      </div>

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
              Select a live asset and generate a unique referral link for the current campaign.
            </p>
          </div>
          <div className="rounded-2xl border border-[var(--sidebar-border)] bg-[var(--background)] p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--sidebar-text)] opacity-60">2. Share</p>
            <p className="mt-3 text-sm text-[var(--sidebar-text)] opacity-70">
              Send the share URL through WhatsApp, copy-link, or the native share sheet.
            </p>
          </div>
          <div className="rounded-2xl border border-[var(--sidebar-border)] bg-[var(--background)] p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--sidebar-text)] opacity-60">3. Track</p>
            <p className="mt-3 text-sm text-[var(--sidebar-text)] opacity-70">
              When a visitor lands with a ref code, the tracking bootstrap records the click automatically.
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
    </div>
  );
}
