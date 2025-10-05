import {
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
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUpdateAvatarMutation,
} = userApi;
