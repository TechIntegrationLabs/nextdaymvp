import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface AppMockupProps {
  className?: string;
}

export const AppMockup = ({ className = '' }: AppMockupProps) => {
  const [scrollY, setScrollY] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const [animatePhone, setAnimatePhone] = useState(false);

  // Mock UI elements that appear to be built in real-time
  const uiElements = [
    { id: 'header', delay: 0.5, label: 'Header' },
    { id: 'nav', delay: 1.0, label: 'Navigation' },
    { id: 'hero', delay: 1.5, label: 'Hero Section' },
    { id: 'features', delay: 2.0, label: 'Features' },
    { id: 'cards', delay: 2.5, label: 'Cards' },
    { id: 'footer', delay: 3.0, label: 'Footer' }
  ];

  useEffect(() => {
    setIsInView(true);
    
    const timer = setTimeout(() => {
      setAnimatePhone(true);
    }, 500);
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      {/* Phone mockup */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ 
          opacity: isInView ? 1 : 0, 
          y: isInView ? 0 : 50,
          rotateY: animatePhone ? [0, 10, -10, 5, 0] : 0,
          rotateX: animatePhone ? [0, 5, -5, 0] : 0
        }}
        transition={{ 
          duration: 0.7, 
          delay: 0.2,
          rotateY: { 
            duration: 2.5, 
            ease: "easeInOut", 
            delay: 0.5,
            repeat: Infinity,
            repeatType: "mirror",
            repeatDelay: 3
          },
          rotateX: { 
            duration: 2, 
            ease: "easeInOut", 
            delay: 0.7,
            repeat: Infinity,
            repeatType: "mirror",
            repeatDelay: 2
          }
        }}
        style={{
          perspective: '1000px',
          transformStyle: 'preserve-3d',
        }}
        className="relative w-[280px] h-[580px] mx-auto border-8 border-gray-800 rounded-[36px] shadow-lg overflow-hidden bg-gray-800"
      >
        {/* Phone notch */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-7 bg-gray-800 rounded-b-xl z-10"></div>
        
        {/* Phone screen */}
        <div className="relative h-full w-full bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden">
          {/* Mock app UI being constructed */}
          {uiElements.map((element) => (
            <motion.div
              key={element.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: element.delay }}
              className="relative m-3 rounded-lg overflow-hidden"
            >
              <div className="flex items-center h-10 bg-gray-700 rounded-t-lg px-3">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1, delay: element.delay + 0.3 }}
                  className="h-4 bg-gradient-to-r from-custom-blue to-blue-400 rounded"
                ></motion.div>
              </div>
              <div className="p-2 bg-gray-800 rounded-b-lg">
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: element.id === 'hero' ? 80 : 40 }}
                  transition={{ duration: 0.7, delay: element.delay + 0.5 }}
                  className="bg-gray-700 rounded w-full"
                >
                  {element.id === 'hero' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: element.delay + 1 }}
                      className="flex items-center justify-center h-full text-xs text-gray-400"
                    >
                      App Visualization
                    </motion.div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          ))}
          
          {/* Code being typed effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.5, duration: 0.5 }}
            className="absolute bottom-4 left-0 right-0 mx-3 p-2 bg-gray-900 rounded text-[8px] font-mono text-green-400 overflow-hidden"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 0] }}
              transition={{ 
                duration: 2,
                times: [0, 0.1, 0.9, 1],
                repeat: Infinity,
                repeatDelay: 1
              }}
              className="absolute top-2 right-2 w-2 h-2 bg-green-400 rounded-full"
            ></motion.div>
            <motion.div
              initial={{ y: 40 }}
              animate={{ y: 0 }}
              transition={{ 
                duration: 5, 
                delay: 4,
                repeat: Infinity, 
                repeatType: "loop" 
              }}
              className="code-block"
            >
              <div className="line">
                <span className="text-purple-400">const</span> <span className="text-blue-400">app</span> = <span className="text-purple-400">new</span> <span className="text-yellow-400">App</span>();
              </div>
              <div className="line">
                <span className="text-blue-400">app</span>.<span className="text-yellow-400">init</span>();
              </div>
              <div className="line">
                <span className="text-purple-400">async function</span> <span className="text-yellow-400">buildUI</span>() {"{"}
              </div>
              <div className="line pl-2">
                <span className="text-purple-400">const</span> <span className="text-blue-400">components</span> = <span className="text-purple-400">await</span> <span className="text-yellow-400">fetchComponents</span>();
              </div>
              <div className="line pl-2">
                <span className="text-purple-400">await</span> <span className="text-blue-400">app</span>.<span className="text-yellow-400">render</span>(components);
              </div>
              <div className="line">{"}"}</div>
              <div className="line">
                <span className="text-yellow-400">buildUI</span>();
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Decorative elements */}
      <div className="absolute -z-10 w-full h-full">
        <div className="absolute top-1/4 -right-4 w-20 h-20 bg-custom-blue/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-1/3 -left-4 w-16 h-16 bg-blue-400/20 rounded-full blur-xl"></div>
      </div>
    </div>
  );
};
