import { baseApi } from './baseApi';

export const assetApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createAsset: builder.mutation<any, any>({
      query: (assetData) => ({
        url: 'assets',
        method: 'POST',
        body: assetData,
      }),
    }),
    getAssets: builder.query<any, { category?: string; riskRating?: string; limit?: number; page?: number } | void>({
      query: (arg) => {
        const { category, riskRating, limit = 10, page = 1 } = arg || {};
        const params = new URLSearchParams({ limit: String(limit), page: String(page) });
        if (category) params.append('category', category);
        if (riskRating) params.append('riskRating', riskRating);
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
} = assetApi;
