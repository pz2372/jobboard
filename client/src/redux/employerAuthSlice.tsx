import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "axiosInstance";

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

interface EmployerLoginPayload {
  email: string;
  password: string;
}

interface EmployerLoginResponse {
  token: string;
  employer: any;
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

export const { employerLogout } = employerAuthSlice.actions;
export default employerAuthSlice.reducer;
