import { baseApi } from './baseApi';
import { unwrapAssetResponse, type UpdateAssetPayload } from '@/utils/assetUtils';

export const assetApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    createAsset: builder.mutation<any, any>({
      query: (assetData) => ({
        url: 'assets',
        method: 'POST',
        body: assetData,
      }),
    }),
    getAssets: builder.query<any, { category?: string; riskRating?: string; country?: string; state?: string; city?: string; limit?: number; page?: number } | void>({
      query: (arg) => {
        const { category, riskRating, country, state, city, limit = 10, page = 1 } = arg || {};
        const params = new URLSearchParams({ limit: String(limit), page: String(page) });
        if (category) params.append('category', category);
        if (riskRating) params.append('riskRating', riskRating);
        if (country) params.append('country', country);
        if (state) params.append('state', state);
        if (city) params.append('city', city);
        return {
          url: `assets?${params.toString()}`,
          method: 'GET',
        };
      },
    }),
    getAssetById: builder.query<any, string | number>({
      query: (id) => ({
        url: `assets/${id}`,
        method: 'GET',
      }),
      transformResponse: (response: unknown) => unwrapAssetResponse(response) ?? response,
    }),
    getMyListings: builder.query<any, { limit?: number; page?: number } | void>({
      query: (arg) => {
        const { limit = 10, page = 1 } = arg || {};
        return {
          url: `assets/my/listings?limit=${limit}&page=${page}`,
          method: 'GET',
        };
      },
    }),
    getPartnerAssetById: builder.query<any, string | number>({
      query: (id) => ({
        url: `assets/my/${id}`,
        method: 'GET',
      }),
    }),
    updateAsset: builder.mutation<any, { id: string | number; [key: string]: any }>({
      query: ({ id, ...patch }) => ({
        url: `assets/my/${id}`,
        method: 'PATCH',
        body: patch,
      }),
    }),
    deleteAsset: builder.mutation<any, string | number>({
      query: (id) => ({
        url: `assets/my/${id}`,
        method: 'DELETE',
      }),
    }),
    submitAssetForReview: builder.mutation<any, string | number>({
      query: (id) => ({
        url: `assets/my/${id}/submit`,
        method: 'PATCH',
      }),
    }),
    uploadFile: builder.mutation<any, { file: File; folder?: string }>({
      query: ({ file, folder = 'kyc' }) => {
        const formData = new FormData();
        formData.append('file', file);
        return {
          url: `upload/file?folder=${folder}`,
          method: 'POST',
          body: formData,
        };
      },
    }),
    updateAssetById: builder.mutation<
      unknown,
      { id: string | number } & UpdateAssetPayload
    >({
      query: ({ id, ...patch }) => ({
        url: `assets/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: ['Asset'],
    }),
    getAssetReturns: builder.query<any, string | number>({
      query: (id) => ({
        url: `assets/${id}/returns`,
        method: 'GET',
      }),
    }),
    getAssetCashflow: builder.query<any, string | number>({
      query: (id) => ({
        url: `assets/${id}/cashflow`,
        method: 'GET',
      }),
    }),
    getAssetIrrCurve: builder.query<any, string | number>({
      query: (id) => ({
        url: `assets/${id}/irr-curve`,
        method: 'GET',
      }),
    }),
    getAssetRentalSchedule: builder.query<any, string | number>({
      query: (id) => ({
        url: `assets/${id}/rental-schedule`,
        method: 'GET',
      }),
    }),
    getAssetProjectedValuation: builder.query<any, string | number>({
      query: (id) => ({
        url: `assets/${id}/projected-valuation`,
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useCreateAssetMutation,
  useUpdateAssetMutation,
  useDeleteAssetMutation,
  useUploadFileMutation,
  useGetMyListingsQuery,
  useGetPartnerAssetByIdQuery,
  useGetAssetsQuery,
  useGetAssetByIdQuery,
  useSubmitAssetForReviewMutation,
  useUpdateAssetByIdMutation,
  useGetAssetReturnsQuery,
  useGetAssetCashflowQuery,
  useGetAssetIrrCurveQuery,
  useGetAssetRentalScheduleQuery,
  useGetAssetProjectedValuationQuery,
} = assetApi;
