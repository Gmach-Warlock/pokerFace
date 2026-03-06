import { createSlice } from "@reduxjs/toolkit";

interface AuthorizeInterface {
  authorized: boolean;
  username: string;
  email: string;
  password: string;
}

const initialAuthorizeState: AuthorizeInterface = {
  authorized: true,
  username: "",
  email: "",
  password: "",
};

const authorizeSlice = createSlice({
  name: "authorize",
  initialState: initialAuthorizeState,
  reducers: {
    createUser: (state, action) => {
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.password = action.payload.password;
      state.authorized = true;
    },
  },
});

export const { createUser } = authorizeSlice.actions;
export default authorizeSlice.reducer;
