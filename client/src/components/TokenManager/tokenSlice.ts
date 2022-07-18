import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export interface TokenState {
  value: string;
  username: string;
  loggedIn: boolean;
  loaded: boolean;
}

const initialState: TokenState = {
  value: "",
  username: "",
  loggedIn: false,
  loaded: false,
};

export const tokenSlice = createSlice({
  name: "token",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
      localStorage.setItem("token", action.payload);
    },
    setUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
      localStorage.setItem("username", action.payload);
    },
    setLoaded: (state, action: PayloadAction<boolean>) => {
      state.loaded = true;
    },
    setLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.loggedIn = action.payload;
      state.loaded = true;
    },
    setLoggedOut: (state) => {
      state.loggedIn = false;
      state.loaded = true;
      state.value = "";
    },
  },
});

export const { setToken, setLoggedIn, setLoggedOut, setUsername, setLoaded } =
  tokenSlice.actions;

export const selectToken = (state: RootState) => state.token.value;
export const selectUsername = (state: RootState) => state.token.username;
export const selectTokenLoaded = (state: RootState) => state.token.loaded;
export const selectLoggedIn = (state: RootState) => state.token.loggedIn;

export default tokenSlice.reducer;
