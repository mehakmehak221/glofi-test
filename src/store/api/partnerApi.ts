import { baseApi } from './baseApi';
import { AssetShareReport, ShareAssetRequest, ShareLinkResponse } from '@/types/assetShare';

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
    generateAssetShareLink: builder.mutation<ShareLinkResponse, { assetId: string | number; body?: ShareAssetRequest }>({
      query: ({ assetId, body }) => ({
        url: `partner/assets/${assetId}/share`,
        method: 'POST',
        body: body ?? {},
      }),
      invalidatesTags: [{ type: 'AssetShare', id: 'LIST' }],
    }),
    getSharedAssets: builder.query<ShareLinkResponse[], void>({
      query: () => 'partner/assets/shared',
      providesTags: (result) =>
        result
          ? [
              { type: 'AssetShare' as const, id: 'LIST' },
              ...result.map((item) => ({ type: 'AssetShare' as const, id: item.assetId })),
            ]
          : [{ type: 'AssetShare' as const, id: 'LIST' }],
    }),
    getPartnerAssetShareReport: builder.query<AssetShareReport, string | number>({
      query: (assetId) => `partner/assets/${assetId}/share-report`,
      providesTags: (_result, _error, assetId) => [{ type: 'AssetShare', id: String(assetId) }],
    }),
  }),
});

export const {
  useGetPartnerFinanceQuery,
  useGetCommissionHistoryQuery,
  useGetPayoutHistoryQuery,
  useGetListingPerformanceQuery,
  useGetPartnerPortfolioQuery,
  useGenerateAssetShareLinkMutation,
  useGetSharedAssetsQuery,
  useGetPartnerAssetShareReportQuery,
} = partnerApi;
