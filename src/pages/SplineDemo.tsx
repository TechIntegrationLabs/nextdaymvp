import React from 'react';
import { SplineAnimation } from '../components/SplineAnimation';

const SplineDemo: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <div className="p-8 text-white z-10 relative">
        <h1 className="text-3xl font-bold mb-4">Spline Animation Demo</h1>
        <p className="mb-8">This page demonstrates the 3D animation created with Spline</p>
      </div>
      
      <div className="flex-1 relative">
        <SplineAnimation className="opacity-100" />
      </div>
    </div>
  );
};

export default SplineDemo;
