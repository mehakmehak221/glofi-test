
export function unwrapAssetResponse(response: unknown): Record<string, unknown> | null {
  if (!response || typeof response !== "object") return null;
  const r = response as Record<string, unknown>;

  if (typeof r.title === "string" || r.id != null) {
    return r;
  }

  if (r.asset && typeof r.asset === "object") {
    return unwrapAssetResponse(r.asset);
  }

  if (r.data && typeof r.data === "object") {
    return unwrapAssetResponse(r.data);
  }

  return null;
}

export type UpdateAssetPayload = {
  title: string;
  description: string;
  category: string;
  location: string;
  city: string;
  state: string;
  country: string;
  valuation: number;
  totalFractions: number;
  expectedYield: number;
  expectedAnnualRent: number;
  rentalGrowthRate: number;
  expectedAppreciationRate: number;
  operatingCostRate: number;
  holdingPeriod: number;
  riskRating: string;
  titleDeedUrl: string;
  valuationReportUrl: string;
  legalOpinionUrl: string;
  images: string[];
  isReraVerified?: boolean;
  isreraverified?: boolean;
  saleType?: "FRACTIONAL" | "WHOLE";
};

export const validateFileUpload = (file: File): boolean => {
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];

  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Invalid file type. Only JPEG, PNG, and PDF are allowed.');
  }

  if (file.size > MAX_SIZE) {
    throw new Error('File is too large. Maximum size is 10MB.');
  }

  return true;
};
