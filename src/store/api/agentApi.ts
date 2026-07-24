import { baseApi } from './baseApi';
import {
    AgentDashboardResponse,
    AgentEarningsResponse,
    AgentEarningsHistoryResponse,
    AgentMeResponse,
    AgentReferralLinkResponse,
    AgentTransactionsResponse,
    CommissionSummary,
    Commission,
    WithdrawalRequestResponse
} from '@/types/agent';
import { AssetShareReport, ShareAssetRequest, ShareLinkResponse } from '@/types/assetShare';

export const agentApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAgentDashboard: builder.query<AgentDashboardResponse, void>({
            query: () => 'agent/dashboard',
            providesTags: ['Commission'],
        }),
        getAgentEarnings: builder.query<AgentEarningsResponse, void>({
            query: () => 'agent/earnings',
            providesTags: ['Commission'],
        }),
        getAgentEarningsHistory: builder.query<AgentEarningsHistoryResponse, void>({
            query: () => 'agent/earnings/history',
            providesTags: ['Commission'],
        }),
        getAgentTransactions: builder.query<AgentTransactionsResponse, void>({
            query: () => 'agent/transactions',
            providesTags: ['Commission'],
        }),
        getAgentCommissions: builder.query<Commission[], void>({
            query: () => 'agent/commissions',
            providesTags: ['Commission'],
        }),
        getAgentCommissionSummary: builder.query<CommissionSummary, void>({
            query: () => 'agent/commissions/summary',
            providesTags: ['Commission'],
        }),
        requestCommissionWithdrawal: builder.mutation<WithdrawalRequestResponse, { amount: number; bankAccountId?: string }>({
            query: (body) => ({
                url: 'wallet/withdraw',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Commission'],
        }),
        getAgentMe: builder.query<AgentMeResponse, void>({
            query: () => 'agent/me',
            providesTags: ['User', 'Commission'],
        }),
        getAgentReferralLink: builder.query<AgentReferralLinkResponse, void>({
            query: () => 'agent/referral-link',
        }),
        getReferralByCode: builder.query<any, string>({
            query: (code) => `agent/referral/${code}`,
        }),
        generateAssetShareLink: builder.mutation<ShareLinkResponse, { assetId: string | number; body?: ShareAssetRequest }>({
            query: ({ assetId, body }) => ({
                url: `agent/assets/${assetId}/share`,
                method: 'POST',
                body: body ?? {},
            }),
            invalidatesTags: [{ type: 'AssetShare', id: 'LIST' }],
        }),
        getSharedAssets: builder.query<ShareLinkResponse[], void>({
            query: () => 'agent/assets/shared',
            providesTags: (result) =>
                result
                    ? [
                        { type: 'AssetShare' as const, id: 'LIST' },
                        ...result.map((item) => ({ type: 'AssetShare' as const, id: item.assetId })),
                    ]
                    : [{ type: 'AssetShare' as const, id: 'LIST' }],
        }),
        getAgentAssetShareReport: builder.query<AssetShareReport, string | number>({
            query: (assetId) => `agent/assets/${assetId}/share-report`,
            providesTags: (_result, _error, assetId) => [{ type: 'AssetShare', id: String(assetId) }],
        }),
    }),
});

export const {
    useGetAgentDashboardQuery,
    useGetAgentEarningsQuery,
    useGetAgentEarningsHistoryQuery,
    useGetAgentTransactionsQuery,
    useGetAgentCommissionsQuery,
    useGetAgentCommissionSummaryQuery,
    useRequestCommissionWithdrawalMutation,
    useGetAgentMeQuery,
    useGetAgentReferralLinkQuery,
    useGetReferralByCodeQuery,
    useGenerateAssetShareLinkMutation,
    useGetSharedAssetsQuery,
    useGetAgentAssetShareReportQuery,
} = agentApi;
