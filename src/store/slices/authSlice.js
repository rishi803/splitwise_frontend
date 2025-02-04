import { createSlice } from '@reduxjs/toolkit';
import queryClient from '../../utils/queryClient';

const storedUser  = JSON.parse(localStorage.getItem('user'));


const handleAuthSuccess = (state, action) => {
  state.loading = false;
  state.isAuthenticated = true;
  state.user = action.payload.user;
  state.error = null;

  localStorage.setItem('accessToken', action.payload.accessToken);
  localStorage.setItem('user', JSON.stringify(action.payload.user));
};


const initialState = {
  user: storedUser ,
  isAuthenticated: !!storedUser ,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      handleAuthSuccess(state, action);
    },
    signupSuccess: (state, action) => {
      handleAuthSuccess(state, action);
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    signupFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');

      queryClient.invalidateQueries();
    },
    signupStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateUserProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('user', JSON.stringify(state.user));
    },
  },
});


export const { 
  loginStart, 
  loginSuccess, 
  loginFailure, 
  logout, 
  signupStart, 
  signupSuccess, 
  signupFailure, 
  updateUserProfile 
} = authSlice.actions;

export default authSlice.reducer;