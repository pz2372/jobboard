import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import employerLocalStorageService from '../services/employerLocalStorageService';
import { EyeIcon, EyeOffIcon, RefreshCwIcon, TrashIcon } from 'lucide-react';

const EmployerDataDebugPanel: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [localData, setLocalData] = useState(null);
  const employer = useSelector((state: RootState) => state.employerAuth.employer);

  const refreshLocalData = () => {
    const data = employerLocalStorageService.getEmployerData();
    setLocalData(data);
  };

  useEffect(() => {
    refreshLocalData();
  }, []);

  const clearLocalStorage = () => {
    employerLocalStorageService.clearEmployerData();
    refreshLocalData();
  };

  // Only show in development (check for development build)
  const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  if (!isDevelopment) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        title="Toggle Employer Data Debug Panel"
      >
        {isVisible ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
      </button>

      {isVisible && (
        <div className="absolute bottom-12 right-0 w-96 bg-white rounded-lg shadow-xl border border-gray-200 p-4 max-h-96 overflow-auto">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-gray-900">Employer Data Debug</h3>
            <div className="flex gap-2">
              <button
                onClick={refreshLocalData}
                className="p-1 text-gray-500 hover:text-blue-600"
                title="Refresh"
              >
                <RefreshCwIcon className="w-4 h-4" />
              </button>
              <button
                onClick={clearLocalStorage}
                className="p-1 text-gray-500 hover:text-red-600"
                title="Clear localStorage"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="font-medium text-gray-700">Redux State:</div>
              <div className="bg-gray-50 p-2 rounded">
                <div>Employer ID: {employer?.id || 'null'}</div>
                <div>Company: {employer?.companyName || 'null'}</div>
              </div>
            </div>

            <div>
              <div className="font-medium text-gray-700">LocalStorage (Non-Sensitive Data Only):</div>
              <div className="bg-gray-50 p-2 rounded">
                <div>Has Valid Data: {employerLocalStorageService.hasValidData() ? 'Yes' : 'No'}</div>
                <div>Data Age: {Math.round(employerLocalStorageService.getDataAge() * 10) / 10}h</div>
                <div>Jobs: {localData?.jobs?.length || 0}</div>
                <div>Applications: {localData?.applications?.length || 0}</div>
                <div>Last Updated: {localData?.lastUpdated ? new Date(localData.lastUpdated).toLocaleTimeString() : 'null'}</div>
                <div className="text-xs text-green-600 mt-1">🔒 Employer & subscription data secured (not in localStorage)</div>
              </div>
            </div>

            {localData && (
              <div>
                <div className="font-medium text-gray-700">Raw Data:</div>
                <pre className="bg-gray-50 p-2 rounded text-xs overflow-auto max-h-32">
                  {JSON.stringify(localData, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployerDataDebugPanel;
