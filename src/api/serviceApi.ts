import {
  AllPopsResponseData,
  AllCocpsResponseData,
  Pop,
  Cocp,
  ApiResponse,
} from "@/types";
import { baseApi } from "./api";

const transformServiceResponse = <T>(response: {
  success: boolean;
  message: string;
  data: {
    data: T[];
    meta: { page: number; limit: number; total: number; totalPage: number };
  };
}) => {
  return {
    success: response.success as true,
    message: response.message,
    data: response.data.data,
    meta: response.data.meta,
  };
};

export const serviceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPops: builder.query<
      AllPopsResponseData,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 }) => `pop?page=${page}&limit=${limit}`,
      transformResponse: transformServiceResponse<Pop>,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({
                type: "Pops" as const,
                id: _id,
              })),
              { type: "Pops", id: "LIST" },
            ]
          : [{ type: "Pops", id: "LIST" }],
    }),

    updatePopStatus: builder.mutation<
      ApiResponse<Pop>,
      { id: string; status: "accept" | "decline" }
    >({
      query: ({ id, status }) => ({
        url: `pop/update/${id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Pops", id: "LIST" },
        { type: "Pops", id },
      ],
    }),

    deletePop: builder.mutation<ApiResponse<Pop>, string>({
      query: (id) => ({
        url: `pop/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Pops", id: "LIST" }],
    }),

    // --- COCP (Combined Oral Contraceptive Pill) Endpoints ---

    getCocps: builder.query<
      AllCocpsResponseData,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 }) => `cocp?page=${page}&limit=${limit}`,
      transformResponse: transformServiceResponse<Cocp>,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({
                type: "Cocps" as const,
                id: _id,
              })),
              { type: "Cocps", id: "LIST" },
            ]
          : [{ type: "Cocps", id: "LIST" }],
    }),

    updateCocpStatus: builder.mutation<
      ApiResponse<Cocp>,
      { id: string; status: "accept" | "decline" }
    >({
      query: ({ id, status }) => ({
        url: `cocp/update/${id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Cocps", id: "LIST" },
        { type: "Cocps", id },
      ],
    }),

    deleteCocp: builder.mutation<ApiResponse<Cocp>, string>({
      query: (id) => ({
        url: `cocp/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Cocps", id: "LIST" }],
    }),

    getPopById: builder.query<ApiResponse<Pop>, string>({
      query: (id) => `pop/${id}`,
      providesTags: (result, error, id) => [{ type: "Pops", id }],
    }),

    getCocpById: builder.query<ApiResponse<Cocp>, string>({
      query: (id) => `cocp/${id}`,
      providesTags: (result, error, id) => [{ type: "Cocps", id }],
    }),
  }),
});

// Export the auto-generated hooks for use in your components
export const {
  useGetPopsQuery,
  useUpdatePopStatusMutation,
  useDeletePopMutation,
  useGetCocpsQuery,
  useUpdateCocpStatusMutation,
  useDeleteCocpMutation,
  useGetPopByIdQuery,
  useGetCocpByIdQuery,
} = serviceApi;
