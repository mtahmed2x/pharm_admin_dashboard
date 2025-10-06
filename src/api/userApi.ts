import {
  AllUsersResponseData,
  ApiResponse,
  ProfileResponseData,
  UpdateAvatarRequest,
  User,
} from "@/types";
import { baseApi } from "./api";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<ApiResponse<ProfileResponseData>, void>({
      query: () => "user/profile",
      providesTags: ["User"],
    }),
    updateProfile: builder.mutation<
      ApiResponse<ProfileResponseData>,
      Partial<User>
    >({
      query: (body) => ({
        url: "user/update",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    updateAvatar: builder.mutation<
      ApiResponse<ProfileResponseData>,
      UpdateAvatarRequest
    >({
      query: ({ avatar }) => {
        const formData = new FormData();
        formData.append("avatar", avatar);

        return {
          url: "user/update-avatar",
          method: "PATCH",
          body: formData,
        };
      },
      invalidatesTags: ["User"],
    }),

    getAllUser: builder.query<
      AllUsersResponseData,
      { page?: number; limit?: number }
    >({
      query: ({ page, limit } = {}) => {
        const params = new URLSearchParams();
        if (page) params.append("page", page.toString());
        if (limit) params.append("limit", limit.toString());

        return `user?${params.toString()}`;
      },

      transformResponse: (response: {
        success: boolean;
        message: string;
        data: {
          data: User[];
          meta: {
            page: number;
            limit: number;
            total: number;
            totalPage: number;
          };
        };
      }) => {
        return {
          success: response.success as true,
          message: response.message,
          data: response.data.data,
          meta: response.data.meta,
        };
      },

      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({
                type: "Users" as const,
                id: _id,
              })),
              { type: "Users", id: "LIST" },
            ]
          : [{ type: "Users", id: "LIST" }],
    }),

    getUserById: builder.query<ApiResponse<User>, string>({
      query: (id) => `user/${id}`,
      providesTags: (result, error, id) => [{ type: "Users", id }],
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
      invalidatesTags: [{ type: "Users", id: "LIST" }],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUpdateAvatarMutation,
  useGetAllUserQuery,
  useGetUserByIdQuery,
  useToggleUserStatusMutation,
} = userApi;
