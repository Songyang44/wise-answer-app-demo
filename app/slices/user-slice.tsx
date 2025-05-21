import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  isAuthenticated: boolean;
  user: {
    id: string;
    name: string;
    avatarUrl: string | null;  
  };
}

const initialState: UserState = {
  isAuthenticated: false,
  user: { 
    id: "0",
    name:"",
    avatarUrl: null,
  },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginSuccess: (
      state,
      action: PayloadAction<{ id: string; name:string; avatarUrl: string | null }>
    ) => {
      state.isAuthenticated = true;
      state.user = action.payload;  
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = initialState.user;  
    },
  },
});

export const { loginSuccess, logout } = userSlice.actions;
export default userSlice.reducer;