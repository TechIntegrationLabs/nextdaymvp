import { useEffect, useRef } from 'react';

interface Line {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  life: number;
  maxLife: number;
  velocity: { x: number; y: number };
  thickness: number;
}

export default function AnimatedLines() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const linesRef = useRef<Line[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createLine = (x: number, y: number): Line => {
      const angle = Math.random() * Math.PI * 2;
      const length = Math.random() * 100 + 50;
      const maxLife = Math.random() * 100 + 100;
      return {
        x1: x,
        y1: y,
        x2: x + Math.cos(angle) * length,
        y2: y + Math.sin(angle) * length,
        life: maxLife,
        maxLife,
        velocity: {
          x: (Math.random() - 0.5) * 2,
          y: (Math.random() - 0.5) * 2
        },
        thickness: Math.random() * 2 + 0.5
      };
    };

    const addLines = (x: number, y: number, count: number = 1) => {
      for (let i = 0; i < count; i++) {
        linesRef.current.push(createLine(x, y));
      }
    };

    const updateLines = () => {
      linesRef.current = linesRef.current.filter(line => {
        line.life -= 1;
        line.x1 += line.velocity.x;
        line.y1 += line.velocity.y;
        line.x2 += line.velocity.x;
        line.y2 += line.velocity.y;
        return line.life > 0;
      });
    };

    const drawLines = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      linesRef.current.forEach(line => {
        const alpha = (line.life / line.maxLife) * 0.4;
        ctx.beginPath();
        ctx.moveTo(line.x1, line.y1);
        ctx.lineTo(line.x2, line.y2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.lineWidth = line.thickness;
        ctx.lineCap = 'round';
        ctx.stroke();
      });
    };

    const animate = () => {
      updateLines();
      drawLines();

      // Add new lines periodically
      if (Math.random() < 0.3) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        addLines(x, y, Math.random() < 0.1 ? 3 : 1);
      }

      // Add lines following mouse position
      if (Math.random() < 0.2) {
        addLines(mouseRef.current.x, mouseRef.current.y);
      }

      frameRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    // Initialize
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);

    // Start animation
    animate();

    // Initial lines
    for (let i = 0; i < 20; i++) {
      addLines(
        Math.random() * canvas.width,
        Math.random() * canvas.height
      );
    }

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ background: 'transparent' }}
    />
  );
}
