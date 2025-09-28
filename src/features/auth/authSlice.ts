import { createSlice, PayloadAction, isAnyOf } from "@reduxjs/toolkit";
import { LoginResponseData, User } from "@/types";
import { AppDispatch } from "@/store";
import { authApi } from "@/api/authApi";
import { baseApi } from "@/api/api";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  accessToken:
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null,
  refreshToken:
    typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null,
  isAuthenticated:
    typeof window !== "undefined"
      ? !!localStorage.getItem("accessToken")
      : false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<LoginResponseData>) => {
      const { user, accessToken, refreshToken } = action.payload;
      state.user = user;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.isAuthenticated = true;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(
        authApi.endpoints.login.matchFulfilled,
        authApi.endpoints.refreshToken.matchFulfilled
      ),
      (state, { payload }) => {
        if (payload.success) {
          authSlice.caseReducers.setCredentials(state, {
            payload: payload.data,
            type: "setCredentials",
          });
        }
      }
    );
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;

export const logoutUser = () => (dispatch: AppDispatch) => {
  dispatch(logout());
  dispatch(baseApi.util.resetApiState());
};
