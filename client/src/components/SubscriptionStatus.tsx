import React from 'react';
import useSubscription from '../hooks/useSubscription';
import { AlertCircle, CheckCircle, Clock, CreditCard } from 'lucide-react';

const SubscriptionStatus: React.FC = () => {
  const {
    subscription,
    hasSubscription,
    loading,
    error,
    isActive,
    planType,
    planName,
    features,
    limitations,
    isCanceling,
    getDaysUntilExpiry,
    hasFeature,
    getLimit,
    canCreateJob,
    isTokenExpiring,
    refreshToken
  } = useSubscription();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading subscription...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
          <span className="text-red-700">Error: {error}</span>
        </div>
      </div>
    );
  }

  if (!hasSubscription) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
          <span className="text-yellow-700">No active subscription found</span>
        </div>
      </div>
    );
  }

  const daysUntilExpiry = getDaysUntilExpiry();

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Subscription Status</h3>
        {isActive ? (
          <span className="flex items-center text-green-600">
            <CheckCircle className="h-5 w-5 mr-1" />
            Active
          </span>
        ) : (
          <span className="flex items-center text-red-600">
            <AlertCircle className="h-5 w-5 mr-1" />
            Inactive
          </span>
        )}
      </div>

      {/* Plan Information */}
      <div className="mb-4">
        <h4 className="font-medium text-gray-900 mb-2">Current Plan</h4>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold capitalize">{planName || planType}</span>
            {isCanceling && (
              <span className="text-sm text-orange-600 bg-orange-100 px-2 py-1 rounded">
                Canceling at period end
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Expiry Information */}
      {daysUntilExpiry !== null && (
        <div className="mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-1" />
            <span>
              {daysUntilExpiry > 0 
                ? `Expires in ${daysUntilExpiry} days`
                : 'Expired'
              }
            </span>
          </div>
        </div>
      )}

      {/* Token Warning */}
      {isTokenExpiring() && (
        <div className="mb-4 bg-orange-50 border border-orange-200 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-orange-700 text-sm">Session expiring soon</span>
            <button
              onClick={refreshToken}
              className="text-orange-600 hover:text-orange-800 text-sm underline"
            >
              Refresh
            </button>
          </div>
        </div>
      )}

      {/* Features */}
      <div className="mb-4">
        <h4 className="font-medium text-gray-900 mb-2">Plan Features</h4>
        <ul className="space-y-1">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center text-sm text-gray-600">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {/* Limitations */}
      <div className="mb-4">
        <h4 className="font-medium text-gray-900 mb-2">Current Limits</h4>
        <div className="space-y-2">
          {getLimit('maxActiveJobs') && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Max Active Jobs:</span>
              <span className="font-medium">{getLimit('maxActiveJobs')}</span>
            </div>
          )}
          {getLimit('maxJobPostsPerMonth') && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Job Posts per Month:</span>
              <span className="font-medium">{getLimit('maxJobPostsPerMonth')}</span>
            </div>
          )}
          {getLimit('jobDurationDays') && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Job Duration:</span>
              <span className="font-medium">{getLimit('jobDurationDays')} days</span>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="border-t pt-4">
        <div className="flex flex-wrap gap-2">
          <button
            disabled={!canCreateJob()}
            className={`px-3 py-2 rounded text-sm font-medium ${
              canCreateJob()
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            Create Job Post
          </button>
          
          {hasFeature('Priority support') && (
            <button className="px-3 py-2 bg-green-100 text-green-700 rounded text-sm font-medium hover:bg-green-200">
              Contact Priority Support
            </button>
          )}
          
          <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded text-sm font-medium hover:bg-gray-200">
            <CreditCard className="h-4 w-4 inline mr-1" />
            Manage Billing
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionStatus;
