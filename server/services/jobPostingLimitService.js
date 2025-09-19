const { EmployerSubscription } = require('../models');
const { Op } = require('sequelize');

// Plan configurations for job posting limits
const PLAN_LIMITS = {
  basic: { maxJobPostsPerMonth: 1 },
  impact: { maxJobPostsPerMonth: 2 },
  accelerate: { maxJobPostsPerMonth: 3 },
  corporate: { maxJobPostsPerMonth: 8 }
};

class JobPostingLimitService {
  
  // Check if employer can post a new job
  static async canPostJob(employerId) {
    try {
      const subscription = await EmployerSubscription.findOne({
        where: { 
          employerId,
          status: 'active'
        }
      });

      if (!subscription) {
        return {
          canPost: false,
          reason: 'NO_SUBSCRIPTION',
          remainingPosts: 0,
          resetDate: null
        };
      }

      // Reset counter if it's a new month
      await this.resetCounterIfNewMonth(subscription);

      const planLimits = PLAN_LIMITS[subscription.planType];
      if (!planLimits) {
        return {
          canPost: false,
          reason: 'INVALID_PLAN',
          remainingPosts: 0,
          resetDate: null
        };
      }

      const remainingPosts = planLimits.maxJobPostsPerMonth - subscription.jobPostsThisMonth;
      const nextResetDate = this.getNextResetDate(subscription.lastJobPostResetDate);

      return {
        canPost: remainingPosts > 0,
        reason: remainingPosts > 0 ? 'OK' : 'MONTHLY_LIMIT_REACHED',
        remainingPosts: Math.max(0, remainingPosts),
        maxPostsPerMonth: planLimits.maxJobPostsPerMonth,
        usedPostsThisMonth: subscription.jobPostsThisMonth,
        resetDate: nextResetDate,
        planType: subscription.planType
      };
    } catch (error) {
      console.error('Error checking job posting limits:', error);
      return {
        canPost: false,
        reason: 'ERROR',
        remainingPosts: 0,
        resetDate: null
      };
    }
  }

  // Increment job posting counter when a job is posted
  static async incrementJobPostCounter(employerId) {
    try {
      const subscription = await EmployerSubscription.findOne({
        where: { 
          employerId,
          status: 'active'
        }
      });

      if (!subscription) {
        throw new Error('No active subscription found');
      }

      // Reset counter if it's a new month
      await this.resetCounterIfNewMonth(subscription);

      // Increment counter
      await subscription.increment('jobPostsThisMonth');
      
      // Update last reset date if this is the first post of the month
      if (subscription.jobPostsThisMonth === 0) {
        await subscription.update({
          lastJobPostResetDate: new Date()
        });
      }

      return {
        success: true,
        newCount: subscription.jobPostsThisMonth + 1
      };
    } catch (error) {
      console.error('Error incrementing job post counter:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get job posting usage for an employer
  static async getJobPostingUsage(employerId) {
    try {
      const subscription = await EmployerSubscription.findOne({
        where: { 
          employerId,
          status: 'active'
        }
      });

      if (!subscription) {
        return {
          hasSubscription: false,
          usedPostsThisMonth: 0,
          maxPostsPerMonth: 0,
          remainingPosts: 0,
          resetDate: null,
          planType: null
        };
      }

      // Reset counter if it's a new month
      await this.resetCounterIfNewMonth(subscription);

      const planLimits = PLAN_LIMITS[subscription.planType] || { maxJobPostsPerMonth: 0 };
      const remainingPosts = planLimits.maxJobPostsPerMonth - subscription.jobPostsThisMonth;
      const nextResetDate = this.getNextResetDate(subscription.lastJobPostResetDate);

      return {
        hasSubscription: true,
        usedPostsThisMonth: subscription.jobPostsThisMonth,
        maxPostsPerMonth: planLimits.maxJobPostsPerMonth,
        remainingPosts: Math.max(0, remainingPosts),
        resetDate: nextResetDate,
        planType: subscription.planType
      };
    } catch (error) {
      console.error('Error getting job posting usage:', error);
      return {
        hasSubscription: false,
        usedPostsThisMonth: 0,
        maxPostsPerMonth: 0,
        remainingPosts: 0,
        resetDate: null,
        planType: null
      };
    }
  }

  // Reset counter if it's a new month
  static async resetCounterIfNewMonth(subscription) {
    const now = new Date();
    const lastReset = subscription.lastJobPostResetDate;

    // If no reset date set, or it's a new month, reset the counter
    if (!lastReset || this.isNewMonth(lastReset, now)) {
      await subscription.update({
        jobPostsThisMonth: 0,
        lastJobPostResetDate: new Date(now.getFullYear(), now.getMonth(), 1) // First day of current month
      });
      
      // Reload the subscription object to reflect the changes
      await subscription.reload();
    }
  }

  // Check if it's a new month compared to last reset
  static isNewMonth(lastResetDate, currentDate) {
    const lastReset = new Date(lastResetDate);
    const current = new Date(currentDate);
    
    return lastReset.getFullYear() !== current.getFullYear() || 
           lastReset.getMonth() !== current.getMonth();
  }

  // Get the next reset date (first day of next month)
  static getNextResetDate(lastResetDate) {
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    return nextMonth;
  }

  // Get plan limits for a specific plan type
  static getPlanLimits(planType) {
    return PLAN_LIMITS[planType] || { maxJobPostsPerMonth: 0 };
  }

  // Reset all counters (useful for testing or admin functions)
  static async resetAllCounters() {
    try {
      await EmployerSubscription.update(
        {
          jobPostsThisMonth: 0,
          lastJobPostResetDate: new Date()
        },
        {
          where: {
            status: 'active'
          }
        }
      );
      return { success: true };
    } catch (error) {
      console.error('Error resetting all counters:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = JobPostingLimitService;
