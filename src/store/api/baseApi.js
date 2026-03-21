import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getCookie } from '@/utils/cookieUtils';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://glofi-api.maxtron.ai/',
    credentials: 'include',
    prepareHeaders: (headers) => {
      const token = getCookie('access_token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      if (!headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
      }
      headers.set('accept', '*/*');
      return headers;
    },
  }),
  tagTypes: ['User', 'Post', 'Kyb'],
  endpoints: () => ({}),
});
