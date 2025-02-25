import { ArrowDown } from 'lucide-react';
import { useState } from 'react';
import AnimatedBackground from "./AnimatedBackground";
import AnimatedLines from "./AnimatedLines";
import { IdeaCapture } from './IdeaCapture';
import { useMessage } from '../lib/MessageContext';

export function Hero() {
  const [isIdeaCaptureOpen, setIsIdeaCaptureOpen] = useState(false);
  const { setMessage } = useMessage();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <AnimatedBackground />
      <AnimatedLines />
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-900/70 to-gray-900/90" />
      
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        {/* Main Heading Group */}
        <div className="space-y-4 md:space-y-6 mb-12 md:mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight">
            Your Idea to Working App
          </h1>
          <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl bg-gradient-to-r from-custom-blue to-blue-400 bg-clip-text text-transparent font-semibold tracking-tight">
            faster, and for less money.
          </p>
        </div>

        {/* CTA Button */}
        <div className="mb-8 md:mb-12">
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

        {/* Subtext */}
        <p className="text-xl sm:text-2xl md:text-3xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-light">
          AI lets us build smarter—we pass the savings to you.
          <span className="block mt-2 text-slate-400">You're welcome.</span>
        </p>
      </div>

      <IdeaCapture 
        isOpen={isIdeaCaptureOpen}
        onClose={() => setIsIdeaCaptureOpen(false)}
        setMessage={setMessage}
      />
    </section>
  );
}