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
    getInvestmentById: builder.query({
      query: (id) => ({
        url: `investments/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Investment', id }],
    }),
    sellInvestment: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `investments/${id}/sell`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Investment', 'SecondaryMarketplace', 'MySecondaryListings'],
    }),
    getTransactions: builder.query({
      query: () => ({
        url: 'investments/transactions',
        method: 'GET',
      }),
      providesTags: ['Investment'],
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
  useGetInvestmentByIdQuery,
  useSellInvestmentMutation,
  useGetTransactionsQuery,
  useGetPendingApprovalsQuery,
  useApproveInvestmentMutation,
  useRejectInvestmentMutation,
} = investmentApi;
