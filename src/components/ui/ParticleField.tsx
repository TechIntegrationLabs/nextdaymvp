import { useEffect, useRef } from 'react';

interface ParticleProps {
  className?: string;
}

// Class for managing individual particles
class Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  alpha: number;
  isConnecting: boolean;

  constructor(canvas: HTMLCanvasElement) {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 3 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.5;
    this.speedY = (Math.random() - 0.5) * 0.5;
    this.color = '#36a3ec';
    this.alpha = Math.random() * 0.5 + 0.2;
    this.isConnecting = false;
  }

  update(canvas: HTMLCanvasElement) {
    // Bounce off edges
    if (this.x > canvas.width || this.x < 0) {
      this.speedX = -this.speedX;
    }
    if (this.y > canvas.height || this.y < 0) {
      this.speedY = -this.speedY;
    }

    // Update position
    this.x += this.speedX;
    this.y += this.speedY;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(54, 163, 236, ${this.alpha})`;
    ctx.fill();
  }

  connect(particles: Particle[], ctx: CanvasRenderingContext2D, maxDistance: number) {
    this.isConnecting = false;
    for (const particle of particles) {
      if (this === particle) continue;
      
      const dx = this.x - particle.x;
      const dy = this.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < maxDistance) {
        this.isConnecting = true;
        // Line opacity is inversely proportional to distance
        const opacity = 1 - (distance / maxDistance);
        ctx.beginPath();
        ctx.strokeStyle = `rgba(54, 163, 236, ${opacity * 0.3})`;
        ctx.lineWidth = this.size / 8;
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(particle.x, particle.y);
        ctx.stroke();
      }
    }
  }
}

export const ParticleField = ({ className = '' }: ParticleProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number>(0);
  const mouseRef = useRef<{ x: number | null; y: number | null }>({ x: null, y: null });
  
  // Mouse interaction to affect particles
  const handleMouseMove = (e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };
  
  const handleMouseLeave = () => {
    mouseRef.current = { x: null, y: null };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Initialize particles
    const initParticles = () => {
      // Make canvas full size of its container
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      
      // Create particles
      const particleCount = Math.min(Math.floor((canvas.width * canvas.height) / 10000), 100);
      particlesRef.current = Array.from({ length: particleCount }, () => new Particle(canvas));
    };
    
    initParticles();
    
    // Add event listeners for mouse interaction
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    
    // Animation function
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw and update particles
      for (const particle of particlesRef.current) {
        particle.update(canvas);
        particle.draw(ctx);
        
        // Mouse interaction - attract particles to mouse
        const mouse = mouseRef.current;
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - particle.x;
          const dy = mouse.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxDistance = 100;
          
          if (distance < maxDistance) {
            // Calculate force (inverse of distance)
            const force = (maxDistance - distance) / maxDistance;
            // Apply force towards mouse
            particle.speedX += dx * force * 0.01;
            particle.speedY += dy * force * 0.01;
            
            // Add some visual effect when near mouse
            ctx.beginPath();
            ctx.strokeStyle = `rgba(54, 163, 236, ${(0.3 * (maxDistance - distance)) / maxDistance})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }
      
      // Connect particles with lines if they're close enough
      const maxConnectionDistance = canvas.width * 0.08;
      for (const particle of particlesRef.current) {
        particle.connect(particlesRef.current, ctx, maxConnectionDistance);
      }
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Handle window resize
    const handleResize = () => {
      initParticles();
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      className={`${className} w-full h-full`}
    />
  );
};
