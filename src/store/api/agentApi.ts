import { baseApi } from './baseApi';

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

export const agentApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAgentDashboard: builder.query<AgentDashboardResponse, void>({
            query: () => 'agent/dashboard',
            providesTags: ['Commission'],
        }),
        getReferralByCode: builder.query<any, string>({
            query: (code) => `agent/referral/${code}`,
        }),
    }),
});

export const {
    useGetAgentDashboardQuery,
    useGetReferralByCodeQuery,
} = agentApi;
