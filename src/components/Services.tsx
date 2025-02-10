import { Code2, Rocket, Zap, Brain, Check, ArrowRight } from 'lucide-react';
import { useInView } from '../hooks/useInView';
import { useState } from 'react';

const services = [
  {
    icon: <Brain className="w-8 h-8" />,
    iconColor: 'text-rose-400',
    title: 'AI-Powered Development',
    description: 'Leverage cutting-edge AI to accelerate development while maintaining quality.',
    features: [
      'GPT-4 powered code generation',
      'AI-driven testing and QA',
      'Automated documentation',
      'Smart code optimization',
      'ML model integration'
    ],
    benefits: [
      '60% faster development',
      '40% cost reduction',
      'Higher code quality',
      'Rapid iterations'
    ]
  },
  {
    icon: <Code2 className="w-8 h-8" />,
    iconColor: 'text-emerald-400',
    title: 'Full-Stack MVPs',
    description: 'End-to-end development of your product with modern tech stack.',
    features: [
      'Modern frontend frameworks',
      'Scalable backend architecture',
      'Database design & optimization',
      'API development',
      'Cloud infrastructure'
    ],
    benefits: [
      'Production-ready code',
      'Scalable architecture',
      'Best practices built-in',
      'Future-proof tech stack'
    ]
  },
  {
    icon: <Zap className="w-8 h-8" />,
    iconColor: 'text-amber-400',
    title: 'Rapid Prototyping',
    description: 'Transform ideas into working prototypes in record time.',
    features: [
      'Interactive wireframes',
      'User flow mapping',
      'Quick iterations',
      'User testing',
      'Feature validation'
    ],
    benefits: [
      'Test ideas quickly',
      'Validate assumptions',
      'Reduce risk',
      'Save development time'
    ]
  },
  {
    icon: <Rocket className="w-8 h-8" />,
    iconColor: 'text-sky-400',
    title: 'Launch & Scale',
    description: 'Deploy your MVP and iterate based on real user feedback.',
    features: [
      'CI/CD pipeline setup',
      'Performance optimization',
      'Security hardening',
      'Monitoring & alerts',
      'Auto-scaling config'
    ],
    benefits: [
      'Production-ready',
      '99.9% uptime',
      'Enterprise security',
      'Scalable infrastructure'
    ]
  },
];

export function Services() {
  const [ref, isVisible] = useInView({ threshold: 0.1 });
  const [activeService, setActiveService] = useState(0);

  return (
    <section ref={ref} className="min-h-screen relative py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24">
          {/* Left Column - Service List */}
          <div className="space-y-6">
            {services.map((service, index) => (
              <button
                key={service.title}
                onClick={() => setActiveService(index)}
                className={`w-full group p-6 rounded-2xl transition-all duration-500 ease-out ${
                  isVisible
                    ? 'translate-x-0 opacity-100'
                    : '-translate-x-20 opacity-0'
                } ${
                  activeService === index
                    ? 'bg-gray-800 shadow-lg'
                    : 'hover:bg-gray-800/50'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl bg-gray-900/50 ${service.iconColor}`}>
                    {service.icon}
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {service.title}
                    </h3>
                    <p className="text-slate-300 text-sm">
                      {service.description}
                    </p>
                  </div>
                  <ArrowRight className={`w-5 h-5 transition-transform duration-300 ${
                    activeService === index ? 'rotate-90 text-sky-400' : 'text-slate-600'
                  }`} />
                </div>
              </button>
            ))}
          </div>

          {/* Right Column - Service Details */}
          <div className={`lg:sticky lg:top-24 space-y-8 transition-all duration-500 ease-out ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
          }`}>
            <div className="bg-gray-800 rounded-2xl p-8">
              <h4 className="text-lg font-medium text-white mb-4">
                Key Features
              </h4>
              <ul className="space-y-3">
                {services[activeService].features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-sky-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gray-800 rounded-2xl p-8">
              <h4 className="text-lg font-medium text-white mb-4">
                Benefits
              </h4>
              <div className="grid grid-cols-2 gap-4">
                {services[activeService].benefits.map((benefit) => (
                  <div
                    key={benefit}
                    className="p-4 rounded-xl bg-gray-700/50 text-slate-300 text-sm"
                  >
                    {benefit}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}