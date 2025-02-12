import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from 'axiosInstance';

const savedUser = localStorage.getItem('user');
const savedToken = localStorage.getItem('token');

interface AuthState {
  user: any;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: savedUser ? JSON.parse(savedUser) : null,
  token: savedToken || null,
  loading: false,
  error: null,
};

export const login = createAsyncThunk('auth/login', async ({ email, password }: { email: string; password: string }, thunkAPI) => {
  try {
    const response = await axiosInstance.post('/user/login', { email, password });
    localStorage.setItem('token', response.data.token);
    return response.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Login failed');
  }
});


export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
