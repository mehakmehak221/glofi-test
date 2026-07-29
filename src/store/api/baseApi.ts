import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { getCookie, removeCookie } from '@/utils/cookieUtils';
import { API_URL } from '@/constants';

const baseQuery = fetchBaseQuery({
  baseUrl: `${API_URL}/`,
  credentials: 'include',
  prepareHeaders: (headers, { endpoint }) => {
    const publicEndpoints = [
      'login',
      'sendRegistrationOtp',
      'sendPhoneOtp',
      'verifyPhoneOtp',
      'verifyRegistrationOtp',
      'register',
      'registerAgent',
      'getAssets',
      'getAssetById',
      'getAssetReturns',
      'getAssetCashflow',
      'getAssetIrrCurve',
      'getAssetRentalSchedule',
      'getAssetProjectedValuation',
      'forgotPassword',
      'verifyForgotPasswordOtp',
      'resetPassword'
    ];

    if (!publicEndpoints.includes(endpoint)) {
      const token = getCookie('access_token') || (typeof window !== 'undefined' ? localStorage.getItem('access_token') : null);
      console.log(`[API] Endpoint: ${endpoint}, Token found: ${!!token}`);
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    }


    headers.set('accept', '*/*');
    const storedAttrId = typeof window !== 'undefined' ? localStorage.getItem('glofi_attr_id') : null;
    if (storedAttrId) {
      headers.set('X-Attribution-ID', storedAttrId);
    }
    return headers;
  },
});

let isHandlingAuthError = false;

const baseQueryWithAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result.error) {
    const status = result.error.status;
    const httpStatus = status === 'PARSING_ERROR' ? (result.error as any).originalStatus : status;

    if (httpStatus === 401 || httpStatus === '401' || httpStatus === 403 || httpStatus === '403') {
      const url = typeof args === 'string' ? args : (args.url || '');
      const isLoginRequest = url.includes('auth/login');

      if (!isLoginRequest) {
        const errorMessage = typeof result.error.data === 'object' && result.error.data !== null
          ? (result.error.data as any)?.message || ''
          : '';

        const isAuthError = httpStatus === 401 || httpStatus === '401' ||
          ((httpStatus === 403 || httpStatus === '403') && (
            errorMessage.toLowerCase().includes('token') ||
            errorMessage.toLowerCase().includes('expired') ||
            errorMessage.toLowerCase().includes('unauthorized') ||
            errorMessage.toLowerCase().includes('auth') ||
            errorMessage.toLowerCase().includes('jwt') ||
            errorMessage.toLowerCase().includes('unauthenticated')
          ));

        if (isAuthError) {
          if (!isHandlingAuthError) {
            isHandlingAuthError = true;
            removeCookie('access_token');
            removeCookie('isLoggedIn');
            if (typeof window !== 'undefined') {
              localStorage.removeItem('access_token');
              localStorage.removeItem('isLoggedIn');
              localStorage.removeItem('userType');
              window.location.href = '/sign-in';
              setTimeout(() => { isHandlingAuthError = false; }, 3000);
            }
          }
          return result;
        }
      }
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithAuth,
  tagTypes: [
    'User', 'Post', 'Kyb', 'Kyc', 'Investment', 'SecondaryMarketplace',
    'MySecondaryListings', 'PendingApprovals', 'Certificates', 'Commission',
    'PartnerFinance', 'Payout', 'Asset', 'AssetShare', 'Lead', 'LeadNote', 'FollowUp', 'LeadActivity',
    'Support', 'Rewards', 'ReferralLink',
  ],
  endpoints: () => ({}),
});
