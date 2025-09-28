import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";
import { BASE_URL } from "../config/constants";
import { ApiResponse, LoginResponseData } from "@/types";

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    const refreshToken = (api.getState() as RootState).auth.refreshToken;
    if (refreshToken) {
      const refreshResult = await baseQuery(
        {
          url: "auth/refresh",
          method: "POST",
          body: { refreshToken },
        },
        api,
        extraOptions
      );

      const refreshData = refreshResult.data as ApiResponse<LoginResponseData>;

      if (refreshData?.success) {
        const { setCredentials } = await import("../features/auth/authSlice");
        api.dispatch(setCredentials(refreshData.data));

        result = await baseQuery(args, api, extraOptions);
      } else {
        const { logout } = await import("../features/auth/authSlice");
        api.dispatch(logout());
      }
    } else {
      const { logout } = await import("../features/auth/authSlice");
      api.dispatch(logout());
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "Dashboard"],
  endpoints: () => ({}),
});
