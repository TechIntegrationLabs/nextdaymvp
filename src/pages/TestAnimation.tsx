import React, { useEffect } from 'react';

export function TestAnimation() {
  useEffect(() => {
    // Create an iframe to load the animation
    const iframe = document.createElement('iframe');
    iframe.src = '/noise_displace_copy/index.html';
    iframe.style.width = '100%';
    iframe.style.height = '100vh';
    iframe.style.border = 'none';
    
    // Get the container and append the iframe
    const container = document.getElementById('animation-container');
    if (container) {
      container.appendChild(iframe);
    }

    // Cleanup function to remove the iframe when component unmounts
    return () => {
      if (container && iframe) {
        container.removeChild(iframe);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-900">
      <div id="animation-container" className="w-full h-screen"></div>
    </div>
  );
}
