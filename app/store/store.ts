import { configureStore } from "@reduxjs/toolkit";
import createSlice from '../slices/create-slice';
import userSlice from '../slices/user-slice'

export const store=configureStore({
    reducer:{
        create:createSlice,
        user:userSlice,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;