import { onCLS, onFID, onLCP, onFCP, onTTFB } from 'web-vitals';

const reportWebVitals = (onPerfEntry?: (metric: any) => void) => {
  if (onPerfEntry && typeof onPerfEntry === 'function') {
    onCLS(onPerfEntry); // Cumulative Layout Shift
    onFID(onPerfEntry); // First Input Delay
    onLCP(onPerfEntry); // Largest Contentful Paint
    onFCP(onPerfEntry); // First Contentful Paint
    onTTFB(onPerfEntry); // Time to First Byte
  }
};

export default reportWebVitals;
