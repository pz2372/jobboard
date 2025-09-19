import React from 'react';
import { XIcon, Crown, ArrowRight } from 'lucide-react';

interface SubscriptionRestrictionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  currentPlan: string;
  activeJobCount: number;
  maxJobs: number;
  isFreePlan?: boolean;
}

const SubscriptionRestrictionsModal: React.FC<SubscriptionRestrictionsModalProps> = ({
  isOpen,
  onClose,
  onUpgrade,
  currentPlan,
  activeJobCount,
  maxJobs,
  isFreePlan = false
}) => {
  if (!isOpen) return null;

  const planLimits = {
    free: { max: 0, name: 'Free' },
    basic: { max: 1, name: 'Basic' },
    impact: { max: 2, name: 'Impact' },
    accelerate: { max: 3, name: 'Accelerate' },
    corporate: { max: 8, name: 'Corporate' }
  };

  const nextPlan = currentPlan === 'free' || !currentPlan ? 'basic' :
                   currentPlan === 'basic' ? 'impact' :
                   currentPlan === 'impact' ? 'accelerate' :
                   currentPlan === 'accelerate' ? 'corporate' : null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full relative">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XIcon className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Crown className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {isFreePlan ? 'Upgrade Required' : 'Job Limit Reached'}
              </h2>
              <p className="text-sm text-gray-600">
                {currentPlan ? `${planLimits[currentPlan as keyof typeof planLimits]?.name || currentPlan} Plan` : 'No active plan'}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {isFreePlan ? (
            <div className="text-center">
              <p className="text-gray-700 mb-6">
                Upgrade today to find your best employee.
              </p>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-gray-700 mb-4">
                You've reached the maximum number of active job postings for your current plan.
              </p>
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Active Jobs:</span>
                  <span className="font-medium text-gray-900">{activeJobCount} / {maxJobs}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-orange-500 h-2 rounded-full" 
                    style={{ width: `${Math.min((activeJobCount / maxJobs) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
              
              {nextPlan && (
                <div className="bg-green-50 rounded-lg p-4 mb-6">
                  <h3 className="font-medium text-green-900 mb-2">
                    Upgrade to {planLimits[nextPlan as keyof typeof planLimits]?.name} Plan:
                  </h3>
                  <p className="text-sm text-green-800">
                    Get {planLimits[nextPlan as keyof typeof planLimits]?.max} active job postings
                    {nextPlan === 'impact' && ' + Priority placement'}
                    {nextPlan === 'accelerate' && ' + Featured listings'}
                    {nextPlan === 'corporate' && ' + Dedicated account manager'}
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              {isFreePlan ? 'Maybe Later' : 'Cancel'}
            </button>
            
            <button
              onClick={onUpgrade}
              className="flex-1 bg-teal-600 text-white py-3 px-4 rounded-lg hover:bg-teal-700 transition-colors font-medium flex items-center justify-center gap-2"
            >
              {isFreePlan ? 'Choose a Plan' : 'Upgrade Now'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionRestrictionsModal;
