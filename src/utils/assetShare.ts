import { API_URL } from "@/constants";

export interface ShareAssetOptions {
  shareUrl: string;
  assetTitle: string;
  assetValuation: string;
}

export function buildShareMessage({ shareUrl, assetTitle, assetValuation }: ShareAssetOptions) {
  return `🏢 Check out this investment opportunity!\n\n*${assetTitle}*\nValuation: AED ${Number(assetValuation || 0).toLocaleString()}\n\nInvest now 👇\n${shareUrl}`;
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const el = document.createElement("textarea");
    el.value = text;
    el.style.position = "fixed";
    el.style.opacity = "0";
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    return true;
  }
}

export async function shareAsset({ shareUrl, assetTitle, assetValuation }: ShareAssetOptions) {
  const message = buildShareMessage({ shareUrl, assetTitle, assetValuation });

  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      await navigator.share({
        title: assetTitle,
        text: message,
        url: shareUrl,
      });
      return;
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
    }
  }

  await copyToClipboard(shareUrl);
}

export function openWhatsAppShare(shareUrl: string, assetTitle: string) {
  const text = encodeURIComponent(`🏢 *${assetTitle}* — Start investing with as little as AED 500!\n${shareUrl}`);
  window.open(`https://wa.me/?text=${text}`, "_blank", "noopener,noreferrer");
}

export async function trackReferralClick(searchParams: URLSearchParams) {
  if (typeof window === "undefined") return null;

  const referralCode = searchParams.get("ref") || searchParams.get("referral");
  const utmSource = searchParams.get("utm_source");
  const utmMedium = searchParams.get("utm_medium");
  const utmCampaign = searchParams.get("utm_campaign");
  const utmTerm = searchParams.get("utm_term");
  const utmContent = searchParams.get("utm_content");

  if (!referralCode && !utmSource && !utmMedium && !utmCampaign && !utmTerm && !utmContent) {
    return null;
  }

  const urlKey = `glofi-tracking:${window.location.pathname}${window.location.search}`;
  try {
    if (window.sessionStorage.getItem(urlKey)) return null;
    window.sessionStorage.setItem(urlKey, "1");
  } catch {
    // Session storage may be unavailable in some private browsing contexts.
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const storedAttrId = localStorage.getItem("glofi_attr_id");
  if (storedAttrId) {
    headers["X-Attribution-ID"] = storedAttrId;
  }

  const response = await fetch(`${API_URL}/tracking/click`, {
    method: "POST",
    credentials: "include",
    headers,
    keepalive: true,
    body: JSON.stringify({
      referralCode: referralCode || undefined,
      utmSource: utmSource || undefined,
      utmMedium: utmMedium || undefined,
      utmCampaign: utmCampaign || undefined,
      utmTerm: utmTerm || undefined,
      utmContent: utmContent || undefined,
      landingPage: window.location.pathname,
      firstLandingUrl: window.location.href,
      referrer: document.referrer || undefined,
    }),
  });

  if (!response.ok) {
    throw new Error(`Tracking failed with status ${response.status}`);
  }

  const data = await response.json();
  if (data?.attributionId) {
    localStorage.setItem("glofi_attr_id", data.attributionId);
  }
  return data;
}

