import { getUserDetail } from "@/api/user.service";
import { UserDetail } from "@/@types/user.type";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // localStorage
import { toast } from "sonner";
type AuthState = {
  isFetching: boolean;
  access_token: string | null;
};
const initStateAuth: AuthState = {
  isFetching: false,
  access_token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initStateAuth,
  reducers: {
    setAccessToken: (
      state,
      action: PayloadAction<AuthState["access_token"]>
    ) => {
      state.access_token = action.payload;
    },
  },
  extraReducers(builder) {
    builder;
  },
});
const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["access_token"],
};
export const { setAccessToken } = authSlice.actions;

export default persistReducer(authPersistConfig, authSlice.reducer);
