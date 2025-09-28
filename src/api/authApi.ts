import { baseApi } from "./api";
import { ApiResponse, LoginRequest, LoginResponseData } from "@/types";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<ApiResponse<LoginResponseData>, LoginRequest>({
      query: (credentials) => ({
        url: "auth/login",
        method: "POST",
        body: credentials,
      }),
    }),

    refreshToken: builder.mutation<
      ApiResponse<LoginResponseData>,
      { refreshToken: string }
    >({
      query: ({ refreshToken }) => ({
        url: "auth/refresh",
        method: "POST",
        body: { refreshToken },
      }),
    }),
  }),
});

export const { useLoginMutation, useRefreshTokenMutation } = authApi;
