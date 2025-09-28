// src/api/dashboardApi.ts
import { ApiResponse, DashboardResponseData } from "@/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/v1/",
    prepareHeaders: (headers, { getState }) => {
      // Get the access token from your auth slice
      const state = getState() as any; // Cast to any to access root state
      const token = state.auth.accessToken; // Assuming your auth slice stores accessToken
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getDashboardData: builder.query<ApiResponse<DashboardResponseData>, void>({
      query: () => "dashboard", // Endpoint for fetching dashboard data
      // You might want to add 'providesTags' here for caching/invalidation if you have mutations
    }),
    // If you have actions to toggle user status, you'd add a mutation here
    toggleUserStatus: builder.mutation<
      ApiResponse<any>, // Adjust response type
      { id: string; status: boolean }
    >({
      query: ({ id, status }) => ({
        url: `users/${id}/status`, // Example endpoint
        method: "PATCH",
        body: { status: status ? "active" : "inactive" }, // Map boolean to "active"/"inactive"
      }),
      // Invalidate tags to refetch dashboard data if a user's status changes
      // invalidatesTags: ['Users', 'DashboardStats'],
    }),
  }),
});

export const { useGetDashboardDataQuery, useToggleUserStatusMutation } =
  dashboardApi;
