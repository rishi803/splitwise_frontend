import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import pageReducer from "./slices/pageSlice";

const store= configureStore({
    reducer:{
        auth: authReducer,
        page: pageReducer,
    }
})

export default store;