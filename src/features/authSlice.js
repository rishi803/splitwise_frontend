import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
//   withCredentials: true 
});

// Axios interceptors for automatic token refresh
// api.interceptors.request.use(
//   async (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;


//     //to avoid issue when user enters wrong credentials 

//     if (originalRequest.url.includes("/auth/")) {
//       return Promise.reject(error);
//     }

//     if (error.response?.status === 401 && !originalRequest._retry) {
//         originalRequest._retry = true;
      
//         console.log('Token expired. Attempting to refresh token...');
//         try {
//           const response = await api.post("/auth/refresh");
//           console.log('Refresh successful. New token:', response.data.token);
      
//           localStorage.setItem("token", response.data.token);
//           originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
//           return api(originalRequest);
//         } catch (err) {
//           console.error('Refresh failed. Logging out user...');
//           localStorage.removeItem("token");
//           store.dispatch(logout());
//           window.location.href = "/login";
//           return Promise.reject(err);
//         }
//       }
      

//     console.log(error);
//     return Promise.reject(error);
//   }
// );

api.interceptors.request.use(
    async (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
  
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }
  );

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      console.log(credentials);
      const response = await api.post("/auth/login", credentials);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async (userInfo, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/signup", userInfo);
      localStorage.setItem("token", response.data.token);
      //   console.log(response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Signup failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token"),
    isAuthenticated: localStorage.getItem("isAuthenticated") || false,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("isAuthenticated");
    },

    clearError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = (action.payload.user);
        state.isAuthenticated = true;
        localStorage.setItem("isAuthenticated", true);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = (action.payload.user);
        state.isAuthenticated = false;
        localStorage.removeItem("isAuthenticated");
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
