import { baseApi } from './baseApi';

export const secondaryMarketApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getSecondaryListings: builder.query({
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
    getSecondaryListingById: builder.query({
      query: (id) => ({
        url: `secondary-marketplace/listings/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'SecondaryMarketplace', id }],
    }),
    deleteSecondaryListing: builder.mutation({
      query: (id) => ({
        url: `secondary-marketplace/listings/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['SecondaryMarketplace', 'MySecondaryListings'],
    }),
    approveSecondaryListing: builder.mutation({
      query: (id) => ({
        url: `secondary-marketplace/listings/${id}/approve`,
        method: 'POST',
      }),
      invalidatesTags: ['PendingApprovals', 'SecondaryMarketplace'],
    }),
    buySecondaryListing: builder.mutation({
      query: ({ id, fractions }) => ({
        url: `secondary-marketplace/listings/${id}/buy`,
        method: 'POST',
        body: { fractions },
      }),
      invalidatesTags: ['SecondaryMarketplace'],
    }),
    rejectSecondaryListing: builder.mutation({
      query: ({ id, reason }) => ({
        url: `secondary-marketplace/listings/${id}/reject`,
        method: 'POST',
        body: { reason },
      }),
      invalidatesTags: ['PendingApprovals', 'SecondaryMarketplace'],
    }),
    getMySecondaryListings: builder.query({
      query: () => ({
        url: `secondary-marketplace/my-listings`,
        method: 'GET',
      }),
      providesTags: ['MySecondaryListings'],
    }),
    getSecondaryPendingApprovals: builder.query({
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
  useRejectSecondaryListingMutation,
  useGetMySecondaryListingsQuery,
  useGetSecondaryPendingApprovalsQuery,
} = secondaryMarketApi;
