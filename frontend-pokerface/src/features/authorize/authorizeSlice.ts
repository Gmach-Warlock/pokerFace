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
  reducers: {},
});

export default authorizeSlice.reducer;
