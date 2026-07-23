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
} = agentApi;

