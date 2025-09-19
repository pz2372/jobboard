import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchCurrentSubscription,
  refreshSubscriptionToken,
  clearSubscription,
  checkTokenExpiration,
  selectSubscription,
  selectSubscriptionToken,
  selectHasSubscription,
  selectSubscriptionLoading,
  selectSubscriptionError,
  selectIsSubscriptionActive,
  selectSubscriptionFeatures,
  selectSubscriptionLimitations,
  selectTokenExpiration
} from '../redux/subscriptionSlice';
import { AppDispatch, RootState } from '../redux/store';
import { subscriptionService } from '../services/subscriptionService';

export const useSubscription = () => {
  const dispatch = useDispatch<AppDispatch>();
  const employer = useSelector((state: RootState) => state.employerAuth.employer);
  const employerLoading = useSelector((state: RootState) => state.employerAuth.loading);
  
  const subscription = useSelector(selectSubscription);
  const subscriptionToken = useSelector(selectSubscriptionToken);
  const hasSubscription = useSelector(selectHasSubscription);
  const loading = useSelector(selectSubscriptionLoading);
  const error = useSelector(selectSubscriptionError);
  const isActive = useSelector(selectIsSubscriptionActive);
  const features = useSelector(selectSubscriptionFeatures);
  const limitations = useSelector(selectSubscriptionLimitations);
  const tokenExpiration = useSelector(selectTokenExpiration);

  // Auto-fetch subscription when employer logs in
  useEffect(() => {
    if (employer?.id && !subscription && !employerLoading) {
      dispatch(fetchCurrentSubscription(employer.id));
    }
  }, [employer?.id, subscription, employerLoading, dispatch]);

  // Auto token expiration check
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(checkTokenExpiration());
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [dispatch]);

  // Auto refresh token when it's about to expire
  useEffect(() => {
    if (tokenExpiration) {
      const now = Date.now();
      const timeUntilExpiry = tokenExpiration - now;
      const refreshTime = 10 * 60 * 1000; // 10 minutes before expiry

      if (timeUntilExpiry > 0 && timeUntilExpiry <= refreshTime) {
        dispatch(refreshSubscriptionToken());
      }
    }
  }, [tokenExpiration, dispatch]);

  // Clear subscription on logout
  useEffect(() => {
    if (!employer) {
      dispatch(clearSubscription());
      subscriptionService.logout();
    }
  }, [employer, dispatch]);

  // Methods
  const refreshToken = () => {
    return dispatch(refreshSubscriptionToken());
  };

  const fetchSubscription = () => {
    if (employer?.id) {
      return dispatch(fetchCurrentSubscription(employer.id));
    }
  };

  const clearSubscriptionData = () => {
    dispatch(clearSubscription());
    subscriptionService.logout();
  };

  // Utility functions
  const hasFeature = (feature: string): boolean => {
    return features.includes(feature);
  };

  const getLimit = (limitType: string): number | undefined => {
    return limitations[limitType as keyof typeof limitations] as number | undefined;
  };

  const canCreateJob = (): boolean => {
    if (!isActive) return false;
    const maxJobs = getLimit('maxActiveJobs');
    return maxJobs === undefined || maxJobs > 0; // Assume we check current job count elsewhere
  };

  const isTokenExpiring = (): boolean => {
    if (!tokenExpiration) return false;
    const now = Date.now();
    const warningTime = 15 * 60 * 1000; // 15 minutes
    return tokenExpiration - now <= warningTime;
  };

  const getDaysUntilExpiry = (): number | null => {
    if (!subscription?.currentPeriodEnd) return null;
    const endDate = new Date(subscription.currentPeriodEnd);
    const now = new Date();
    const diffTime = endDate.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return {
    // State
    subscription,
    subscriptionToken,
    hasSubscription,
    loading,
    error,
    isActive,
    features,
    limitations,
    tokenExpiration,

    // Methods
    refreshToken,
    fetchSubscription,
    clearSubscriptionData,

    // Utility functions
    hasFeature,
    getLimit,
    canCreateJob,
    isTokenExpiring,
    getDaysUntilExpiry,

    // Computed properties
    planType: subscription?.planType,
    planName: subscription?.planDetails?.name,
    isBasicPlan: subscription?.planType === 'basic',
    isImpactPlan: subscription?.planType === 'impact',
    isAcceleratePlan: subscription?.planType === 'accelerate',
    isCorporatePlan: subscription?.planType === 'corporate',
    isCanceling: subscription?.cancelAtPeriodEnd || false,
  };
};

export default useSubscription;
