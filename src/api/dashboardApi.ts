import { baseApi } from "./api";
import { ApiResponse, DashboardResponseData } from "@/types";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardData: builder.query<ApiResponse<DashboardResponseData>, void>({
      query: () => "dashboard",
      providesTags: ["Dashboard"],
    }),

    toggleUserStatus: builder.mutation<
      ApiResponse<DashboardResponseData>,
      { id: string; status: boolean }
    >({
      query: ({ id, status }) => ({
        url: `users/${id}/status`,
        method: "PATCH",
        body: { status: status ? "active" : "inactive" },
      }),
      invalidatesTags: ["Dashboard"],
    }),
  }),
});

export const { useGetDashboardDataQuery, useToggleUserStatusMutation } =
  dashboardApi;
