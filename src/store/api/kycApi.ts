import { baseApi } from './baseApi';

export const kycApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    submitKyc: builder.mutation<any, any>({
      query: (kycData) => ({
        url: 'kyc/submit',
        method: 'POST',
        body: kycData,
      }),
      invalidatesTags: ['Kyc'],
    }),
    setupAgentKyc: builder.mutation<any, any>({
      query: (kycData) => ({
        url: 'agent/kyc',
        method: 'POST',
        body: kycData,
      }),
      invalidatesTags: ['Kyc'],
    }),
    getKycStatus: builder.query<any, void>({
      query: () => ({
        url: 'kyc/status',
        method: 'GET',
      }),
      providesTags: ['Kyc'],
    }),
  }),
});

export const { useSubmitKycMutation, useGetKycStatusQuery, useSetupAgentKycMutation } = kycApi;
