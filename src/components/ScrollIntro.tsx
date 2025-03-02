import { useState, useEffect, useRef } from 'react';
import { cn } from '../lib/utils';

interface ScrollIntroProps {
  onComplete: () => void;
}

export function ScrollIntro({ onComplete }: ScrollIntroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [currentScene, setCurrentScene] = useState(0);
  
  // Define scenes/frames for the scroll animation
  const scenes = [
    {
      title: "Your Idea",
      subtitle: "Everything starts with your vision",
      description: "We begin by understanding your unique needs and goals.",
      bgColor: "bg-gray-950",
      position: 0,
    },
    {
      title: "AI-Powered Development",
      subtitle: "Accelerated with cutting-edge technology",
      description: "Our AI tools and techniques build quality solutions in record time.",
      bgColor: "bg-gray-900",
      position: 0.25,
    },
    {
      title: "Rapid Prototyping",
      subtitle: "From concept to interactive product",
      description: "Test and validate your idea with working prototypes.",
      bgColor: "bg-gray-800",
      position: 0.5,
    },
    {
      title: "Refined & Polished",
      subtitle: "Expert craftsmanship and attention to detail",
      description: "We enhance your product with beautiful UI and optimized performance.",
      bgColor: "bg-gray-700",
      position: 0.75,
    },
    {
      title: "Launch & Scale",
      subtitle: "Your vision, realized and ready for growth",
      description: "Deploy to production with confidence and support for scaling.",
      bgColor: "bg-gray-900",
      position: 1,
    }
  ];

  // Use wheel events instead of scroll events
  useEffect(() => {
    // Disable normal scrolling on body
    document.body.style.overflow = 'hidden';
    
    // Track progress with a ref to avoid closure issues
    const progressRef = { value: 0 };
    
    // Handle wheel events to control the animation
    const handleWheel = (e: WheelEvent) => {
      // Determine scroll direction and amount
      const delta = e.deltaY;
      
      // Calculate new progress value (0-1)
      // Adjust the divisor to control sensitivity (higher = less sensitive)
      const newProgress = Math.min(1, Math.max(0, progressRef.value + (delta / 2000)));
      progressRef.value = newProgress;
      
      // Update state with the new progress
      setScrollProgress(newProgress);
      
      // Determine which scene to display based on progress
      const newSceneIndex = Math.min(
        scenes.length - 1,
        Math.floor(newProgress * scenes.length)
      );
      
      setCurrentScene(newSceneIndex);
      
      // Check if intro is complete
      if (newProgress >= 0.95 && !isComplete) {
        setIsComplete(true);
        // Allow a moment to see the final frame before completing
        setTimeout(() => {
          // Restore normal scrolling
          document.body.style.overflow = 'auto';
          onComplete();
        }, 1000);
      }
    };
    
    // Add wheel event listener to window
    window.addEventListener('wheel', handleWheel, { passive: false });
    
    // Also support touch events for mobile
    let touchStartY = 0;
    
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartY) return;
      
      const touchY = e.touches[0].clientY;
      const delta = touchStartY - touchY;
      touchStartY = touchY;
      
      // Calculate new progress value (0-1)
      // Adjust the divisor to control sensitivity
      const newProgress = Math.min(1, Math.max(0, progressRef.value + (delta / 500)));
      progressRef.value = newProgress;
      
      // Update state with the new progress
      setScrollProgress(newProgress);
      
      // Determine which scene to display based on progress
      const newSceneIndex = Math.min(
        scenes.length - 1,
        Math.floor(newProgress * scenes.length)
      );
      
      setCurrentScene(newSceneIndex);
      
      // Check if intro is complete
      if (newProgress >= 0.95 && !isComplete) {
        setIsComplete(true);
        // Allow a moment to see the final frame before completing
        setTimeout(() => {
          // Restore normal scrolling
          document.body.style.overflow = 'auto';
          onComplete();
        }, 1000);
      }
      
      // Prevent default to avoid page scrolling
      e.preventDefault();
    };
    
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    
    // Add keyboard support
    const handleKeyDown = (e: KeyboardEvent) => {
      // Arrow keys and space
      if (e.key === 'ArrowDown' || e.key === 'Space' || e.key === ' ') {
        const newProgress = Math.min(1, progressRef.value + 0.05);
        progressRef.value = newProgress;
        setScrollProgress(newProgress);
        
        const newSceneIndex = Math.min(
          scenes.length - 1,
          Math.floor(newProgress * scenes.length)
        );
        
        setCurrentScene(newSceneIndex);
        
        if (newProgress >= 0.95 && !isComplete) {
          setIsComplete(true);
          setTimeout(() => {
            document.body.style.overflow = 'auto';
            onComplete();
          }, 1000);
        }
        
        e.preventDefault();
      } else if (e.key === 'ArrowUp') {
        const newProgress = Math.max(0, progressRef.value - 0.05);
        progressRef.value = newProgress;
        setScrollProgress(newProgress);
        
        const newSceneIndex = Math.min(
          scenes.length - 1,
          Math.floor(newProgress * scenes.length)
        );
        
        setCurrentScene(newSceneIndex);
        e.preventDefault();
      } else if (e.key === 'Escape') {
        // Skip intro on Escape key
        document.body.style.overflow = 'auto';
        onComplete();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      // Clean up
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isComplete, onComplete, scenes.length]);

  // Calculate the background gradient based on the current scroll progress
  const gradientStyle = {
    background: `linear-gradient(to bottom, #111827 0%, #0f172a ${scrollProgress * 100}%, #030712 100%)`,
  };

  // Create a manual scroll function to help users get started
  const scrollDown = () => {
    // Manually increment progress
    const newProgress = Math.min(1, scrollProgress + 0.1);
    setScrollProgress(newProgress);
    
    // Update scene
    const newSceneIndex = Math.min(
      scenes.length - 1,
      Math.floor(newProgress * scenes.length)
    );
    
    setCurrentScene(newSceneIndex);
    
    // Check if intro is complete
    if (newProgress >= 0.95 && !isComplete) {
      setIsComplete(true);
      setTimeout(() => {
        document.body.style.overflow = 'auto';
        onComplete();
      }, 1000);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-50 overflow-hidden"
      style={gradientStyle}
    >
      {/* Progress indicator */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-800 z-50">
        <div 
          className="h-full bg-custom-blue transition-all duration-200 ease-out"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>
      
      {/* Scroll hint - Clickable to help users get started */}
      <div 
        className={cn(
          "fixed bottom-8 left-1/2 transform -translate-x-1/2 text-white text-sm flex flex-col items-center transition-opacity duration-500 cursor-pointer z-50",
          isComplete ? "opacity-0" : "opacity-80 hover:opacity-100"
        )}
        onClick={scrollDown}
      >
        <span className="mb-2">Scroll or click here to continue</span>
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-2 bg-white rounded-full animate-pulse-down mt-2"></div>
        </div>
      </div>
      
      {/* Animation container */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Scenes */}
        {scenes.map((scene, index) => (
          <div
            key={index}
            className={cn(
              "absolute inset-0 flex items-center justify-center transition-all duration-700",
              index === currentScene ? "opacity-100" : "opacity-0 pointer-events-none"
            )}
          >
            {/* Scene content */}
            <div className="max-w-4xl mx-auto px-6 text-center">
              <h2 className={cn(
                "text-5xl md:text-7xl font-bold text-white mb-4 transform transition-all duration-700",
                index === currentScene ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              )}>
                {scene.title}
              </h2>
              
              <h3 className={cn(
                "text-2xl md:text-3xl text-custom-blue mb-6 transform transition-all duration-700 delay-100",
                index === currentScene ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              )}>
                {scene.subtitle}
              </h3>
              
              <p className={cn(
                "text-xl text-slate-300 max-w-2xl mx-auto mb-8 transform transition-all duration-700 delay-200",
                index === currentScene ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              )}>
                {scene.description}
              </p>
              
              {/* Visual indicator showing scene position in timeline */}
              <div className={cn(
                "flex justify-center space-x-2 mt-12 transform transition-all duration-700 delay-300",
                index === currentScene ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              )}>
                {scenes.map((_, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "w-3 h-3 rounded-full",
                      i === currentScene ? "bg-custom-blue" : "bg-gray-600"
                    )}
                  />
                ))}
              </div>
            </div>
            
            {/* Abstract visual elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div
                className={cn(
                  "absolute w-64 h-64 rounded-full bg-custom-blue/10 blur-3xl -z-10 transition-all duration-1000",
                  index === currentScene ? "opacity-100" : "opacity-0"
                )}
                style={{
                  left: `calc(50% - 16rem + ${Math.sin(index * 1.5) * 300}px)`,
                  top: `calc(50% - 16rem + ${Math.cos(index * 1.5) * 200}px)`,
                }}
              />
              <div
                className={cn(
                  "absolute w-96 h-96 rounded-full bg-blue-500/5 blur-3xl -z-10 transition-all duration-1000",
                  index === currentScene ? "opacity-100" : "opacity-0"
                )}
                style={{
                  right: `calc(50% - 24rem + ${Math.cos(index * 1.2) * 400}px)`,
                  bottom: `calc(50% - 24rem + ${Math.sin(index * 1.2) * 300}px)`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
      
      {/* Instructions */}
      <div className="fixed top-4 left-4 text-white text-sm opacity-70 z-50">
        Use mouse wheel, arrow keys, or touch to navigate
      </div>
      
      {/* Skip button */}
      <button
        onClick={onComplete}
        className="fixed top-4 right-4 px-4 py-2 text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 rounded-full z-50"
      >
        Skip Intro
      </button>
      
      {/* Final CTA - only shown when almost complete */}
      <div className={cn(
        "fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 transition-all duration-1000 z-40",
        scrollProgress > 0.9 ? `opacity-${Math.min(10, Math.floor((scrollProgress - 0.9) * 100))}` : "opacity-0 pointer-events-none"
      )}>
        <div className="text-center">
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Ready to Start Building?
          </h2>
          <button
            onClick={onComplete}
            className="px-8 py-4 bg-custom-blue text-white text-xl font-medium rounded-full hover:bg-blue-600 transition-colors"
          >
            Enter Site
          </button>
        </div>
      </div>
    </div>
  );
}
