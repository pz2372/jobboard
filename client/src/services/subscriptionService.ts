import axiosInstance from '../axiosInstance';

export interface SubscriptionPlan {
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  features: string[];
  limitations: {
    maxActiveJobs?: number;
    maxJobPostsPerMonth?: number;
    maxFeaturedJobsPerMonth?: number;
    analyticsLevel?: string;
    supportLevel?: string;
    jobDurationDays?: number;
  };
}

export interface SubscriptionData {
  id: number;
  employerId: number;
  planType: 'basic' | 'impact' | 'accelerate' | 'corporate';
  billingCycle: 'monthly' | 'annual';
  status: 'active' | 'cancelled' | 'past_due' | 'trialing' | 'incomplete';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  amount: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
  planDetails?: SubscriptionPlan;
}

export interface SubscriptionResponse {
  success: boolean;
  subscription: SubscriptionData;
  subscriptionToken?: string;
  hasSubscription: boolean;
  message?: string;
}

export interface PlansResponse {
  success: boolean;
  plans: Record<string, SubscriptionPlan>;
}

class SubscriptionService {
  private baseURL = '/employer-subscriptions';
  private tokenKey = 'subscriptionToken';
  private subscriptionKey = 'subscriptionData';

  // Token management methods
  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  removeToken(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.subscriptionKey);
  }

  // Subscription data management
  setSubscriptionData(subscription: SubscriptionData): void {
    localStorage.setItem(this.subscriptionKey, JSON.stringify(subscription));
  }

  getSubscriptionData(): SubscriptionData | null {
    const data = localStorage.getItem(this.subscriptionKey);
    return data ? JSON.parse(data) : null;
  }

  // Token validation
  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000; // Convert to milliseconds
      const now = Date.now();
      const bufferTime = 5 * 60 * 1000; // 5 minutes buffer
      
      return exp - bufferTime > now;
    } catch (error) {
      console.error('Error validating subscription token:', error);
      return false;
    }
  }

  // Decode token to get subscription info
  decodeToken(): any | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (error) {
      console.error('Error decoding subscription token:', error);
      return null;
    }
  }

  // Get all available plans
  async getPlans(): Promise<PlansResponse> {
    const response = await axiosInstance.get(`${this.baseURL}/plans`);
    return response.data;
  }

  // Get current subscription for an employer
  async getCurrentSubscription(employerId: number): Promise<SubscriptionResponse> {
    const response = await axiosInstance.get(`${this.baseURL}/${employerId}`);
    
    // Store token and subscription data if received
    if (response.data.subscriptionToken) {
      this.setToken(response.data.subscriptionToken);
    }
    if (response.data.subscription) {
      this.setSubscriptionData(response.data.subscription);
    }
    
    return response.data;
  }

  // Refresh subscription token
  async refreshToken(): Promise<{ success: boolean; subscriptionToken?: string; message?: string }> {
    const response = await axiosInstance.post(`${this.baseURL}/refresh-token`);
    
    if (response.data.subscriptionToken) {
      this.setToken(response.data.subscriptionToken);
    }
    
    return response.data;
  }

  // Create new subscription
  async createSubscription(subscriptionData: {
    employerId: number;
    planType: string;
    billingCycle: 'monthly' | 'annual';
    stripeSubscriptionId?: string;
    stripeCustomerId?: string;
    stripePriceId?: string;
  }): Promise<SubscriptionResponse> {
    const response = await axiosInstance.post(this.baseURL, subscriptionData);
    
    // Store token and subscription data if received
    if (response.data.subscriptionToken) {
      this.setToken(response.data.subscriptionToken);
    }
    if (response.data.subscription) {
      this.setSubscriptionData(response.data.subscription);
    }
    
    return response.data;
  }

  // Update subscription
  async updateSubscription(employerId: number, updateData: {
    planType?: string;
    billingCycle?: 'monthly' | 'annual';
    status?: string;
    stripeSubscriptionId?: string;
    stripePriceId?: string;
    cancelAtPeriodEnd?: boolean;
  }): Promise<SubscriptionResponse> {
    const response = await axiosInstance.put(`${this.baseURL}/${employerId}`, updateData);
    
    // Update stored subscription data if received
    if (response.data.subscription) {
      this.setSubscriptionData(response.data.subscription);
    }
    
    return response.data;
  }

  // Cancel subscription
  async cancelSubscription(employerId: number, immediate = false): Promise<SubscriptionResponse> {
    const response = await axiosInstance.patch(`${this.baseURL}/${employerId}/cancel`, {
      immediate
    });
    
    // Update stored subscription data if received
    if (response.data.subscription) {
      this.setSubscriptionData(response.data.subscription);
    }
    
    return response.data;
  }

  // Reactivate subscription
  async reactivateSubscription(employerId: number): Promise<SubscriptionResponse> {
    const response = await axiosInstance.patch(`${this.baseURL}/${employerId}/reactivate`);
    
    // Update stored subscription data if received
    if (response.data.subscription) {
      this.setSubscriptionData(response.data.subscription);
    }
    
    return response.data;
  }

  // Get subscription history
  async getSubscriptionHistory(employerId: number): Promise<{
    success: boolean;
    history: SubscriptionData[];
  }> {
    const response = await axiosInstance.get(`${this.baseURL}/${employerId}/history`);
    return response.data;
  }

  // Utility method to check if user has active subscription
  hasActiveSubscription(): boolean {
    const tokenData = this.decodeToken();
    const subscription = this.getSubscriptionData();
    
    if (!tokenData || !subscription) return false;
    
    // Check token validity and subscription status
    return this.isTokenValid() && 
           tokenData.status === 'active' &&
           subscription.status === 'active';
  }

  // Check if user has specific feature
  hasFeature(feature: string): boolean {
    const tokenData = this.decodeToken();
    if (!tokenData || !tokenData.features) return false;
    
    return tokenData.features.includes(feature);
  }

  // Get subscription limitations
  getLimitations(): any {
    const tokenData = this.decodeToken();
    return tokenData?.limitations || {};
  }

  // Logout - clear all subscription data
  logout(): void {
    this.removeToken();
  }
}

export const subscriptionService = new SubscriptionService();
export default subscriptionService;
