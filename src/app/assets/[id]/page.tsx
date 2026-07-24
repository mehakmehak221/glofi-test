import type { Metadata } from "next";
import { Suspense } from "react";
import AssetPublicView from "@/app/assets/[id]/AssetPublicView";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "https://api.glofiestates.com")
  .replace(/\/$/, "")
  .replace(/\/api$/, "");

async function fetchAssetData(id: string) {
  try {
    const res = await fetch(`${API_BASE}/assets/${id}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    const data = json?.data?.asset ?? json?.data ?? json?.asset ?? json;
    if (data?.id || data?.title) return data;
    return null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const asset = await fetchAssetData(id);

  if (!asset) {
    return {
      title: "Property | Glofi Estates",
      description: "Explore premium fractional real estate opportunities on Glofi Estates.",
    };
  }

  const title = asset.title ?? "Premium Property";
  const location = asset.location ?? "";
  const valuation = asset.valuation
    ? `₹${Number(asset.valuation).toLocaleString("en-IN")}`
    : "";
  const description = [
    `${title} in ${location}`.trim(),
    valuation && `Valued at ${valuation}`,
    asset.expectedYield && `Expected yield: ${asset.expectedYield}%`,
    "Invest in premium fractional real estate on Glofi Estates.",
  ]
    .filter(Boolean)
    .join(" — ");

  // Resolve image URL
  const rawImage = asset.images?.[0] ?? null;
  const imageUrl = rawImage
    ? rawImage.startsWith("http")
      ? rawImage
      : `${API_BASE}/${rawImage.replace(/^\/+/, "")}`
    : "https://www.glofiestates.com/assets/images/branding/og-default.jpg";

  const pageUrl = `https://www.glofiestates.com/assets/${id}`;

  return {
    title: `${title} | Glofi Estates`,
    description,
    alternates: { canonical: pageUrl },
    openGraph: {
      title: `${title} | Glofi Estates`,
      description,
      url: pageUrl,
      siteName: "Glofi Estates",
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Glofi Estates`,
      description,
      images: [imageUrl],
    },
  };
}

export default async function AssetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#090D0A]">
          <div className="w-8 h-8 border-2 border-[#00DAAF]/20 border-t-[#00DAAF] rounded-full animate-spin" />
        </div>
      }
    >
      <AssetPublicView assetId={id} />
    </Suspense>
  );
}
