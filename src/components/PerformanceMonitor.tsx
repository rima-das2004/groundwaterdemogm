import React, { useEffect, useState } from 'react';

interface PerformanceMonitorProps {
  componentName: string;
  children: React.ReactNode;
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({ 
  componentName, 
  children 
}) => {
  const [renderTime, setRenderTime] = useState<number>(0);

  useEffect(() => {
    const start = performance.now();
    
    const timer = setTimeout(() => {
      const end = performance.now();
      const time = end - start;
      setRenderTime(time);
      
      // Log slow renders (over 100ms)
      if (time > 100) {
        console.warn(`Slow render detected in ${componentName}: ${time.toFixed(2)}ms`);
      }
    }, 0);

    return () => clearTimeout(timer);
  });

  // Add error boundary behavior
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      console.error(`Error in ${componentName}:`, error);
      setHasError(true);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, [componentName]);

  if (hasError) {
    return (
      <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
        <h3 className="font-semibold text-destructive">Component Error</h3>
        <p className="text-sm text-muted-foreground">
          {componentName} encountered an error. Please refresh the page.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};

export default PerformanceMonitor;