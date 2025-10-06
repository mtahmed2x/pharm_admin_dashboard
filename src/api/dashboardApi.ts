import { baseApi } from "./api";
import { ApiResponse, DashboardResponseData, User } from "@/types";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardData: builder.query<ApiResponse<DashboardResponseData>, void>({
      query: () => "dashboard",
      providesTags: ["Dashboard"],
    }),

    toggleUserStatus: builder.mutation<
      ApiResponse<User>,
      { id: string; blocked: boolean }
    >({
      query: ({ id, blocked }) => ({
        url: `user/update-blocked-status/${id}`,
        method: "POST",
        body: { blocked },
      }),
      invalidatesTags: ["Dashboard"],
    }),
  }),
});

export const { useGetDashboardDataQuery, useToggleUserStatusMutation } =
  dashboardApi;
