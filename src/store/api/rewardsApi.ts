import { baseApi } from "./baseApi";
import {
  CreateCampaignPayload,
  CreateCouponPayload,
  CouponValidationRequest,
  CouponValidationResponse,
  ManualRewardPayload,
  RewardsDashboardResponse,
  RewardsLogResponse,
  UpdateCampaignPayload,
  UserRewardsHistoryResponse,
  UserRewardsResponse,
} from "@/types/rewards";

export interface RewardsLogParams {
  page?: number;
  limit?: number;
  status?: string;
}

export const rewardsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    validateCoupon: builder.mutation<CouponValidationResponse, CouponValidationRequest>({
      query: (body) => ({
        url: "user/coupons/validate",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Rewards"],
    }),
    getUserRewards: builder.query<UserRewardsResponse, void>({
      query: () => "user/rewards",
      providesTags: ["Rewards"],
    }),
    getUserRewardsHistory: builder.query<UserRewardsHistoryResponse, void>({
      query: () => "user/rewards/history",
      providesTags: ["Rewards"],
    }),
    getRewardsDashboard: builder.query<RewardsDashboardResponse, void>({
      query: () => "admin/rewards/dashboard",
      providesTags: ["Rewards"],
    }),
    getRewardsLog: builder.query<RewardsLogResponse, RewardsLogParams | void>({
      query: (params) => ({
        url: "admin/rewards",
        params: params || undefined,
      }),
      providesTags: ["Rewards"],
    }),
    createRewardCampaign: builder.mutation<any, CreateCampaignPayload>({
      query: (body) => ({
        url: "admin/rewards/campaigns",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Rewards"],
    }),
    updateRewardCampaign: builder.mutation<any, UpdateCampaignPayload>({
      query: ({ id, ...body }) => ({
        url: `admin/rewards/campaigns/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Rewards"],
    }),
    createRewardCoupon: builder.mutation<any, CreateCouponPayload>({
      query: (body) => ({
        url: "admin/rewards/coupons",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Rewards"],
    }),
    approveReward: builder.mutation<any, string>({
      query: (id) => ({
        url: `admin/rewards/${id}/approve`,
        method: "PATCH",
      }),
      invalidatesTags: ["Rewards"],
    }),
    cancelReward: builder.mutation<any, string>({
      query: (id) => ({
        url: `admin/rewards/${id}/cancel`,
        method: "PATCH",
      }),
      invalidatesTags: ["Rewards"],
    }),
    issueManualReward: builder.mutation<any, ManualRewardPayload>({
      query: (body) => ({
        url: "admin/rewards/manual",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Rewards"],
    }),
  }),
});

export const {
  useValidateCouponMutation,
  useGetUserRewardsQuery,
  useGetUserRewardsHistoryQuery,
  useGetRewardsDashboardQuery,
  useGetRewardsLogQuery,
  useCreateRewardCampaignMutation,
  useUpdateRewardCampaignMutation,
  useCreateRewardCouponMutation,
  useApproveRewardMutation,
  useCancelRewardMutation,
  useIssueManualRewardMutation,
} = rewardsApi;
