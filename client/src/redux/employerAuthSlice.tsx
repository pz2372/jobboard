import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "axiosInstance";
import { authService } from "../services/authService";
import employerLocalStorageService from "../services/employerLocalStorageService";

interface EmployerAuthState {
  employer: EmployerLoginResponse["employer"] | null;
  loading: boolean;
  error: string | null;
}

const initialState: EmployerAuthState = {
  employer: null,
  loading: false,
  error: null,
};

interface EmployerLoginPayload {
  email: string;
  password: string;
}

interface EmployerLoginResponse {
  employer: any;
  // Remove employerToken field since we're using httpOnly cookies
}

export const employerSignup = createAsyncThunk<
  EmployerLoginResponse,
  {
    email: string;
    password: string;
    companyName: string;
    phone: string;
    website: string;
    address: string;
    city: string;
    state: string;
    taxNumber: string;
  },
  { rejectValue: string }
>("employerAuth/signup", async (formData, thunkAPI) => {
  try {
    const response = await axiosInstance.post("/employer/signup", formData);
    return response.data;
  } catch (err: any) {
    const errorMessage =
      err.response?.data?.message ||
      "Employer signup failed. Please try again.";
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

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

export const employerLogout = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>("employerAuth/logout", async (_, thunkAPI) => {
  try {
    await authService.employerLogout();
  } catch (err: any) {
    const errorMessage =
      err.response?.data?.message || "Logout failed. Please try again.";
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

export const checkEmployerAuth = createAsyncThunk<
  EmployerLoginResponse,
  void,
  { rejectValue: string }
>("employerAuth/checkAuth", async (_, thunkAPI) => {
  try {
    console.log("employerAuthSlice: Making request to /employer/me");
    const response = await axiosInstance.get("/employer/me");
    console.log("employerAuthSlice: Response received:", response.data);
    return response.data;
  } catch (err: any) {
    console.error("employerAuthSlice: Auth check failed:", err.response?.status, err.response?.data);
    const errorMessage =
      err.response?.data?.message || "Authentication check failed.";
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

export const employerAuthSlice = createSlice({
  name: "employerAuth",
  initialState,
  reducers: {
    clearEmployer: (state) => {
      state.employer = null;
      // Clear localStorage when clearing employer
      employerLocalStorageService.clearEmployerData();
    },
    setEmployer: (state, action) => {
      state.employer = action.payload;
      // Note: Employer data is not saved to localStorage for security reasons
      // Only httpOnly cookies are used for authentication persistence
    },
    // Note: Employer data restoration now relies on server auth check via httpOnly cookies
    // localStorage only contains non-sensitive operational data (jobs, applications)
  },
  extraReducers: (builder) => {
    builder
      .addCase(employerLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(employerLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.employer = action.payload.employer;
        // Note: Employer data is not saved to localStorage for security reasons
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
        state.employer = action.payload.employer;
        // Note: Employer data is not saved to localStorage for security reasons
      })
      .addCase(employerSignup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unknown error occurred during signup.";
      })
      .addCase(employerLogout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(employerLogout.fulfilled, (state) => {
        state.loading = false;
        state.employer = null;
        state.error = null;
        // Clear localStorage on logout
        employerLocalStorageService.clearEmployerData();
      })
      .addCase(employerLogout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Logout failed.";
        // Still clear employer state and localStorage even if logout request failed
        state.employer = null;
        employerLocalStorageService.clearEmployerData();
      })
      .addCase(checkEmployerAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkEmployerAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.employer = action.payload.employer;
        state.error = null;
        // Note: Employer data is not saved to localStorage for security reasons
      })
      .addCase(checkEmployerAuth.rejected, (state, action) => {
        state.loading = false;
        state.employer = null;
        // Don't set error for auth check failures as they're expected when not logged in
        state.error = null;
      });
  },
});

export const { clearEmployer, setEmployer } = employerAuthSlice.actions;
export default employerAuthSlice.reducer;
