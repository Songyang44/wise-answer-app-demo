import { configureStore } from "@reduxjs/toolkit";
import createSlice from '../slices/create-slice';
import userSlice from '../slices/user-slice';
import workSpaceSlice from '../slices/workspace-slice'

export const store=configureStore({
    reducer:{
        create:createSlice,
        user:userSlice,
        workspace:workSpaceSlice
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;