import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://glofi-api.maxtron.ai/',
    credentials: 'include',
    prepareHeaders: (headers) => {
      headers.set('accept', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['User', 'Post', 'Kyb'],
  endpoints: () => ({}),
});
