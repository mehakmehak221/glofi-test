export interface AgentTransaction {
  id: string;
  assetName: string;
  referredUser: string;
  date: string;
  amount: number;
  commission: number;
  status: string;
}

export interface AgentDashboardResponse {
  totalSales: number;
  totalEarnings: number;
  referralsCount: number;
  commissionRate: number;
  referralCode: string;
  kycStatus: string;
  reraStatus: string;
  expiryDate: string;
  recentTransactions: AgentTransaction[];
}

export interface AgentEarningsResponse {
  totalEarnings: number;
  completedEarnings: number;
  pendingEarnings: number;
  totalCommissionTransactions: number;
  commissionRate: {
    effectivePercent: number;
    customPercent: number | null;
    defaultPercent: number;
    isEarlyAgent: boolean;
  };
}

export interface AgentEarningsHistoryResponse {
  data: AgentTransaction[];
  total: number;
}

export interface AgentMeResponse {
  id: string;
  email: string;
  role: string;
  phone: string | null;
  userStatus: {
    isActive: boolean;
    phoneVerified: boolean;
    kycStatus: string;
  };
  referralCode: string;
  referralLink: string;
  profile: {
    id: string;
    fullName: string;
    phone: string | null;
    dateOfBirth: string | null;
    nationality: string | null;
    residentialAddress: string | null;
    avatarUrl: string | null;
    reraNumber: string;
    reraDocumentUrl: string;
    expiryDate: string;
    commissionPercent: number | null;
    isEarlyAgent: boolean;
    totalEarnings: number;
    createdAt: string;
    updatedAt: string;
  };
  status: {
    isVerified: boolean;
    isActive: boolean;
    isReraExpired: boolean;
  };
  kyc: {
    documentType: string;
    documentUrl: string;
    documentStatus: string;
    selfieUrl: string;
    selfieStatus: string;
    addressProofUrl: string;
    addressProofStatus: string;
    addressProofType: string | null;
    status: string;
    verifiedAt: string | null;
    createdAt: string;
    updatedAt: string;
    rejectedNote: string | null;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AgentReferralLinkResponse {
  referralCode: string;
  referralLink: string;
}

export interface AgentTransactionsResponse {
  data: any[];
  total: number;
}

export type CommissionStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'LOCKED'
  | 'WITHDRAWABLE'
  | 'PAID'
  | 'CANCELLED';

export type CommissionType = 'AGENT' | 'PARTNER' | 'PLATFORM';

export interface CommissionSummary {
  Pending: number;
  Approved: number;
  Locked: number;
  Withdrawable: number;
  Paid: number;
}

export interface Commission {
  id: string;
  partnerId: string;
  agentId?: string;
  assetId?: string;
  investmentId?: string;
  amount: string;
  status: CommissionStatus;
  type: CommissionType;
  source?: string;
  approvedBy?: string;
  approvedAt?: string;
  lockedAt?: string;
  withdrawableAt?: string;
  paidAt?: string;
  walletTransactionId?: string;
  createdAt: string;
  updatedAt: string;
  investment?: {
    id: string;
    asset?: {
      title: string;
    };
  };
  agent?: {
    id: string;
    fullName: string;
    referralCode: string;
  };
}

export interface WithdrawalRequestResponse {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
}

export interface ReferralLinkStats {
  totalClicks: number;
  leadsCount: number;
  registeredUsersCount: number;
  kycCompletedCount: number;
  investmentsCount: number;
  totalInvestmentAmount: number;
  conversionRate: number;
}

export interface ReferralLink {
  id: string;
  agentId?: string;
  code: string;
  destinationUrl: string;
  isActive: boolean;
  createdAt: string;
  stats?: ReferralLinkStats;
}
