import { baseApi } from "./baseApi";
import {
  CouponValidationRequest,
  CouponValidationResponse,
  RewardCoupon,
  UserRewardsHistoryResponse,
  UserRewardsResponse,
} from "@/types/rewards";

export const rewardsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserCoupons: builder.query<RewardCoupon[], void>({
      query: () => ({
        url: "user/coupons",
        method: "GET",
      }),
      providesTags: ["Rewards"],
    }),
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
  }),
});

export const {
  useGetUserCouponsQuery,
  useValidateCouponMutation,
  useGetUserRewardsQuery,
  useGetUserRewardsHistoryQuery,
} = rewardsApi;
