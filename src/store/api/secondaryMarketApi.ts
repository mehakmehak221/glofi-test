import { baseApi } from './baseApi';

export const secondaryMarketApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getSecondaryListings: builder.query<any, string | undefined>({
      query: (assetId) => {
        const params = new URLSearchParams();
        if (assetId) params.append('assetId', assetId);
        return {
          url: `secondary-marketplace/listings${params.toString() ? `?${params.toString()}` : ''}`,
          method: 'GET',
        };
      },
      providesTags: ['SecondaryMarketplace'],
    }),
    getSecondaryListingById: builder.query<any, string | number>({
      query: (id) => ({
        url: `secondary-marketplace/listings/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'SecondaryMarketplace', id: String(id) }],
    }),
    deleteSecondaryListing: builder.mutation<any, string | number>({
      query: (id) => ({
        url: `secondary-marketplace/listings/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['SecondaryMarketplace', 'MySecondaryListings'],
    }),
    approveSecondaryListing: builder.mutation<any, string | number>({
      query: (id) => ({
        url: `secondary-marketplace/listings/${id}/approve`,
        method: 'POST',
      }),
      invalidatesTags: ['PendingApprovals', 'SecondaryMarketplace'],
    }),
    buySecondaryListing: builder.mutation<
      any,
      { id: string | number; fractions: number; paymentMethod: string; currency: string }
    >({
      query: ({ id, fractions, paymentMethod, currency }) => ({
        url: `secondary-marketplace/listings/${id}/buy`,
        method: 'POST',
        body: { fractions, paymentMethod, currency },
      }),
      invalidatesTags: ['SecondaryMarketplace', 'Investment'],
    }),
    verifySecondaryPurchase: builder.mutation<
      any,
      {
        id: string | number;
        razorpayOrderId: string;
        razorpayPaymentId: string;
        razorpaySignature: string;
      }
    >({
      query: ({ id, ...body }) => ({
        url: `secondary-marketplace/listings/${id}/buy/verify`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['SecondaryMarketplace', 'Investment'],
    }),
    rejectSecondaryListing: builder.mutation<any, { id: string | number; reason: string }>({
      query: ({ id, reason }) => ({
        url: `secondary-marketplace/listings/${id}/reject`,
        method: 'POST',
        body: { reason },
      }),
      invalidatesTags: ['PendingApprovals', 'SecondaryMarketplace'],
    }),
    getMySecondaryListings: builder.query<any, void>({
      query: () => ({
        url: `secondary-marketplace/my-listings`,
        method: 'GET',
      }),
      providesTags: ['MySecondaryListings'],
    }),
    getSecondaryPendingApprovals: builder.query<any, void>({
      query: () => ({
        url: `secondary-marketplace/pending-approvals`,
        method: 'GET',
      }),
      providesTags: ['PendingApprovals'],
    }),
  }),
});

export const {
  useGetSecondaryListingsQuery,
  useGetSecondaryListingByIdQuery,
  useDeleteSecondaryListingMutation,
  useApproveSecondaryListingMutation,
  useBuySecondaryListingMutation,
  useVerifySecondaryPurchaseMutation,
  useRejectSecondaryListingMutation,
  useGetMySecondaryListingsQuery,
  useGetSecondaryPendingApprovalsQuery,
} = secondaryMarketApi;
