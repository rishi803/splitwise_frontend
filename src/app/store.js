// store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
import groupReducer from '../features/groupSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    groups: groupReducer,
  },
});

export default store;
