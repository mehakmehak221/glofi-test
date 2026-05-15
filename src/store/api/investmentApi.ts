import { baseApi } from './baseApi';

export const investmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getInvestments: builder.query<any, void>({
      query: () => ({
        url: 'investments',
        method: 'GET',
      }),
      providesTags: ['Investment'],
    }),
    getPortfolio: builder.query<any, void>({
      query: () => ({
        url: 'investments/portfolio',
        method: 'GET',
      }),
      providesTags: ['Investment'],
    }),
    createInvestment: builder.mutation<
      any,
      { assetId: string; fractions: number; paymentMethod: string; currency: string }
    >({
      query: (investmentData) => ({
        url: 'investments',
        method: 'POST',
        body: investmentData,
      }),
      invalidatesTags: ['Investment', 'Asset'],
    }),
    verifyInvestmentPayment: builder.mutation<
      any,
      { razorpayOrderId: string; razorpayPaymentId: string; razorpaySignature: string }
    >({
      query: (body) => ({
        url: 'investments/verify-payment',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Investment', 'Asset', 'Certificates'],
    }),
    getInvestmentById: builder.query<any, string | number>({
      query: (id) => ({
        url: `investments/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Investment', id: String(id) }],
    }),
    sellInvestment: builder.mutation<any, { id: string | number; [key: string]: any }>({
      query: ({ id, ...body }) => ({
        url: `investments/${id}/sell`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Investment', 'SecondaryMarketplace', 'MySecondaryListings'],
    }),
    getTransactions: builder.query<any, void>({
      query: () => ({
        url: 'investments/transactions',
        method: 'GET',
      }),
      providesTags: ['Investment'],
    }),
    getPendingApprovals: builder.query<any, void>({
      query: () => ({
        url: 'investments/pending-approvals',
        method: 'GET',
      }),
      providesTags: ['Investment'],
    }),
    approveInvestment: builder.mutation<any, string | number>({
      query: (id) => ({
        url: `investments/${id}/approve`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Investment'],
    }),
    rejectInvestment: builder.mutation<any, { id: string | number; reason: string }>({
      query: ({ id, reason }) => ({
        url: `investments/${id}/reject`,
        method: 'PATCH',
        body: { reason },
      }),
      invalidatesTags: ['Investment'],
    }),
    getInvestmentReturns: builder.query<any, string | number>({
      query: (id) => ({
        url: `investments/${id}/returns`,
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useGetInvestmentsQuery,
  useGetPortfolioQuery,
  useCreateInvestmentMutation,
  useVerifyInvestmentPaymentMutation,
  useGetInvestmentByIdQuery,
  useSellInvestmentMutation,
  useGetTransactionsQuery,
  useGetPendingApprovalsQuery,
  useApproveInvestmentMutation,
  useRejectInvestmentMutation,
  useGetInvestmentReturnsQuery,
} = investmentApi;
