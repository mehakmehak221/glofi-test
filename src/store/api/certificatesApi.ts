import { baseApi } from './baseApi';

export const certificatesApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getMyCertificates: builder.query<any, void>({
      query: () => ({
        url: 'certificates/my',
        method: 'GET',
      }),
      providesTags: ['Certificates'],
    }),
  }),
});

export const { useGetMyCertificatesQuery } = certificatesApi;
