export interface ShareAssetRequest {
  customCode?: string;
  destinationUrl?: string;
  campaignId?: string;
}

export interface SharedAssetStats {
  totalClicks: number;
  registeredUsersCount: number;
  investmentsCount: number;
  totalInvestmentAmount: number;
  conversionRate: number;
}

export interface SharedAssetAsset {
  id: string;
  title: string;
  category?: string;
  status?: string;
  location?: string;
  valuation?: string;
  fractionPrice?: string;
  expectedYield?: string;
}

export interface ShareLinkResponse {
  id: string;
  agentId?: string | null;
  partnerId?: string | null;
  assetId: string;
  campaignId?: string | null;
  code: string;
  destinationUrl: string;
  shareUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  asset?: SharedAssetAsset;
  stats?: SharedAssetStats;
}

export interface ShareReportSummary {
  totalClicks: number;
  totalRegistrations: number;
  totalInvestments: number;
  totalInvestmentAmount: number;
  totalVolume?: number;
  totalShares?: number;
  conversionRate: number;
}

export interface AssetShareReport {
  assetId: string;
  asset?: SharedAssetAsset;
  links: Array<{
    id: string;
    code: string;
    shareUrl: string;
    stats: SharedAssetStats;
  }>;
  summary: ShareReportSummary;
}

