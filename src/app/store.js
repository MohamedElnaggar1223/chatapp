import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";
import authSlice from "../features/auth/authSlice";
import displaySlice  from "../features/messages/displaySlice";

export const store = configureStore(
    {
        reducer: 
        {
            [apiSlice.reducerPath]: apiSlice.reducer,
            auth: authSlice,
            display: displaySlice
        },
        middleware: getDefaultMiddleware =>
            getDefaultMiddleware().concat(apiSlice.middleware),
        devTools: true
    })