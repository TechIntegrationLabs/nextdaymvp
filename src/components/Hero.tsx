import { ArrowDown } from 'lucide-react';
import { useEffect, useRef, useState, useCallback, useMemo } from 'react';

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [currentPosition, setCurrentPosition] = useState({ x: 50, y: 50 });
  const targetPosition = useRef({ x: 50, y: 50 });
  const animationFrameRef = useRef<number>();
  const lastUpdateTime = useRef(0);
  const velocity = useRef({ x: 0, y: 0 });

  const config = useMemo(() => ({
    springStrength: 0.08,  // Increased for more responsiveness
    damping: 0.9,         // Increased for smoother movement
    velocityFactor: 0.3,  // How much velocity affects movement
    maxVelocity: 2,      // Limit maximum velocity
  }), []);

  const updatePosition = useCallback(() => {
    const now = performance.now();
    const deltaTime = Math.min((now - lastUpdateTime.current) / 16, 2);
    lastUpdateTime.current = now;

    setCurrentPosition(prev => {
      // Calculate distance to target
      const dx = targetPosition.current.x - prev.x;
      const dy = targetPosition.current.y - prev.y;

      // Update velocity with spring force
      velocity.current.x += dx * config.springStrength * deltaTime;
      velocity.current.y += dy * config.springStrength * deltaTime;

      // Apply damping to velocity
      velocity.current.x *= Math.pow(config.damping, deltaTime);
      velocity.current.y *= Math.pow(config.damping, deltaTime);

      // Clamp velocity
      velocity.current.x = Math.max(-config.maxVelocity, Math.min(config.maxVelocity, velocity.current.x));
      velocity.current.y = Math.max(-config.maxVelocity, Math.min(config.maxVelocity, velocity.current.y));

      // Apply velocity to position
      const newX = prev.x + velocity.current.x;
      const newY = prev.y + velocity.current.y;

      return { x: newX, y: newY };
    });

    animationFrameRef.current = requestAnimationFrame(updatePosition);
  }, [config]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    lastUpdateTime.current = performance.now();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      targetPosition.current = { x, y };
    };

    section.addEventListener('mousemove', handleMouseMove);
    animationFrameRef.current = requestAnimationFrame(updatePosition);

    return () => {
      section.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [updatePosition]);

  useEffect(() => {
    if (sectionRef.current) {
      sectionRef.current.style.setProperty('--mouse-x', `${currentPosition.x}%`);
      sectionRef.current.style.setProperty('--mouse-y', `${currentPosition.y}%`);
    }
  }, [currentPosition]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ perspective: '1000px' }}>
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800/40 to-gray-900/20">
          <div className="absolute inset-0 transition-opacity duration-300 mouse-light" />
        </div>
        <div className="absolute inset-0 waves-container">
          <div className="wave wave1" />
          <div className="wave wave2" />
          <div className="wave wave3" />
        </div>
      </div>
      
      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center transform-gpu">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8 hero-title">
          <span className="block mb-4">Your Idea to Working App</span>
          <span className="bg-gradient-to-r from-custom-blue to-blue-400 bg-clip-text text-transparent hero-title-gradient flex flex-col">
            <span>in less time</span>
            <span>for less money.</span>
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-2xl mx-auto" style={{
          textShadow: '0 0 10px rgba(255,255,255,0.1)'
        }}>
          AI lets us build smarter—we pass the savings to you. You’re welcome.
        </p>
        
        <button className="group relative inline-flex items-center justify-center px-8 py-3 text-lg font-medium text-white bg-custom-blue rounded-full overflow-hidden transition-all hover:scale-105">
          <span className="relative z-10">Get Started</span>
        </button>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ArrowDown className="w-6 h-6 text-white" />
      </div>
    </section>
  );
}