import { baseApi } from './baseApi';

export const partnerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPartnerFinance: builder.query<any, void>({
      query: () => ({
        url: 'partner/finance',
        method: 'GET',
      }),
      providesTags: ['PartnerFinance'],
    }),
    getCommissionHistory: builder.query<any, void>({
      query: () => ({
        url: 'partner/commission-history',
        method: 'GET',
      }),
      providesTags: ['Commission'],
    }),
    getPayoutHistory: builder.query<any, void>({
      query: () => ({
        url: 'partner/payout-history',
        method: 'GET',
      }),
      providesTags: ['Payout'],
    }),
    getListingPerformance: builder.query<any, void>({
      query: () => ({
        url: 'partner/listing-performance',
        method: 'GET',
      }),
      providesTags: ['Asset'],
    }),
    getPartnerPortfolio: builder.query<any, void>({
      query: () => ({
        url: 'partner/portfolio',
        method: 'GET',
      }),
      providesTags: ['PartnerFinance', 'Asset'],
    }),
  }),
});

export const {
  useGetPartnerFinanceQuery,
  useGetCommissionHistoryQuery,
  useGetPayoutHistoryQuery,
  useGetListingPerformanceQuery,
  useGetPartnerPortfolioQuery,
} = partnerApi;
