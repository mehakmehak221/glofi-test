import { baseApi } from './baseApi';

export const investmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getInvestments: builder.query({
      query: () => ({
        url: 'investments',
        method: 'GET',
      }),
      providesTags: ['Investment'],
    }),
    getPortfolio: builder.query({
      query: () => ({
        url: 'investments/portfolio',
        method: 'GET',
      }),
      providesTags: ['Investment'],
    }),
    createInvestment: builder.mutation({
      query: (investmentData) => ({
        url: 'investments',
        method: 'POST',
        body: investmentData,
      }),
      invalidatesTags: ['Investment'],
    }),
    getPendingApprovals: builder.query({
      query: () => ({
        url: 'investments/pending-approvals',
        method: 'GET',
      }),
      providesTags: ['Investment'],
    }),
    approveInvestment: builder.mutation({
      query: (id) => ({
        url: `investments/${id}/approve`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Investment'],
    }),
    rejectInvestment: builder.mutation({
      query: ({ id, reason }) => ({
        url: `investments/${id}/reject`,
        method: 'PATCH',
        body: { reason },
      }),
      invalidatesTags: ['Investment'],
    }),
  }),
});

export const {
  useGetInvestmentsQuery,
  useGetPortfolioQuery,
  useCreateInvestmentMutation,
  useGetPendingApprovalsQuery,
  useApproveInvestmentMutation,
  useRejectInvestmentMutation,
} = investmentApi;
