import { baseApi } from './baseApi';

export const kybApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    submitKyb: builder.mutation({
      query: (kybData) => ({
        url: 'kyb/submit',
        method: 'POST',
        body: kybData,
      }),
      invalidatesTags: ['Kyb'],
    }),
    getKybStatus: builder.query({
      query: () => ({
        url: 'kyb/status',
        method: 'GET',
        headers: {
          'accept': '*/*',
        },
      }),
      providesTags: ['Kyb'],
    }),
  }),
});

export const { useSubmitKybMutation, useGetKybStatusQuery } = kybApi;
