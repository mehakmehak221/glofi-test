import { baseApi } from './baseApi';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<any, any>({
      query: (userData) => ({
        url: 'auth/register',
        method: 'POST',
        body: userData,
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
    }),
    getProfile: builder.query<any, void>({
      query: () => ({
        url: 'auth/profile',
        method: 'GET',
      }),
      providesTags: ['User'],
    }),
  }),
});

export const {
  useRegisterMutation,
  useRegisterAgentMutation,
  useLoginMutation,
  useSetupProfileMutation,
  useLogoutMutation,
  useGetProfileQuery,
} = authApi;
