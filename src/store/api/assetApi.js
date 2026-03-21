import { baseApi } from './baseApi';

export const assetApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createAsset: builder.mutation({
      query: (assetData) => ({
        url: 'assets',
        method: 'POST',
        body: assetData,
      }),
    }),
    getAssets: builder.query({
      query: ({ category, riskRating, limit = 10, page = 1 } = {}) => {
        const params = new URLSearchParams({ limit, page });
        if (category) params.append('category', category);
        if (riskRating) params.append('riskRating', riskRating);
        return {
          url: `assets?${params.toString()}`,
          method: 'GET',
        };
      },
    }),
    getAssetById: builder.query({
      query: (id) => ({
        url: `assets/${id}`,
        method: 'GET',
      }),
    }),
    getMyListings: builder.query({
      query: ({ limit = 10, page = 1 } = {}) => ({
        url: `assets/my/listings?limit=${limit}&page=${page}`,
        method: 'GET',
      }),
    }),
    getPartnerAssetById: builder.query({
      query: (id) => ({
        url: `assets/my/${id}`,
        method: 'GET',
      }),
    }),
    updateAsset: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `assets/my/${id}`,
        method: 'PATCH',
        body: patch,
      }),
    }),
    deleteAsset: builder.mutation({
      query: (id) => ({
        url: `assets/my/${id}`,
        method: 'DELETE',
      }),
    }),
    submitAssetForReview: builder.mutation({
      query: (id) => ({
        url: `assets/my/${id}/submit`,
        method: 'PATCH',
      }),
    }),
    uploadFile: builder.mutation({
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
