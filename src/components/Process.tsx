import { useInView } from '../hooks/useInView';
import { Lightbulb, Palette, Code, Rocket } from 'lucide-react';

const steps = [
  {
    icon: <Lightbulb className="w-6 h-6" />,
    title: 'Idea Validation',
    description: 'AI-powered market research and validation to ensure product-market fit.',
  },
  {
    icon: <Palette className="w-6 h-6" />,
    title: 'Design & Prototype',
    description: 'Rapid prototyping with interactive wireframes and user testing.',
  },
  {
    icon: <Code className="w-6 h-6" />,
    title: 'Development',
    description: 'Agile development with modern tech stack and AI assistance.',
  },
  {
    icon: <Rocket className="w-6 h-6" />,
    title: 'Launch',
    description: 'Production deployment with monitoring and scaling support.',
  },
];

export function Process() {
  const [ref, isVisible] = useInView({ threshold: 0.1 });

  return (
    <section ref={ref} className="min-h-screen py-24 relative">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className={`text-3xl md:text-5xl font-bold text-white mb-16 transition-all duration-1000 section-title ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          Our Process
        </h2>

        <div className="relative">
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-sky-800" />

          <div className="space-y-24">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className={`relative transition-all duration-[2000ms] ease-out ${
                  isVisible
                    ? 'translate-x-0 opacity-100'
                    : index % 2 === 0
                    ? '-translate-x-24 opacity-0'
                    : 'translate-x-24 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div
                  className={`flex flex-col md:flex-row items-center gap-8 ${
                    index % 2 === 0 ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-xl font-semibold mb-4 text-white">
                      {step.title}
                    </h3>
                    <p className="text-slate-200">
                      {step.description}
                    </p>
                  </div>

                  <div className="w-16 h-16 rounded-full bg-sky-700 flex items-center justify-center text-white shadow-lg relative z-10">
                    {step.icon}
                  </div>

                  <div className="flex-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}