import { baseApi } from './baseApi';

export type SendRegistrationOtpBody = {
  fullName: string;
  email: string;
  password: string;
  role: string;
  referralCode?: string;
};

export type RegistrationOtpBody = {
  email: string;
  otp: string;
};

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    sendRegistrationOtp: builder.mutation<{ message?: string }, SendRegistrationOtpBody>({
      query: (body) => ({
        url: 'auth/register/send-otp',
        method: 'POST',
        body,
      }),
    }),
    verifyRegistrationOtp: builder.mutation<any, RegistrationOtpBody>({
      query: (body) => ({
        url: 'auth/register/verify-otp',
        method: 'POST',
        body,
      }),
    }),
    register: builder.mutation<any, RegistrationOtpBody>({
      query: (body) => ({
        url: 'auth/register',
        method: 'POST',
        body,
      }),
    }),
    registerAgent: builder.mutation<any, any>({
      query: (agentData) => ({
        url: 'agent/signup',
        method: 'POST',
        body: agentData,
      }),
    }),
    login: builder.mutation<any, any>({
      query: (credentials) => ({
        url: 'auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),
    setupProfile: builder.mutation<any, any>({
      query: (profileData) => ({
        url: 'auth/setup-profile',
        method: 'POST',
        body: profileData,
      }),
    }),
    logout: builder.mutation<any, void>({
      query: () => ({
        url: 'auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['User'],
    }),
    getProfile: builder.query<any, void>({
      query: () => ({
        url: 'auth/profile',
        method: 'GET',
      }),
      providesTags: ['User'],
    }),
    forgotPassword: builder.mutation<any, { email: string }>({
      query: (data) => ({
        url: 'auth/forgot-password',
        method: 'POST',
        body: data,
      }),
    }),
    verifyForgotPasswordOtp: builder.mutation<any, { email: string; otp: string }>({
      query: (data) => ({
        url: 'auth/verify-forgot-password-otp',
        method: 'POST',
        body: data,
      }),
    }),
    resetPassword: builder.mutation<any, { email: string; otp: string; newPassword: string }>({
      query: (data) => ({
        url: 'auth/reset-password',
        method: 'POST',
        body: data,
      }),
    }),
    redeemEarlyStarter: builder.mutation<any, void>({
      query: () => ({
        url: 'auth/redeem',
        method: 'POST',
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useSendRegistrationOtpMutation,
  useVerifyRegistrationOtpMutation,
  useRegisterMutation,
  useRegisterAgentMutation,
  useLoginMutation,
  useSetupProfileMutation,
  useLogoutMutation,
  useGetProfileQuery,
  useForgotPasswordMutation,
  useVerifyForgotPasswordOtpMutation,
  useResetPasswordMutation,
  useRedeemEarlyStarterMutation,
} = authApi;
