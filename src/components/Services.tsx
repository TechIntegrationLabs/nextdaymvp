import { useInView } from '../hooks/useInView';
import { useState, useEffect } from 'react';
import { cn } from '../lib/utils';

// Define interfaces for type safety
interface MetricInfo {
  label: string;
  value: string;
}

interface ServiceInfo {
  title: string;
  tagline: string;
  description: string;
  bulletPoints: string[];
  additionalInfo: MetricInfo[];
  techStack: string;
}

export function Services() {
  const [ref, isVisible] = useInView({ threshold: 0.1 });
  const [activeTab, setActiveTab] = useState(0);

  // Service details with expanded content
  const services: ServiceInfo[] = [
    {
      title: 'AI-Powered Development',
      tagline: 'Build with the power of AI',
      description: 'Our AI-assisted development approach reduces costs and accelerates timelines without sacrificing quality. We leverage cutting-edge machine learning models to automate routine tasks, generate code, and enhance developer productivity. With our AI tools, we can build features in days that would normally take weeks.',
      bulletPoints: [
        'Reduce development time by up to 60% with GPT-4 assisted coding',
        'Automate testing and quality assurance with AI-driven test generation',
        'Generate complex algorithms and data structures with precision',
        'Create responsive UI components and animations with minimal effort',
        'Implement custom ML models for intelligent features',
        'Automate documentation and technical specifications'
      ],
      additionalInfo: [
        { label: 'Avg. Time Saved', value: '60%' },
        { label: 'Code Quality', value: '97%' },
        { label: 'Cost Reduction', value: '40%' }
      ],
      techStack: 'OpenAI, TensorFlow, PyTorch, Hugging Face, Azure ML, Google Cloud AI'
    },
    {
      title: 'Full-Stack MVPs',
      tagline: 'End-to-end product creation',
      description: 'We build complete, market-ready applications with modern technology stacks optimized for performance and scalability. Our MVPs are designed for real-world use from day one, with clean architecture and maintainable code that can evolve with your business. Whether it\'s a web app, mobile app, or complex platform, we deliver production-quality code that\'s ready to scale.',
      bulletPoints: [
        'Modern frontend with React, Vue, or Angular for responsive interfaces',
        'Robust backend services with Node.js, Python, or .NET for business logic',
        'Scalable database architecture using SQL or NoSQL solutions',
        'API development with REST, GraphQL, or WebSockets for real-time features',
        'Authentication and security best practices with OAuth, JWT, and data encryption',
        'Cloud infrastructure setup on AWS, Azure, or Google Cloud'
      ],
      additionalInfo: [
        { label: 'Time to Market', value: '4-6 weeks' },
        { label: 'Scalability', value: '10x ready' },
        { label: 'Maintenance', value: 'Minimal' }
      ],
      techStack: 'React, Next.js, Node.js, PostgreSQL, MongoDB, AWS, Docker, Kubernetes'
    },
    {
      title: 'Rapid Prototyping',
      tagline: 'From idea to demo in days',
      description: 'Test market fit quickly with functional prototypes that demonstrate your core value proposition. Our rapid prototyping approach saves months of development time and thousands in costs by focusing on your key differentiators first. We use low-code tools and frameworks to turn around working demos that you can test with real users before committing to full development.',
      bulletPoints: [
        'Interactive wireframes and detailed user flows for intuitive navigation',
        'Functioning demo applications with your core features implemented',
        'User testing frameworks and feedback collection systems',
        'A/B testing setup to validate assumptions and different approaches',
        'Iterative refinement process with regular stakeholder reviews',
        'Data-driven insights to inform product decisions'
      ],
      additionalInfo: [
        { label: 'Prototype Speed', value: '5-10 days' },
        { label: 'Iterations', value: 'Unlimited' },
        { label: 'Risk Reduction', value: '85%' }
      ],
      techStack: 'Figma, Webflow, Bubble.io, Firebase, Supabase, Retool, AppGyver'
    },
    {
      title: 'Launch & Scale',
      tagline: 'Deploy with confidence',
      description: 'Take your product to market with professional deployment, monitoring, and scaling solutions. We handle the technical complexity of launching your application so you can focus on your business goals. Our launch packages include everything from CI/CD pipelines to monitoring and alert systems, ensuring your product performs flawlessly under real-world conditions.',
      bulletPoints: [
        'Production-grade infrastructure setup with high-availability architecture',
        'Automated CI/CD pipelines for seamless deployment and updates',
        'Performance optimization for fast loading times and efficient execution',
        'Security hardening and vulnerability testing before launch',
        'Monitoring and alert systems to detect and resolve issues in real-time',
        'Auto-scaling configuration to handle traffic spikes and growth'
      ],
      additionalInfo: [
        { label: 'Uptime', value: '99.99%' },
        { label: 'Avg. Load Time', value: '<1.5s' },
        { label: 'Security Rating', value: 'A+' }
      ],
      techStack: 'GitHub Actions, CircleCI, Terraform, Cloudflare, New Relic, Datadog, PagerDuty'
    }
  ];

  return (
    <section ref={ref} id="services" className="py-24 pb-48 relative bg-gray-900 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-custom-blue/50 to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-custom-blue/50 to-transparent"></div>
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-48 -right-48 w-96 h-96 bg-custom-blue/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-custom-blue/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className={cn(
            "inline-flex text-4xl md:text-5xl font-bold text-white mb-6 relative",
            isVisible ? "opacity-100" : "opacity-0",
            "transition-opacity duration-1000"
          )}>
            <span className="relative">
              Our Services
              <span className="absolute -bottom-3 left-0 right-0 h-1 bg-custom-blue" style={{ 
                transform: isVisible ? 'scaleX(1)' : 'scaleX(0)', 
                transformOrigin: 'left',
                transition: 'transform 1.5s cubic-bezier(0.19, 1, 0.22, 1) 0.5s'
              }}></span>
            </span>
          </h2>
          <p className={cn(
            "text-xl text-slate-400 w-full mx-auto",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
            "transition-all duration-1000 delay-300"
          )}>
            Modern solutions, accelerated by AI, delivered in a fraction of the time and cost of traditional development.
          </p>
        </div>

        {/* Service Tabs */}
        <div className={cn(
          "mb-16",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
          "transition-all duration-1000 delay-500"
        )}>
          <div className="flex flex-wrap justify-center gap-3 md:gap-6">
            {services.map((service, index) => (
              <button
                key={service.title}
                onClick={() => setActiveTab(index)}
                className={cn(
                  "px-5 py-3 rounded-full text-sm md:text-base font-medium transition-all duration-300",
                  activeTab === index 
                    ? "bg-custom-blue text-white shadow-lg shadow-custom-blue/20" 
                    : "bg-gray-800 text-slate-300 hover:bg-gray-700"
                )}
              >
                {service.title}
              </button>
            ))}
          </div>
        </div>

        {/* Service Content */}
        <div className="relative">
          {services.map((service, index) => (
            <div 
              key={service.title}
              className={cn(
                "transition-all duration-700 absolute inset-0",
                activeTab === index 
                  ? "opacity-100 translate-y-0 pointer-events-auto" 
                  : "opacity-0 translate-y-8 pointer-events-none"
              )}
            >
              <div className="max-w-4xl mx-auto">
                <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
                  {/* Service Description */}
                  <div>
                    <div className="mb-6">
                      <span className="text-custom-blue text-sm font-medium tracking-wider uppercase">
                        {service.tagline}
                      </span>
                      <h3 className="text-2xl md:text-3xl font-bold text-white mt-2">
                        {service.title}
                      </h3>
                    </div>
                    <p className="text-slate-400 mb-8">
                      {service.description}
                    </p>

                    {/* Key Features */}
                    <div className="mb-8">
                      <h4 className="text-white text-lg font-medium mb-4">Key Features</h4>
                      <ul className="space-y-3">
                        {service.bulletPoints.map((point) => (
                          <li key={point} className="flex items-start">
                            <div className="flex-shrink-0 w-1.5 h-1.5 mt-2 rounded-full bg-custom-blue"></div>
                            <span className="ml-3 text-slate-300">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Additional Metrics */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      {service.additionalInfo.map((info) => (
                        <div key={info.label} className="bg-gray-800/50 p-3 rounded-lg text-center">
                          <div className="text-custom-blue font-bold text-xl">{info.value}</div>
                          <div className="text-xs text-slate-400">{info.label}</div>
                        </div>
                      ))}
                    </div>

                    {/* Tech Stack */}
                    <div className="mb-8">
                      <h4 className="text-white text-sm font-medium mb-2">Technologies</h4>
                      <p className="text-slate-400 text-sm">{service.techStack}</p>
                    </div>
                  </div>
                  
                  {/* Service Illustration - Abstract geometric shapes */}
                  <div className="hidden md:block">
                    <div className="aspect-square relative">
                      <div className="w-full h-full border border-gray-700 rounded-xl overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900">
                          {/* Abstract service-specific visualization */}
                          {index === 0 && (
                            /* AI-Powered Development */
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-32 h-32 border-4 border-custom-blue/30 rounded-full animate-pulse"></div>
                              <div className="absolute w-40 h-40 border border-custom-blue/20 rounded-full"></div>
                              <div className="absolute w-48 h-48 border border-custom-blue/10 rounded-full"></div>
                              <div className="absolute w-56 h-56 border border-custom-blue/5 rounded-full"></div>
                              <div className="absolute w-24 h-24 bg-custom-blue/10 backdrop-blur-xl rounded-lg transform rotate-45"></div>
                            </div>
                          )}
                          {index === 1 && (
                            /* Full-Stack MVPs */
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="grid grid-cols-2 gap-4 transform rotate-12">
                                <div className="w-16 h-16 bg-custom-blue/20 rounded-lg"></div>
                                <div className="w-16 h-16 border border-custom-blue/30 rounded-lg"></div>
                                <div className="w-16 h-16 border border-custom-blue/30 rounded-lg"></div>
                                <div className="w-16 h-16 bg-custom-blue/20 rounded-lg"></div>
                              </div>
                              <div className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-custom-blue/30 to-transparent"></div>
                              <div className="absolute w-0.5 h-full bg-gradient-to-b from-transparent via-custom-blue/30 to-transparent"></div>
                            </div>
                          )}
                          {index === 2 && (
                            /* Rapid Prototyping */
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="relative w-40 h-40">
                                <div className="absolute top-0 left-0 w-24 h-24 border border-custom-blue/30 rounded-lg transform -rotate-12"></div>
                                <div className="absolute top-4 left-4 w-24 h-24 border border-custom-blue/20 rounded-lg transform -rotate-6"></div>
                                <div className="absolute top-8 left-8 w-24 h-24 border border-custom-blue/10 rounded-lg"></div>
                                <div className="absolute top-12 left-12 w-24 h-24 bg-custom-blue/5 rounded-lg transform rotate-6"></div>
                              </div>
                            </div>
                          )}
                          {index === 3 && (
                            /* Launch & Scale */
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="relative">
                                <div className="w-24 h-48 bg-custom-blue/10 rounded-full transform -rotate-45"></div>
                                <div className="absolute top-1/2 left-1/2 w-20 h-20 bg-custom-blue/20 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
                                <div className="absolute top-10 left-16 w-4 h-4 bg-custom-blue/40 rounded-full"></div>
                                <div className="absolute top-20 left-2 w-2 h-2 bg-custom-blue/30 rounded-full"></div>
                                <div className="absolute bottom-14 right-6 w-3 h-3 bg-custom-blue/30 rounded-full"></div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Decorative elements */}
                      <div className="absolute top-4 right-4 w-16 h-16 border border-custom-blue/20 rounded-full"></div>
                      <div className="absolute -bottom-2 -left-2 w-12 h-12 bg-custom-blue/5 backdrop-blur-xl rounded-lg"></div>
                    </div>
                  </div>
                </div>
                
                {/* Call to Action */}
                <div className="mt-16 text-center">
                  <a 
                    href="#contact" 
                    className="inline-flex items-center py-3 px-6 bg-custom-blue hover:bg-custom-blue/90 text-white font-medium rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-custom-blue/20"
                  >
                    Get Started
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}