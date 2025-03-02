import React, { useState, useEffect } from 'react';

interface AppIconGeneratorProps {
  ideaTitle: string;
  ideaDescription: string;
}

export function AppIconGenerator({ ideaTitle, ideaDescription }: AppIconGeneratorProps) {
  const [iconUrl, setIconUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generate a simple icon based on the first letter of the idea title
  // In a real implementation, you would call an AI image generation API
  const generateSimpleIcon = () => {
    setIsLoading(true);
    
    try {
      // Extract the first letter or use a default
      const firstLetter = ideaTitle?.trim()[0]?.toUpperCase() || 'A';
      
      // Generate a consistent background color based on the idea title
      const colors = [
        '#FF5F5F', '#5F87FF', '#5FBFFF', '#5FFF87', 
        '#87FF5F', '#FF5F87', '#875FFF', '#FF875F'
      ];
      
      // Use a hash of the idea title to select a consistent color
      const hash = ideaTitle.split('').reduce((acc, char) => {
        return acc + char.charCodeAt(0);
      }, 0);
      
      const colorIndex = hash % colors.length;
      const bgColor = colors[colorIndex];
      
      // Create a canvas to draw the icon
      const canvas = document.createElement('canvas');
      canvas.width = 200;
      canvas.height = 200;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Draw background
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw the letter
        ctx.fillStyle = 'white';
        ctx.font = 'bold 100px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(firstLetter, canvas.width / 2, canvas.height / 2);
        
        // Add a simple pattern based on description length
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 5;
        
        // Pattern complexity based on description length
        const steps = Math.min(Math.floor(ideaDescription.length / 20), 5) + 2;
        const stepSize = canvas.width / steps;
        
        for (let i = 1; i < steps; i++) {
          ctx.beginPath();
          ctx.moveTo(i * stepSize, 0);
          ctx.lineTo(canvas.width, i * stepSize);
          ctx.stroke();
        }
        
        // Convert to data URL
        const dataUrl = canvas.toDataURL('image/png');
        setIconUrl(dataUrl);
      }
    } catch (err) {
      setError('Failed to generate icon');
      console.error('Icon generation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (ideaTitle) {
      generateSimpleIcon();
    }
  }, [ideaTitle, ideaDescription]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-4">
        <div className="w-32 h-32 bg-gray-700 rounded-2xl flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-custom-blue border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="mt-2 text-sm text-gray-400">Generating icon...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-4">
        <div className="w-32 h-32 bg-gray-700 rounded-2xl flex items-center justify-center text-red-500">
          <span className="text-5xl">!</span>
        </div>
        <p className="mt-2 text-sm text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {iconUrl && (
        <>
          <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-lg">
            <img 
              src={iconUrl} 
              alt={`${ideaTitle} App Icon`} 
              className="w-full h-full object-cover"
            />
          </div>
          <p className="mt-2 text-sm text-gray-300">App Icon Preview</p>
        </>
      )}
    </div>
  );
}
