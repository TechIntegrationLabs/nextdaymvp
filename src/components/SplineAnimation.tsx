import { useEffect, useState } from 'react';
import Spline from '@splinetool/react-spline';

interface SplineAnimationProps {
  className?: string;
}

export function SplineAnimation({ className = '' }: SplineAnimationProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  return (
    <div className={`w-full h-full absolute inset-0 z-0 ${className}`}>
      {!isMobile && (
        <>
          <div 
            className={`absolute inset-0 transition-opacity duration-1000 ${
              isLoaded ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-custom-blue border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
          <div 
            className={`w-full h-full transition-opacity duration-1000 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Spline 
              scene="/scene.splinecode" 
              onLoad={() => setIsLoaded(true)}
            />
          </div>
        </>
      )}
    </div>
  );
}
