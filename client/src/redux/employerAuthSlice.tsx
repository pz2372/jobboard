import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from 'axiosInstance';

interface EmployerAuthState {
    employer: EmployerLoginResponse["employer"] | null;
    token: string | null;
    loading: boolean;
    error: string | null;
  }
  
  const persistedEmployerAuthState = localStorage.getItem("employerAuthState");
  
  const initialState: EmployerAuthState = persistedEmployerAuthState
    ? JSON.parse(persistedEmployerAuthState)
    : {
        employer: null,
        token: null,
        loading: false,
        error: null,
      };
  
  // Define the login payload type
  interface EmployerLoginPayload {
    email: string;
    password: string;
  }
  
  interface EmployerLoginResponse {
    token: string;
    employer: any; // Replace `any` with a specific Employer type if available
  }
  
  // Async Thunks for signup
  export const employerSignup = createAsyncThunk<
    EmployerLoginResponse,
    { email: string; password: string; companyName: string },
    { rejectValue: string }
  >("employerAuth/signup", async ({ email, password, companyName }, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/employer/signup", {
        email,
        password,
        companyName,
      });

      return response.data;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Employer signup failed. Please try again.";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  });
  
  // Async Thunks for login
  export const employerLogin = createAsyncThunk<
    EmployerLoginResponse,
    EmployerLoginPayload,
    { rejectValue: string }
  >("employerAuth/login", async ({ email, password }, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/employer/login", {
        email,
        password,
      });
    
      return response.data;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Employer login failed. Please try again.";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  });
    
  // Employer auth slice
  export const employerAuthSlice = createSlice({
    name: "employerAuth",
    initialState,
    reducers: {
      employerLogout: (state) => {
        state.employer = null;
        state.token = null;
        localStorage.removeItem("employerAuthState");
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(employerLogin.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(employerLogin.fulfilled, (state, action) => {
          state.loading = false;
          state.token = action.payload.token;
          state.employer = action.payload.employer;
    
          localStorage.setItem(
            "employerAuthState",
            JSON.stringify({
              token: action.payload.token,
              employer: action.payload.employer,
            })
          );
        })
        .addCase(employerLogin.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || "Unknown error occurred during login.";
        })
        .addCase(employerSignup.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(employerSignup.fulfilled, (state, action) => {
          state.loading = false;
          state.token = action.payload.token;
          state.employer = action.payload.employer;
  
          localStorage.setItem(
            "employerAuthState",
            JSON.stringify({
              token: action.payload.token,
              employer: action.payload.employer,
            })
          );
        })
        .addCase(employerSignup.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || "Unknown error occurred during signup.";
        });
    },
  });
  
  // Export logout action and reducer
  export const { employerLogout } = employerAuthSlice.actions;
  export default employerAuthSlice.reducer;
  