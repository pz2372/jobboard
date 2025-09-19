import axiosInstance from '../axiosInstance';

class AuthService {
  async employerLogout(): Promise<void> {
    try {
      await axiosInstance.post('/employer/logout');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if the logout request fails, we should still clear local state
    }
  }
}

export const authService = new AuthService();
export default authService;
