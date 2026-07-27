export type RewardStatus = "PENDING" | "APPROVED" | "CREDITED" | "CANCELLED";

export type RewardCampaignType =
  | "REFERRAL"
  | "FIRST_INVESTMENT"
  | "INVESTMENT_BONUS"
  | "PROMOTIONAL"
  | "MANUAL"
  | "CASHBACK";

export type CouponType = "FIXED" | "PERCENTAGE";

export interface RewardCoupon {
  id: string;
  code: string;
  type: CouponType;
  value: number;
  minimumInvestment?: number | string | null;
  maximumDiscount?: number | string | null;
  usageLimit?: number | null;
  expiresAt?: string | null;
  isActive?: boolean;
}

export interface RewardCampaign {
  id: string;
  name: string;
  description?: string | null;
  type: RewardCampaignType;
  rewardAmount?: number | string | null;
  rewardPercentage?: number | string | null;
  minimumInvestment?: number | string | null;
  maximumReward?: number | string | null;
  startDate?: string | null;
  endDate?: string | null;
  isActive?: boolean;
}

export interface UserReward {
  id: string;
  userId?: string;
  amount: number | string;
  status: RewardStatus;
  creditedAt?: string | null;
  campaign?: {
    name?: string;
  } | null;
  walletTransaction?: {
    id: string;
    amount: number | string;
    createdAt: string;
  } | null;
}

export interface CouponRedemption {
  id: string;
  rewardAmount: number | string;
  redeemedAt: string;
  coupon?: {
    code?: string;
    type?: CouponType;
  } | null;
  investment?: {
    id: string;
    totalPaid: number | string;
  } | null;
}

export interface UserRewardsResponse {
  activeCampaigns: RewardCampaign[];
  userRewards: UserReward[];
}

export interface UserRewardsHistoryResponse {
  rewards: UserReward[];
  couponRedemptions: CouponRedemption[];
}

export interface CouponValidationRequest {
  code: string;
  investmentAmount: number;
  assetId?: string;
}

export interface CouponValidationResponse {
  isValid: boolean;
  coupon?: RewardCoupon;
  discountAmount?: number;
  message?: string;
}

export interface RewardsDashboardResponse {
  totalRewardsIssued?: number | string;
  totalWalletCredits?: number;
  activeCampaigns?: number;
  couponsRedeemed?: number;
  referralRewardsTotal?: number | string;
  campaignPerformance?: Array<{
    id: string;
    name: string;
    type: RewardCampaignType;
    isActive?: boolean;
    rewardsCount?: number;
    totalAmountIssued?: number | string;
  }>;
}

export interface RewardsLogItem {
  id: string;
  userId?: string;
  amount: number | string;
  status: RewardStatus;
  reason?: string;
  createdAt?: string;
  updatedAt?: string;
  user?: {
    id?: string;
    email?: string;
    fullName?: string;
  } | null;
  campaign?: {
    id?: string;
    name?: string;
    type?: RewardCampaignType;
  } | null;
}

export interface RewardsLogResponse {
  data?: RewardsLogItem[];
  rewards?: RewardsLogItem[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface CreateCampaignPayload {
  name: string;
  type: RewardCampaignType;
  rewardAmount?: number;
  rewardPercentage?: number;
  minimumInvestment?: number;
  maximumReward?: number;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
  description?: string;
}

export interface UpdateCampaignPayload extends Partial<CreateCampaignPayload> {
  id: string;
}

export interface CreateCouponPayload {
  code: string;
  type: CouponType;
  value: number;
  minimumInvestment?: number;
  maximumDiscount?: number;
  usageLimit?: number;
  expiresAt?: string;
  isActive?: boolean;
}

export interface ManualRewardPayload {
  userId: string;
  amount: number;
  reason: string;
}
