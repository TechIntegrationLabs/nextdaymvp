import { useEffect, useState } from 'react';
import { Loader } from 'lucide-react';

export function Test() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Create a script element to load the Spline viewer
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://unpkg.com/@splinetool/viewer@0.9.490/build/spline-viewer.js';
    script.onload = () => {
      setIsLoading(false);
    };
    document.head.appendChild(script);

    return () => {
      // Clean up the script when component unmounts
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div className="w-full h-screen bg-black flex items-center justify-center">
      {isLoading && (
        <div className="flex flex-col items-center justify-center gap-4">
          <Loader className="w-10 h-10 text-custom-blue animate-spin" />
          <p className="text-white text-lg">Loading 3D scene...</p>
        </div>
      )}
      
      <spline-viewer 
        url="https://draft.spline.design/FXjEk3zey5aCMTxr/scene.splinecode"
        class={`w-full h-full ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}
      ></spline-viewer>
    </div>
  );
}

export default Test;
