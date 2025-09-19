/**
 * Service for managing employer-related data in localStorage
 * Only stores non-sensitive operational data (jobs, applications)
 * Does NOT store sensitive employer personal data or subscription information
 */

interface EmployerLocalStorageData {
  jobs: any[];
  applications: any[];
  lastUpdated: string;
}

class EmployerLocalStorageService {
  private readonly STORAGE_KEY = 'employer_data';
  private readonly EXPIRY_HOURS = 24; // Data expires after 24 hours

  /**
   * Save employer data to localStorage (only non-sensitive data)
   */
  private saveEmployerData(data: Partial<EmployerLocalStorageData>): void {
    try {
      const existingData = this.getEmployerData();
      const updatedData: EmployerLocalStorageData = {
        ...existingData,
        ...data,
        lastUpdated: new Date().toISOString(),
      };
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedData));
      console.log('✅ Employer operational data saved to localStorage:', Object.keys(data));
      console.log('📊 Updated data structure:', {
        jobs: `${updatedData.jobs?.length || 0} jobs`,
        applications: `${updatedData.applications?.length || 0} applications`,
        lastUpdated: updatedData.lastUpdated
      });
    } catch (error) {
      console.error('❌ Error saving employer data to localStorage:', error);
    }
  }

  /**
   * Get employer data from localStorage
   */
  getEmployerData(): EmployerLocalStorageData {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (!data) {
        return this.getEmptyData();
      }

      const parsedData: EmployerLocalStorageData = JSON.parse(data);
      
      // Check if data has expired
      if (this.isDataExpired(parsedData.lastUpdated)) {
        console.log('Employer data expired, clearing localStorage');
        this.clearEmployerData();
        return this.getEmptyData();
      }

      return parsedData;
    } catch (error) {
      console.error('Error getting employer data from localStorage:', error);
      return this.getEmptyData();
    }
  }

  /**
   * Get jobs from localStorage
   */
  getJobs(): any[] {
    return this.getEmployerData().jobs || [];
  }

  /**
   * Update jobs in localStorage
   */
  updateJobs(jobs: any[]): void {
    this.saveEmployerData({ jobs });
  }

  /**
   * Get applications from localStorage
   */
  getApplications(): any[] {
    return this.getEmployerData().applications || [];
  }

  /**
   * Update applications in localStorage
   */
  updateApplications(applications: any[]): void {
    this.saveEmployerData({ applications });
  }

  /**
   * Clear all employer data from localStorage
   */
  clearEmployerData(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      console.log('Employer data cleared from localStorage');
    } catch (error) {
      console.error('Error clearing employer data from localStorage:', error);
    }
  }

  /**
   * Check if stored data is valid and not expired
   */
  hasValidData(): boolean {
    const data = this.getEmployerData();
    return (data.jobs !== null || data.applications !== null) && !this.isDataExpired(data.lastUpdated);
  }

  /**
   * Get data age in hours
   */
  getDataAge(): number {
    const data = this.getEmployerData();
    if (!data.lastUpdated) return Infinity;
    
    const lastUpdated = new Date(data.lastUpdated).getTime();
    const now = Date.now();
    return (now - lastUpdated) / (1000 * 60 * 60); // Convert to hours
  }

  /**
   * Check if data has expired
   */
  private isDataExpired(lastUpdated: string): boolean {
    if (!lastUpdated) return true;
    
    const dataAge = this.getDataAge();
    return dataAge > this.EXPIRY_HOURS;
  }

  /**
   * Get empty data structure
   */
  private getEmptyData(): EmployerLocalStorageData {
    return {
      jobs: [],
      applications: [],
      lastUpdated: new Date().toISOString()
    };
  }

  /**
   * Log current storage status
   */
  logStorageStatus(): void {
    const data = this.getEmployerData();
    console.log('📊 Current localStorage status:', {
      jobs: data.jobs?.length || 0,
      applications: data.applications?.length || 0,
      dataAge: `${this.getDataAge().toFixed(1)} hours`,
      isValid: this.hasValidData(),
      lastUpdated: data.lastUpdated
    });
  }
}

// Export singleton instance
const employerLocalStorageService = new EmployerLocalStorageService();
export default employerLocalStorageService;
