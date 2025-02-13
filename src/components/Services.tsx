import { Code2, Rocket, Zap, Brain, Check, ArrowRight } from 'lucide-react';
import { useInView } from '../hooks/useInView';
import { useState, useEffect } from 'react';

const services = [
  {
    icon: <Brain className="w-8 h-8" />,
    iconBg: 'from-rose-500/20 to-purple-600/20',
    iconGlow: 'group-hover:shadow-rose-500/20',
    accentColor: 'group-hover:text-rose-400',
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
    iconBg: 'from-emerald-500/20 to-teal-600/20',
    iconGlow: 'group-hover:shadow-emerald-500/20',
    accentColor: 'group-hover:text-emerald-400',
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
    iconBg: 'from-amber-500/20 to-orange-600/20',
    iconGlow: 'group-hover:shadow-amber-500/20',
    accentColor: 'group-hover:text-amber-400',
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
    iconBg: 'from-sky-500/20 to-blue-600/20',
    iconGlow: 'group-hover:shadow-sky-500/20',
    accentColor: 'group-hover:text-sky-400',
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
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (isVisible && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [isVisible, hasAnimated]);

  return (
    <section ref={ref} className="relative py-32 overflow-hidden bg-gray-900">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-900 to-black" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-24">
          <h2 className={`text-3xl md:text-5xl font-bold text-white mb-8 text-center transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
          }`}>
            Our Services
          </h2>
        </div>

        {/* Services Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <div
              key={service.title}
              className={`group relative transition-all duration-500 translate-y-0 opacity-100 ${
                !hasAnimated ? 'translate-y-20 opacity-0' : ''
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Card */}
              <div className="relative p-8 rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:border-gray-600/50 transition-all duration-500 cursor-pointer overflow-hidden group">
                {/* Hover Gradient */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${service.iconBg}`} />
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex items-start gap-6 mb-8">
                    <div className={`p-4 rounded-xl bg-gradient-to-br ${service.iconBg} shadow-lg transition-shadow duration-500 ${service.iconGlow}`}>
                      {service.icon}
                    </div>
                    <div>
                      <h3 className={`text-2xl font-semibold text-white mb-2 transition-colors duration-300 ${service.accentColor}`}>
                        {service.title}
                      </h3>
                      <p className="text-slate-400 leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {service.features.slice(0, 4).map((feature) => (
                        <div
                          key={feature}
                          className="flex items-center gap-2 text-sm text-slate-300"
                        >
                          <Check className={`w-4 h-4 flex-shrink-0 transition-colors duration-300 ${service.accentColor}`} />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Benefits Preview */}
                    <div className="pt-6 mt-6 border-t border-gray-700/50">
                      <div className="flex items-center justify-between">
                        <div className="flex gap-3">
                          {service.benefits.slice(0, 2).map((benefit) => (
                            <span
                              key={benefit}
                              className="px-3 py-1 text-xs font-medium text-slate-400 bg-gray-800 rounded-full"
                            >
                              {benefit}
                            </span>
                          ))}
                        </div>
                        <ArrowRight className={`w-5 h-5 transition-all duration-300 ${service.accentColor} group-hover:translate-x-1`} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}