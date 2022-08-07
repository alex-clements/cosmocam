import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";

export interface AppState {
  page: string;
  applicationBarBackButton: boolean;
  applicationBarMounted: boolean;
}

const initialState: AppState = {
  page: "Dashboard",
  applicationBarBackButton: true,
  applicationBarMounted: false,
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<string>) => {
      state.page = action.payload;
    },
    setApplicationBarBackButton: (state, action: PayloadAction<boolean>) => {
      state.applicationBarBackButton = action.payload;
    },
    setApplicationBarMounted: (state, action: PayloadAction<boolean>) => {
      state.applicationBarMounted = action.payload;
    },
  },
});

export const { setPage, setApplicationBarMounted } = appSlice.actions;
export const selectPage = (state: RootState) => state.app.page;
export const selectApplicationBarBackButton = (state: RootState) =>
  state.app.applicationBarBackButton;
export const selectApplicationBarMounted = (state: RootState) =>
  state.app.applicationBarMounted;

export default appSlice.reducer;
