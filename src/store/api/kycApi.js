import { baseApi } from './baseApi';

export const kycApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    submitKyc: builder.mutation({
      query: (kycData) => ({
        url: 'kyc/submit',
        method: 'POST',
        body: kycData,
      }),
      invalidatesTags: ['Kyc'],
    }),
    getKycStatus: builder.query({
      query: () => ({
        url: 'kyc/status',
        method: 'GET',
      }),
      providesTags: ['Kyc'],
    }),
  }),
});

export const { useSubmitKycMutation, useGetKycStatusQuery } = kycApi;
