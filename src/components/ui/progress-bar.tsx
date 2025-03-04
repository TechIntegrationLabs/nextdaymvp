import React, { useState, useEffect } from 'react';
import { cn } from '../../lib/utils';

interface ProgressBarProps {
  duration?: number;
  className?: string;
  indeterminate?: boolean;
  progress?: number;
}

export function ProgressBar({
  duration = 10000,
  className,
  indeterminate = false,
  progress: externalProgress
}: ProgressBarProps) {
  const [progress, setProgress] = useState(externalProgress || 0);

  useEffect(() => {
    if (externalProgress !== undefined) {
      setProgress(externalProgress);
      return;
    }
    
    if (indeterminate) return;
    
    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const newProgress = Math.min((elapsedTime / duration) * 100, 100);
      
      setProgress(newProgress);
      
      if (newProgress >= 100) {
        clearInterval(timer);
      }
    }, 50);
    
    return () => clearInterval(timer);
  }, [duration, indeterminate, externalProgress]);

  return (
    <div className={cn("w-full h-2 bg-gray-700 rounded-full overflow-hidden", className)}>
      {indeterminate ? (
        <div className="h-full bg-custom-blue rounded-full animate-progress-indeterminate" />
      ) : (
        <div 
          className="h-full bg-custom-blue rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      )}
    </div>
  );
}
