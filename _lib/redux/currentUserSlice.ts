import { createSlice, PayloadAction } from "@reduxjs/toolkit";
interface CurrentUserState {
  name: string | null | undefined;
  email: string | null | undefined;
}
const initialState: CurrentUserState = {
  name: null,
  email: null,
};
export const currentUserSlice = createSlice({
  name: "currentUser",
  initialState,
  reducers: {
    userLogin: (state, action: PayloadAction<{email: string, name: string}>) => {
      state.email = action.payload.email,
      state.name = action.payload.name
    },
    userLogout: (state) => {
      state.email = null,
      state.name = null
    }
  },
});

export const { userLogin, userLogout } = currentUserSlice.actions;
export default currentUserSlice.reducer;
