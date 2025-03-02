import React from 'react';
import Spline from '@splinetool/react-spline';

export function SplineAnimation() {
  return (
    <div className="min-h-screen bg-gray-900 w-full h-screen overflow-hidden">
      <div style={{ width: '100%', height: '100%' }}>
        <Spline scene="/scene.splinecode" />
      </div>
    </div>
  );
}
