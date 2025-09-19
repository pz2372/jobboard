import React, { useState, useEffect } from 'react';
import employerLocalStorageService from '../services/employerLocalStorageService';

const LocalStorageDebugPanel: React.FC = () => {
  const [storageData, setStorageData] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  const refreshData = () => {
    const data = employerLocalStorageService.getEmployerData();
    setStorageData(data);
  };

  useEffect(() => {
    refreshData();
  }, []);

  const clearStorage = () => {
    employerLocalStorageService.clearEmployerData();
    refreshData();
  };

  // Only show in development - simplified check
  const isDevelopment = window.location.hostname === 'localhost';

  if (!isDevelopment) {
    return null;
  }

  return (
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 9999,
        backgroundColor: 'white',
        border: '1px solid #ccc',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        fontFamily: 'monospace',
        fontSize: '12px'
      }}>
        <div
          onClick={() => setIsVisible(!isVisible)}
          style={{
            padding: '8px 12px',
            cursor: 'pointer',
            backgroundColor: '#f0f0f0',
            borderBottom: isVisible ? '1px solid #ccc' : 'none',
            borderRadius: isVisible ? '8px 8px 0 0' : '8px'
          }}
        >
          🔍 LocalStorage Debug {isVisible ? '▼' : '▶'}
        </div>
        
        {isVisible && (
          <div style={{ padding: '12px', maxWidth: '400px', maxHeight: '300px', overflow: 'auto' }}>
            <div style={{ marginBottom: '8px' }}>
              <button 
                onClick={refreshData}
                style={{ 
                  marginRight: '8px', 
                  padding: '4px 8px', 
                  fontSize: '10px',
                  cursor: 'pointer'
                }}
              >
                🔄 Refresh
              </button>
              <button 
                onClick={clearStorage}
                style={{ 
                  padding: '4px 8px', 
                  fontSize: '10px',
                  cursor: 'pointer',
                  backgroundColor: '#ff6b6b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px'
                }}
              >
                🗑️ Clear
              </button>
            </div>
            
            {storageData ? (
              <div>
                <div><strong>Employer:</strong> {storageData.employer ? `ID: ${storageData.employer.id}` : 'null'}</div>
                <div><strong>Jobs:</strong> {storageData.jobs?.length || 0}</div>
                <div><strong>Applications:</strong> {storageData.applications?.length || 0}</div>
                <div><strong>Subscription:</strong> {storageData.subscription ? 'present' : 'null'}</div>
                <div><strong>Last Updated:</strong> {storageData.lastUpdated ? new Date(storageData.lastUpdated).toLocaleTimeString() : 'never'}</div>
                <div><strong>Data Age:</strong> {Math.round(employerLocalStorageService.getDataAge() * 10) / 10}h</div>
                <div><strong>Valid:</strong> {employerLocalStorageService.hasValidData() ? '✅' : '❌'}</div>
              </div>
            ) : (
              <div>No data in localStorage</div>
            )}
          </div>
        )}
      </div>
    );
};

export default LocalStorageDebugPanel;
