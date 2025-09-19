import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import employerLocalStorageService from '../services/employerLocalStorageService';
import axiosInstance from '../axiosInstance';
import subscriptionService from '../services/subscriptionService';

export const useEmployerData = () => {
  const dispatch = useDispatch<AppDispatch>();
  const employer = useSelector((state: RootState) => state.employerAuth.employer);

  const refreshAllData = useCallback(async () => {
    if (!employer?.id) {
      throw new Error('No employer logged in');
    }

    try {
      console.log('Refreshing all employer data...');

      // Fetch jobs
      const jobsResponse = await axiosInstance.get(`/employerjobs/jobs/${employer.id}`);
      const jobsData = jobsResponse.data;
      employerLocalStorageService.updateJobs(jobsData);

      // Fetch applications
      const applicationsResponse = await axiosInstance.get(`/employerapplications/employerAppliedApplications/${employer.id}`);
      const applicationsData = applicationsResponse.data;
      employerLocalStorageService.updateApplications(applicationsData);

      // Fetch subscription data (keep in Redux state only, not localStorage)
      const subscriptionResponse = await subscriptionService.getCurrentSubscription(employer.id);
      const subscriptionData = subscriptionResponse.hasSubscription ? subscriptionResponse.subscription : null;
      
      // Note: Subscription data is NOT saved to localStorage for security reasons
      // It should be managed through Redux state or fetched fresh when needed

      console.log('All employer data refreshed. Jobs and applications saved to localStorage, subscription in memory only');
      return {
        jobs: jobsData,
        applications: applicationsData,
        subscription: subscriptionData
      };
    } catch (error) {
      console.error('Error refreshing employer data:', error);
      throw error;
    }
  }, [employer?.id]);

  const getCachedData = useCallback(() => {
    return employerLocalStorageService.getEmployerData();
  }, []);

  const clearAllData = useCallback(() => {
    employerLocalStorageService.clearEmployerData();
  }, []);

  const isDataFresh = useCallback(() => {
    return employerLocalStorageService.hasValidData() && employerLocalStorageService.getDataAge() < 1;
  }, []);

  const getDataAge = useCallback(() => {
    return employerLocalStorageService.getDataAge();
  }, []);

  return {
    employer,
    refreshAllData,
    getCachedData,
    clearAllData,
    isDataFresh,
    getDataAge,
    hasValidData: employerLocalStorageService.hasValidData()
  };
};

export default useEmployerData;
