import { useInView } from '../hooks/useInView';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import { 
  Mic, 
  Bot, 
  RefreshCw, 
  BarChart2, 
  Zap, 
  Layers, 
  Code, 
  ArrowRight, 
  Cpu
} from 'lucide-react';

// Define interfaces for type safety
interface ServiceExample {
  text: string;
}

interface ServiceInfo {
  id: string;
  title: string;
  description: string;
  examples: ServiceExample[];
  icon: React.ReactNode;
  gradient: string;
}

export function Services() {
  const [ref, isVisible] = useInView({ threshold: 0.1 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeService, setActiveService] = useState<string | null>(null);
  const [currentCategory, setCurrentCategory] = useState<number>(0);
  
  const categories = [
    'All Services',
    'AI Integration',
    'Development',
    'Business Solutions'
  ];

  // Service details based on the provided information
  const services: ServiceInfo[] = [
    {
      id: 'voice-commands',
      title: 'Easy-to-use Voice Commands',
      description: 'Convert spoken ideas to text and enable intuitive voice interactions.',
      examples: [
        { text: 'Convert spoken ideas to text for feedback' },
        { text: 'Use voice-activated chatbots that answer questions and guide users' }
      ],
      icon: <Mic className="w-6 h-6" />,
      gradient: 'from-fuchsia-500 to-purple-600'
    },
    {
      id: 'ai-automations',
      title: 'AI-Driven Automations',
      description: 'Automate routine tasks so you can focus on what matters.',
      examples: [
        { text: 'Auto-respond to common customer emails' },
        { text: 'Smartly route support tickets and send real-time alerts for low inventory' }
      ],
      icon: <Bot className="w-6 h-6" />,
      gradient: 'from-sky-400 to-blue-500'
    },
    {
      id: 'data-dashboards',
      title: 'Dynamic Visual Dashboards & Data Insights',
      description: 'Turn raw numbers into clear, interactive visuals that show what\'s really happening.',
      examples: [
        { text: 'Custom dashboards that display sales and trends' },
        { text: 'Easy-to-read charts and graphs that highlight key performance data' }
      ],
      icon: <BarChart2 className="w-6 h-6" />,
      gradient: 'from-emerald-400 to-green-500'
    },
    {
      id: 'rapid-prototyping',
      title: 'Rapid Prototyping & Iterative MVP Delivery',
      description: 'Get a working version of your app fast—test it, learn from it, and improve it quickly.',
      examples: [
        { text: 'Use AI-assisted tools to create a working model in days' },
        { text: 'Launch early versions that you can refine based on real user feedback' }
      ],
      icon: <Zap className="w-6 h-6" />,
      gradient: 'from-amber-400 to-orange-500'
    },
    {
      id: 'personalized-content',
      title: 'Personalized Content & UI Generation',
      description: 'Automatically craft content and design layouts that fit your audience perfectly.',
      examples: [
        { text: 'Generate unique product descriptions and landing pages on the fly' },
        { text: 'Tailor marketing copy based on how users interact with your site' }
      ],
      icon: <Layers className="w-6 h-6" />,
      gradient: 'from-pink-500 to-rose-500'
    },
    {
      id: 'seamless-integration',
      title: 'Seamless Integration & Scalability',
      description: 'Build solutions that work well with your existing systems and grow as your business grows.',
      examples: [
        { text: 'Easy API connections and cloud-based systems that expand with you' },
        { text: 'Modular designs that support future upgrades without a complete overhaul' }
      ],
      icon: <RefreshCw className="w-6 h-6" />,
      gradient: 'from-indigo-400 to-violet-500'
    },
    {
      id: 'custom-ai',
      title: 'Custom AI Solutions & Personalized Integrations',
      description: 'We stay ahead by adding the latest AI tools—and even create custom versions of apps you admire just for your business.',
      examples: [
        { text: 'Integrate cutting-edge tools like GPT-4, DALL·E, and more' },
        { text: 'Build personalized versions of popular apps to meet your unique needs' }
      ],
      icon: <Cpu className="w-6 h-6" />,
      gradient: 'from-red-500 to-rose-600'
    }
  ];

  // Filter services based on selected category
  const filteredServices = services.filter(service => {
    if (currentCategory === 0) return true;
    if (currentCategory === 1) 
      return ['voice-commands', 'ai-automations', 'personalized-content', 'custom-ai'].includes(service.id);
    if (currentCategory === 2) 
      return ['rapid-prototyping', 'seamless-integration'].includes(service.id);
    if (currentCategory === 3) 
      return ['data-dashboards'].includes(service.id);
    return true;
  });

  const handleScroll = () => {
    if (activeService && containerRef.current) {
      const element = document.getElementById(`service-${activeService}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  useEffect(() => {
    handleScroll();
  }, [activeService]);

  return (
    <section ref={ref} id="services" className="py-24 relative bg-gradient-to-b from-gray-900 to-black overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-custom-blue/50 to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-custom-blue/50 to-transparent"></div>
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-custom-blue/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className={cn(
            "text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300 mb-6 relative",
            isVisible ? "opacity-100" : "opacity-0",
            "transition-opacity duration-1000"
          )}>
            <span className="relative">
              Our Services
              <span className="absolute -bottom-3 left-0 right-0 h-1 bg-gradient-to-r from-custom-blue via-purple-500 to-custom-blue" style={{ 
                transform: isVisible ? 'scaleX(1)' : 'scaleX(0)', 
                transformOrigin: 'left',
                transition: 'transform 1.5s cubic-bezier(0.19, 1, 0.22, 1) 0.5s'
              }}></span>
            </span>
          </h2>
          <p className={cn(
            "text-xl text-slate-400 w-full max-w-3xl mx-auto",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
            "transition-all duration-1000 delay-300"
          )}>
            Cutting-edge AI solutions designed to transform your business processes, increase efficiency, and drive innovation.
          </p>
        </div>

        {/* Category Filters */}
        <div className={cn(
          "flex flex-wrap justify-center gap-2 mb-16",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
          "transition-all duration-1000 delay-400"
        )}>
          {categories.map((category, index) => (
            <button
              key={category}
              onClick={() => setCurrentCategory(index)}
              className={cn(
                "px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300",
                currentCategory === index 
                  ? "bg-gradient-to-r from-custom-blue to-purple-600 text-white shadow-lg shadow-custom-blue/20" 
                  : "bg-gray-800/70 text-slate-300 hover:bg-gray-800"
              )}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div 
          ref={containerRef}
          className={cn(
            "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12",
            "transition-all duration-1000 delay-500"
          )}
        >
          {filteredServices.map((service) => (
            <div
              id={`service-${service.id}`}
              key={service.id}
              className={cn(
                "relative group bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 backdrop-blur-sm transition-all duration-500",
                activeService === service.id ? "ring-2 ring-offset-2 ring-offset-gray-900 ring-white/20" : "",
                "hover:bg-gray-800/80 hover:border-gray-600/50"
              )}
              onClick={() => setActiveService(service.id === activeService ? null : service.id)}
            >
              {/* Service Icon */}
              <div className={`mb-5 w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${service.gradient}`}>
                {service.icon}
              </div>
              
              {/* Service Title */}
              <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
                {service.title}
              </h3>
              
              {/* Service Description */}
              <p className="text-slate-400 mb-5">
                {service.description}
              </p>
              
              {/* Expandable Examples */}
              <div
                className={cn(
                  "overflow-hidden transition-all duration-500",
                  activeService === service.id ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                )}
              >
                <h4 className="text-white text-base font-medium mb-3 mt-2">Examples:</h4>
                <ul className="space-y-3 mb-5">
                  {service.examples.map((example, idx) => (
                    <li key={idx} className="flex items-start">
                      <div className="flex-shrink-0 w-1.5 h-1.5 mt-2 rounded-full bg-custom-blue"></div>
                      <span className="ml-3 text-slate-300">{example.text}</span>
                    </li>
                  ))}
                </ul>
                <a 
                  href="#contact" 
                  className="inline-flex items-center text-custom-blue hover:text-white transition-colors duration-300"
                >
                  <span>Learn More</span>
                  <ArrowRight className="ml-1 w-4 h-4" />
                </a>
              </div>
              
              {/* Learn More Button (when collapsed) */}
              <button
                className={cn(
                  "mt-2 text-custom-blue hover:text-white flex items-center text-sm font-medium transition-all duration-300",
                  activeService === service.id ? "opacity-0" : "opacity-100"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveService(service.id);
                }}
              >
                <span>See examples</span>
                <ArrowRight className="ml-1 w-4 h-4" />
              </button>
              
              {/* Hover decoration */}
              <div className="absolute -bottom-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-custom-blue/50 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
            </div>
          ))}
        </div>
        
        {/* CTA Section */}
        <div className="mt-20 text-center">
          <div className={cn(
            "bg-gradient-to-r from-gray-800/80 to-gray-900/80 border border-gray-700/50 rounded-2xl p-8 md:p-10 backdrop-blur-md max-w-4xl mx-auto",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12",
            "transition-all duration-1000 delay-700"
          )}>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Ready to transform your business with AI?</h3>
            <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
              Our team of experts is ready to help you integrate these cutting-edge solutions into your business processes.
            </p>
            <a 
              href="#contact" 
              className="inline-flex items-center py-4 px-8 bg-gradient-to-r from-custom-blue to-purple-600 hover:from-custom-blue/90 hover:to-purple-600/90 text-white font-medium rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-custom-blue/20"
            >
              <span>Get Started Today</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
            <p className="text-slate-500 text-sm mt-4">
              Free consultation • No commitment • Get a quote in 24 hours
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}