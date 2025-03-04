import { useInView } from '../hooks/useInView';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import { 
  Cpu, 
  Mic, 
  Bot, 
  BarChart2, 
  Zap, 
  Layers, 
  RefreshCw, 
  DollarSign,
  ArrowUpCircle
} from 'lucide-react';

interface ServiceInfo {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  delay: number;
}

export function Services() {
  const [ref, isVisible] = useInView({ threshold: 0.1 });
  const [activeService, setActiveService] = useState<string | null>(null);
  
  // Service details based on the provided content
  const services: ServiceInfo[] = [
    {
      id: 'ai-integration',
      title: 'Intelligent & Custom AI Integration',
      description: 'Build smart apps and websites that learn and adapt while incorporating the latest AI tools for bespoke solutions.',
      icon: <Cpu className="w-6 h-6" />,
      gradient: 'from-purple-500 to-indigo-600',
      delay: 0
    },
    {
      id: 'voice-enabled',
      title: 'Voice-Enabled Interaction',
      description: 'Enable natural, hands-free communication with speech-to-text and voice chatbots in both apps and websites.',
      icon: <Mic className="w-6 h-6" />,
      gradient: 'from-blue-500 to-cyan-400',
      delay: 100
    },
    {
      id: 'ai-automations',
      title: 'AI-Driven Automations',
      description: 'Automate routine tasks to save time and streamline your business operations through intelligent web and mobile solutions.',
      icon: <Bot className="w-6 h-6" />,
      gradient: 'from-sky-400 to-blue-600',
      delay: 200
    },
    {
      id: 'visual-dashboards',
      title: 'Dynamic Visual Dashboards',
      description: 'Transform raw data into clear, interactive dashboards for actionable insights in both web and mobile platforms.',
      icon: <BarChart2 className="w-6 h-6" />,
      gradient: 'from-emerald-400 to-teal-600',
      delay: 300
    },
    {
      id: 'rapid-prototyping',
      title: 'Rapid Prototyping & MVP Delivery',
      description: 'Deliver working versions of your app or website quickly for immediate testing and iterative improvement.',
      icon: <Zap className="w-6 h-6" />,
      gradient: 'from-amber-400 to-orange-600',
      delay: 400
    },
    {
      id: 'personalized-content',
      title: 'Personalized Content & UI Generation',
      description: 'Automatically create engaging content and tailor-made interfaces for apps and websites that match your brand.',
      icon: <Layers className="w-6 h-6" />,
      gradient: 'from-rose-400 to-pink-600',
      delay: 500
    },
    {
      id: 'seamless-integration',
      title: 'Seamless Integration & Scalability',
      description: 'Build web and mobile solutions that integrate effortlessly with your existing systems and grow as your business expands.',
      icon: <RefreshCw className="w-6 h-6" />,
      gradient: 'from-indigo-400 to-violet-600',
      delay: 600
    },
    {
      id: 'cost-efficiency',
      title: 'Cost Efficiency & Savings',
      description: 'Pass on lower development costs whether building apps or websites, maximizing value and boosting your investment.',
      icon: <DollarSign className="w-6 h-6" />,
      gradient: 'from-green-400 to-emerald-600',
      delay: 700
    },
    {
      id: 'app-modernization',
      title: 'Enhanced App & Site Modernization',
      description: 'Upgrade and modernize existing apps and websites to keep them cutting-edge and competitive in today\'s market.',
      icon: <ArrowUpCircle className="w-6 h-6" />,
      gradient: 'from-red-400 to-rose-600',
      delay: 800
    }
  ];

  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <section ref={ref} id="services" className="py-28 relative bg-gradient-to-b from-gray-900 to-black overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-custom-blue/50 to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-custom-blue/50 to-transparent"></div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-10 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-32 -left-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        
        {/* Floating elements */}
        <div className="absolute top-40 right-20 opacity-20">
          <div className="w-4 h-4 bg-blue-400 rounded-full animate-float"></div>
        </div>
        <div className="absolute bottom-40 left-20 opacity-20">
          <div className="w-6 h-6 bg-purple-400 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
        </div>
        <div className="absolute top-1/3 left-1/4 opacity-20">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
        </div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className={cn(
            "text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300 mb-8 relative inline-block",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
            "transition-all duration-1000 ease-out"
          )}>
            Our Services
            <div className="absolute -bottom-4 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" style={{ 
              transform: isVisible ? 'scaleX(1)' : 'scaleX(0)', 
              transformOrigin: 'left',
              transition: 'transform 1.5s cubic-bezier(0.19, 1, 0.22, 1) 0.5s'
            }}></div>
          </h2>
          <p className={cn(
            "text-xl text-slate-400 max-w-3xl mx-auto",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
            "transition-all duration-1000 delay-200 ease-out"
          )}>
            Cutting-edge AI solutions designed to transform your business through innovative apps and websites that increase efficiency and drive growth.
          </p>
        </div>

        {/* Services Grid - Using Framer Motion for animations */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "show" : "hidden"}
        >
          {services.map((service) => (
            <motion.div
              key={service.id}
              variants={itemVariants}
              className={cn(
                "group relative bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 overflow-hidden transition-all duration-500",
                "hover:bg-gray-800/60 hover:border-gray-600/60 hover:shadow-lg hover:shadow-blue-900/20",
                activeService === service.id ? "ring-2 ring-white/20" : ""
              )}
              onClick={() => setActiveService(service.id === activeService ? null : service.id)}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              {/* Background gradient effect */}
              <div className="absolute -inset-px bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl"></div>
              
              {/* Service Icon */}
              <div className={`mb-5 w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br ${service.gradient} shadow-lg`}>
                {service.icon}
              </div>
              
              {/* Service Title */}
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-300 transition-all duration-300">
                {service.title}
              </h3>
              
              {/* Service Description */}
              <p className="text-slate-400 group-hover:text-slate-300 transition-colors duration-300">
                {service.description}
              </p>
              
              {/* Interactive elements */}
              <div className="mt-6 flex items-center justify-center">
                <div className="h-0.5 w-16 bg-gradient-to-r from-transparent via-gray-600 to-transparent group-hover:via-white/30 transition-colors duration-300"></div>
              </div>
              
              {/* Bottom border animation */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* CTA Section removed as requested */}
      </div>
    </section>
  );
}