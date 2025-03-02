import { ArrowDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import AnimatedLines from "./AnimatedLines";
import { IdeaCapture } from './IdeaCapture';
import { useMessage } from '../lib/MessageContext';
import { cn } from '../lib/utils';
import { Boxes } from './ui/background-boxes';

export function Hero() {
  const [isIdeaCaptureOpen, setIsIdeaCaptureOpen] = useState(false);
  const { setMessage } = useMessage();
  
  // Animation states for each element
  const [animationStep, setAnimationStep] = useState(0);
  const [hasScrolled, setHasScrolled] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  
  // Text content for the animated sequence
  const heroText = [
    {
      heading: "Your Idea",
      description: "starts here",
    },
    {
      heading: "Our AI Tech",
      description: "brings it to life",
    },
    {
      heading: "Working App",
      description: "in record time",
    },
    {
      heading: "Your Idea to Working App",
      description: "faster, and for less money.",
    }
  ];

  // Start animation sequence on load
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const handleScroll = () => {
      if (window.scrollY > 10 && !hasScrolled) {
        setHasScrolled(true);
        // Skip to final state when user scrolls
        setAnimationStep(heroText.length - 1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // Automatic sequence timing if user hasn't scrolled
    if (!hasScrolled) {
      const nextStep = () => {
        setAnimationStep(prev => {
          const next = prev + 1;
          if (next < heroText.length) {
            // Schedule next step
            timeout = setTimeout(nextStep, next === heroText.length - 1 ? 3000 : 2000);
          }
          return next;
        });
      };
      
      // Start the sequence after initial delay
      timeout = setTimeout(nextStep, 1000);
    }
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeout) clearTimeout(timeout);
    };
  }, [hasScrolled, heroText.length]);
  
  // Text animations for each step
  const currentTextContent = heroText[Math.min(animationStep, heroText.length - 1)];
  
  // Trigger CTA reveal after final text animation
  const showCTA = animationStep >= heroText.length - 1;

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-900">
      <Boxes className="opacity-40" />
      <AnimatedLines />
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/90 via-gray-900/80 to-gray-900/95 backdrop-blur-sm" />
      
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        {/* Main Heading Group - Animated */}
        <div className="space-y-4 md:space-y-6 mb-12 md:mb-16 h-[calc(4rem+8vh)] sm:h-[calc(5rem+8vh)] md:h-[calc(6rem+8vh)] flex flex-col items-center justify-center">
          {/* Animated main heading */}
          <div className="overflow-hidden relative h-[3.5rem] sm:h-[4.5rem] md:h-[6.5rem] lg:h-[7.5rem] w-full">
            <h1 
              className={cn(
                "text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight absolute inset-0 flex items-center justify-center",
                "transition-all duration-1000 ease-in-out",
                animationStep === heroText.length - 1 ? "opacity-100 transform-none" : "opacity-0 -translate-y-8"
              )}
            >
              {heroText[heroText.length - 1].heading}
            </h1>
            
            {heroText.slice(0, -1).map((text, index) => (
              <h1
                key={index}
                className={cn(
                  "text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight absolute inset-0 flex items-center justify-center",
                  "transition-all duration-1000 ease-in-out",
                  animationStep === index ? "opacity-100 transform-none" : 
                  animationStep > index ? "opacity-0 translate-y-8" : "opacity-0 -translate-y-8"
                )}
              >
                {text.heading}
              </h1>
            ))}
          </div>
          
          {/* Animated description */}
          <div className="overflow-hidden relative h-14 sm:h-16 md:h-20 lg:h-24 w-full">
            <p 
              className={cn(
                "text-2xl sm:text-3xl md:text-4xl lg:text-5xl bg-gradient-to-r from-custom-blue to-blue-400 bg-clip-text text-transparent font-semibold tracking-tight absolute inset-0 flex items-center justify-center",
                "transition-all duration-1000 ease-in-out",
                animationStep === heroText.length - 1 ? "opacity-100 transform-none" : "opacity-0 translate-y-8"
              )}
            >
              {heroText[heroText.length - 1].description}
            </p>
            
            {heroText.slice(0, -1).map((text, index) => (
              <p
                key={index}
                className={cn(
                  "text-2xl sm:text-3xl md:text-4xl lg:text-5xl bg-gradient-to-r from-custom-blue to-blue-400 bg-clip-text text-transparent font-semibold tracking-tight absolute inset-0 flex items-center justify-center",
                  "transition-all duration-1000 ease-in-out",
                  animationStep === index ? "opacity-100 transform-none" : 
                  animationStep > index ? "opacity-0 translate-y-8" : "opacity-0 -translate-y-8"
                )}
              >
                {text.description}
              </p>
            ))}
          </div>
        </div>

        {/* CTA Button - Animated */}
        <div className={cn(
          "mb-8 md:mb-12 transition-all duration-1000 ease-in-out",
          showCTA ? "opacity-100 transform-none" : "opacity-0 translate-y-8"
        )}>
          <button 
            onClick={() => setIsIdeaCaptureOpen(true)}
            className="group relative inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium text-white bg-custom-blue rounded-full overflow-hidden transition-all hover:scale-105 hover:shadow-lg hover:shadow-custom-blue/20"
          >
            <span className="relative z-10 flex items-center">
              Get Started
              <ArrowDown className="w-4 h-4 sm:w-5 sm:h-5 ml-2 transform group-hover:translate-y-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-custom-blue to-blue-600 group-hover:opacity-90 transition-opacity" />
          </button>
        </div>

        {/* Subtext - Animated */}
        <div className={cn(
          "transition-all duration-1000 ease-in-out delay-300",
          showCTA ? "opacity-100 transform-none" : "opacity-0 translate-y-8"
        )}>
          <p className="text-xl sm:text-2xl md:text-3xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-light">
            AI lets us build smarter—we pass the savings to you.
            <span className="block mt-2 text-slate-400">You're welcome.</span>
          </p>
        </div>
        
        {/* Scroll indicator - only visible on final step */}
        <div className={cn(
          "absolute bottom-16 left-1/2 transform -translate-x-1/2 transition-all duration-1000",
          showCTA ? "opacity-100" : "opacity-0"
        )}>
          <div className="flex flex-col items-center text-slate-400">
            <span className="text-sm mb-2">Scroll to explore</span>
            <div className="w-0.5 h-12 bg-gradient-to-b from-custom-blue to-transparent relative">
              <div className="absolute w-2 h-2 bg-custom-blue rounded-full -left-[3px] animate-pulse-down" 
                   style={{ animationDuration: '2s', animationIterationCount: 'infinite' }}/>
            </div>
          </div>
        </div>
      </div>

      <IdeaCapture 
        isOpen={isIdeaCaptureOpen}
        onClose={() => setIsIdeaCaptureOpen(false)}
        setMessage={setMessage}
      />
    </section>
  );
}