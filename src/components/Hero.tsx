import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { IdeaCapture } from './IdeaCapture';
import { useMessage } from '../lib/MessageContext';
import { ParticleField } from './ui/ParticleField';
import { AppMockup } from './ui/AppMockup';
import { ArrowDown, Mic, Sparkles, Code, Rocket, Star } from 'lucide-react';

export function Hero() {
  const [isIdeaCaptureOpen, setIsIdeaCaptureOpen] = useState(false);
  const { setMessage, setAppSiteDetails, setOriginalTranscript, setGeneratedImageUrl } = useMessage();
  
  const [hasScrolled, setHasScrolled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  
  // Handle mouse movement for parallax effects
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!heroRef.current) return;
    
    const { clientX, clientY } = e;
    const { width, height, left, top } = heroRef.current.getBoundingClientRect();
    
    // Calculate position relative to the center of the element
    const x = (clientX - left - width / 2) / 25;
    const y = (clientY - top - height / 2) / 25;
    
    setMousePosition({ x, y });
  };

  // Detect scroll for animation triggers
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10 && !hasScrolled) {
        setHasScrolled(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hasScrolled]);

  // Illumination effect when user hovers over the hero section
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current || !textContainerRef.current) return;
      
      const rect = heroRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      textContainerRef.current.style.setProperty('--mouse-x', `${x}px`);
      textContainerRef.current.style.setProperty('--mouse-y', `${y}px`);
    };
    
    const heroElement = heroRef.current;
    if (heroElement) {
      heroElement.addEventListener('mousemove', handleMouseMove);
    }
    
    return () => {
      if (heroElement) {
        heroElement.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  return (
    <section 
      ref={heroRef} 
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-900"
      onMouseMove={handleMouseMove}
    >
      {/* Interactive particle background */}
      <div className="absolute inset-0 opacity-40">
        <ParticleField className="w-full h-full" />
      </div>
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/90 via-gray-900/80 to-gray-900/95" />
      
      <div className="relative z-10 container mx-auto px-4 py-16 md:py-24 lg:py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Content: Main heading and AI Lab concept */}
          <div className="order-2 md:order-1">
            <motion.div 
              ref={textContainerRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="space-y-6"
              style={{
                transform: `perspective(1000px) rotateX(${-mousePosition.y * 0.2}deg) rotateY(${mousePosition.x * 0.2}deg)`,
                transition: 'transform 0.1s ease-out',
              }}
            >
              {/* AI Developer label */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="inline-flex items-center px-3 py-1 rounded-full bg-custom-blue/10 border border-custom-blue/20 text-custom-blue text-sm font-medium"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                AI-Powered Development Studio
              </motion.div>
              
              {/* Main heading with highlight effect */}
              <div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="block"
                  >
                    Transform Your Idea Into a
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="bg-gradient-to-r from-custom-blue to-blue-400 bg-clip-text text-transparent relative"
                  >
                    Working Application
                  </motion.span>
                </h1>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                  className="mt-6 text-lg sm:text-xl text-gray-300 max-w-lg"
                >
                  Our AI-powered development process delivers high-quality apps in half the time and cost of traditional development.
                </motion.p>
              </div>
              
              {/* Benefits */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9 }}
                className="pt-4 space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start space-x-2">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-custom-blue/10 flex items-center justify-center">
                      <Rocket className="w-4 h-4 text-custom-blue" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">Faster Delivery</h3>
                      <p className="text-sm text-gray-400">Launch in weeks, not months</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-custom-blue/10 flex items-center justify-center">
                      <Star className="w-4 h-4 text-custom-blue" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">Quality Code</h3>
                      <p className="text-sm text-gray-400">Professional & scalable</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-custom-blue/10 flex items-center justify-center">
                      <Code className="w-4 h-4 text-custom-blue" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">AI Enhancements</h3>
                      <p className="text-sm text-gray-400">Smart features included</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-custom-blue/10 flex items-center justify-center">
                      <Star className="w-4 h-4 text-custom-blue" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">Lower Cost</h3>
                      <p className="text-sm text-gray-400">Save 40% or more</p>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.1 }}
                className="pt-6"
              >
                <button 
                  onClick={() => setIsIdeaCaptureOpen(true)}
                  className="group relative inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium text-white bg-gradient-to-r from-custom-blue to-blue-600 rounded-full overflow-hidden transition-all hover:scale-105 hover:shadow-xl hover:shadow-custom-blue/30 w-full sm:w-auto"
                >
                  <span className="relative z-10 flex items-center">
                    <Mic className="w-5 h-5 mr-2" />
                    Share Your Idea Now
                    <ArrowDown className="w-5 h-5 ml-2 transform group-hover:translate-y-1 transition-transform" />
                  </span>
                </button>
                <p className="text-sm text-slate-300 mt-3">
                  Free consultation • No commitment • Get a quote in 24 hours
                </p>
              </motion.div>
            </motion.div>
          </div>
          
          {/* Right Content: App Mockup & AI visualization */}
          <div className="order-1 md:order-2 flex justify-center">
            <div className="relative w-full max-w-lg">
              {/* App Mockup */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
              >
                <AppMockup />
              </motion.div>
              
              {/* Background glow effects */}
              <div className="absolute -z-10 w-full h-full top-0 left-0">
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-custom-blue/20 rounded-full blur-3xl opacity-70"></div>
                <div className="absolute bottom-1/4 right-0 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl opacity-60"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-8 sm:bottom-16 left-1/2 transform -translate-x-1/2"
        >
          <div className="flex flex-col items-center text-slate-400">
            <span className="text-sm mb-2">Scroll to explore</span>
            <div className="w-0.5 h-12 bg-gradient-to-b from-custom-blue to-transparent relative">
              <div className="absolute w-2 h-2 bg-custom-blue rounded-full -left-[3px] animate-pulse-down" 
                  style={{ animationDuration: '2s', animationIterationCount: 'infinite' }}/>
            </div>
          </div>
        </motion.div>
      </div>

      <IdeaCapture 
        isOpen={isIdeaCaptureOpen}
        onClose={() => setIsIdeaCaptureOpen(false)}
        setMessage={setMessage}
        setAppSiteDetails={setAppSiteDetails}
        setOriginalTranscript={setOriginalTranscript}
        setGeneratedImageUrl={setGeneratedImageUrl}
      />
    </section>
  );
}