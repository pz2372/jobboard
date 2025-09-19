import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Subscription plan types
export interface PlanLimitations {
  maxActiveJobs?: number;
  maxJobPostsPerMonth?: number;
  maxFeaturedJobsPerMonth?: number;
  analyticsLevel?: string;
  supportLevel?: string;
  jobDurationDays?: number;
}

export interface PlanDetails {
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  stripePriceId: {
    monthly: string;
    annual: string;
  };
  features: string[];
  limitations: PlanLimitations;
}

export interface SubscriptionData {
  id: number;
  employerId: number;
  planType: 'basic' | 'impact' | 'accelerate' | 'corporate';
  billingCycle: 'monthly' | 'annual';
  status: 'active' | 'inactive' | 'canceled' | 'past_due';
  stripeSubscriptionId: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  amount: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
  planDetails?: PlanDetails;
}

export interface SubscriptionState {
  subscription: SubscriptionData | null;
  subscriptionToken: string | null;
  hasSubscription: boolean;
  loading: boolean;
  error: string | null;
  tokenExpiration: number | null;
}

const initialState: SubscriptionState = {
  subscription: null,
  subscriptionToken: null,
  hasSubscription: false,
  loading: false,
  error: null,
  tokenExpiration: null,
};

// Async thunks
export const fetchCurrentSubscription = createAsyncThunk(
  'subscription/fetchCurrent',
  async (employerId: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/employer-subscriptions/${employerId}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to fetch subscription');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue('Network error while fetching subscription');
    }
  }
);

export const refreshSubscriptionToken = createAsyncThunk(
  'subscription/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/employer-subscriptions/refresh-token', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to refresh token');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue('Network error while refreshing token');
    }
  }
);

export const createSubscription = createAsyncThunk(
  'subscription/create',
  async (subscriptionData: { planType: string; billingCycle: string }, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/employer-subscriptions', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscriptionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to create subscription');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue('Network error while creating subscription');
    }
  }
);

export const cancelSubscription = createAsyncThunk(
  'subscription/cancel',
  async (employerId: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/employer-subscriptions/${employerId}/cancel`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to cancel subscription');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue('Network error while canceling subscription');
    }
  }
);

// Helper function to decode JWT and get expiration
const getTokenExpiration = (token: string): number | null => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000; // Convert to milliseconds
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

// Helper function to check if token is expired or will expire soon
const isTokenExpired = (expiration: number | null): boolean => {
  if (!expiration) return true;
  const now = Date.now();
  const bufferTime = 5 * 60 * 1000; // 5 minutes buffer
  return expiration - bufferTime <= now;
};

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    clearSubscription: (state) => {
      state.subscription = null;
      state.subscriptionToken = null;
      state.hasSubscription = false;
      state.tokenExpiration = null;
      state.error = null;
    },
    setSubscriptionToken: (state, action: PayloadAction<string>) => {
      state.subscriptionToken = action.payload;
      state.tokenExpiration = getTokenExpiration(action.payload);
    },
    clearError: (state) => {
      state.error = null;
    },
    checkTokenExpiration: (state) => {
      if (state.tokenExpiration && isTokenExpired(state.tokenExpiration)) {
        state.subscriptionToken = null;
        state.tokenExpiration = null;
        state.error = 'Subscription token expired';
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch current subscription
      .addCase(fetchCurrentSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentSubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.subscription = action.payload.subscription;
        state.hasSubscription = action.payload.hasSubscription;
        if (action.payload.subscriptionToken) {
          state.subscriptionToken = action.payload.subscriptionToken;
          state.tokenExpiration = getTokenExpiration(action.payload.subscriptionToken);
        }
      })
      .addCase(fetchCurrentSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.hasSubscription = false;
      })
      
      // Refresh subscription token
      .addCase(refreshSubscriptionToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshSubscriptionToken.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.subscriptionToken) {
          state.subscriptionToken = action.payload.subscriptionToken;
          state.tokenExpiration = getTokenExpiration(action.payload.subscriptionToken);
        }
      })
      .addCase(refreshSubscriptionToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Create subscription
      .addCase(createSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.subscription = action.payload.subscription;
        state.hasSubscription = true;
        if (action.payload.subscriptionToken) {
          state.subscriptionToken = action.payload.subscriptionToken;
          state.tokenExpiration = getTokenExpiration(action.payload.subscriptionToken);
        }
      })
      .addCase(createSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Cancel subscription
      .addCase(cancelSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelSubscription.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.subscription) {
          state.subscription = action.payload.subscription;
        }
      })
      .addCase(cancelSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { 
  clearSubscription, 
  setSubscriptionToken, 
  clearError, 
  checkTokenExpiration 
} = subscriptionSlice.actions;

// Selectors
export const selectSubscription = (state: { subscription: SubscriptionState }) => state.subscription.subscription;
export const selectSubscriptionToken = (state: { subscription: SubscriptionState }) => state.subscription.subscriptionToken;
export const selectHasSubscription = (state: { subscription: SubscriptionState }) => state.subscription.hasSubscription;
export const selectSubscriptionLoading = (state: { subscription: SubscriptionState }) => state.subscription.loading;
export const selectSubscriptionError = (state: { subscription: SubscriptionState }) => state.subscription.error;
export const selectTokenExpiration = (state: { subscription: SubscriptionState }) => state.subscription.tokenExpiration;

// Utility selectors
export const selectIsSubscriptionActive = (state: { subscription: SubscriptionState }) => {
  const subscription = state.subscription.subscription;
  return subscription?.status === 'active' && !isTokenExpired(state.subscription.tokenExpiration);
};

export const selectSubscriptionFeatures = (state: { subscription: SubscriptionState }) => {
  return state.subscription.subscription?.planDetails?.features || [];
};

export const selectSubscriptionLimitations = (state: { subscription: SubscriptionState }) => {
  return state.subscription.subscription?.planDetails?.limitations || {};
};

export default subscriptionSlice.reducer;
