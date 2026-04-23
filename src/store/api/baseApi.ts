import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getCookie } from '@/utils/cookieUtils';
import { API_URL } from '@/constants';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/`,
    credentials: 'include',
    prepareHeaders: (headers, { endpoint }) => {
      const publicEndpoints = ['login', 'register'];

      if (!publicEndpoints.includes(endpoint)) {
        const token = getCookie('access_token') || localStorage.getItem('access_token');
        console.log(`[API] Endpoint: ${endpoint}, Token found: ${!!token}`);
        if (token) {
          headers.set('Authorization', `Bearer ${token}`);
        }
      }

      if (!headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
      }
      headers.set('accept', '*/*');
      return headers;
    },
  }),
  tagTypes: [
    'User', 'Post', 'Kyb', 'Kyc', 'Investment', 'SecondaryMarketplace',
    'MySecondaryListings', 'PendingApprovals', 'Certificates', 'Commission',
    'PartnerFinance', 'Payout', 'Asset',
  ],
  endpoints: () => ({}),
});
