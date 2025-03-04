import { useState } from 'react';
import { Check, HelpCircle } from 'lucide-react';
import { useInView } from '../hooks/useInView';

interface PricingTier {
  name: string;
  price: number;
  timeline: string;
  features: string[];
  isPopular?: boolean;
  ctaText: string;
}

const appTiers: PricingTier[] = [
  {
    name: 'Starter App',
    price: 1350,  // Monthly: $225 -> $250
    timeline: '2-3 weeks',
    features: [
      'Core functionality implementation',
      'Basic user authentication',
      'Mobile-responsive design',
      'Basic API integration',
      'Standard security features',
      '2 weeks of support',
      'Basic analytics'
    ],
    ctaText: 'Start Basic Project'
  },
  {
    name: 'Growth App',
    price: 3150,  // Monthly: $525 -> $550
    timeline: '4-6 weeks',
    features: [
      'Advanced feature set',
      'Custom authentication flows',
      'Advanced API integration',
      'Performance optimization',
      'Enhanced security features',
      'Real-time functionality',
      'Advanced analytics'
    ],
    isPopular: true,
    ctaText: 'Choose Growth Plan'
  },
  {
    name: 'Custom AI-Powered App',
    price: 6300,  // Monthly: $1050 -> $1050
    timeline: '6-8 weeks',
    features: [
      'AI/ML integration',
      'Custom algorithms',
      'Advanced data processing',
      'Scalable architecture',
      'Premium security features',
      'Custom analytics dashboard',
      '24/7 priority support'
    ],
    ctaText: 'Contact for Custom'
  }
];

const websiteTiers: PricingTier[] = [
  {
    name: 'Starter Website',
    price: 450,  // Monthly: $75 -> $100
    timeline: '1-2 weeks',
    features: [
      'Modern design',
      'Mobile-responsive',
      'Up to 5 pages',
      'Basic SEO',
      'Contact form',
      'Analytics integration',
      'Content management'
    ],
    ctaText: 'Start Basic Project'
  },
  {
    name: 'Growth Website',
    price: 1050,  // Monthly: $175 -> $200
    timeline: '2-3 weeks',
    features: [
      'Premium design',
      'Advanced animations',
      'Up to 10 pages',
      'Advanced SEO',
      'Custom forms',
      'Performance optimization',
      'E-commerce ready'
    ],
    isPopular: true,
    ctaText: 'Choose Growth Plan'
  },
  {
    name: 'Custom AI-Powered Website',
    price: 2450,  // Monthly: $408 -> $400
    timeline: '3-4 weeks',
    features: [
      'AI content generation',
      'Dynamic personalization',
      'Unlimited pages',
      'SEO automation',
      'Advanced integrations',
      'Custom functionality',
      'Premium support'
    ],
    ctaText: 'Contact for Custom'
  }
];

function PriceToggle({ 
  isMonthly, 
  setIsMonthly 
}: { 
  isMonthly: boolean; 
  setIsMonthly: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-center gap-4 mb-8">
      <span className={`text-sm font-medium ${!isMonthly ? 'text-white' : 'text-slate-400'}`}>
        One-Time Payment
      </span>
      <button
        onClick={() => setIsMonthly(!isMonthly)}
        className={`relative w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-sky-600 focus:ring-offset-2 focus:ring-offset-gray-900 ${
            isMonthly ? 'bg-custom-blue' : 'bg-gray-600'
        }`}
      >
        <span
          className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white transition-transform duration-300 ${
            isMonthly ? 'translate-x-7' : 'translate-x-0'
          }`}
        />
      </button>
      <span className={`text-sm font-medium ${isMonthly ? 'text-white' : 'text-slate-400'}`}>
        Monthly Retainer
      </span>
    </div>
  );
}

function ServiceToggle({ 
  isApp, 
  setIsApp 
}: { 
  isApp: boolean; 
  setIsApp: (value: boolean) => void;
}) {
  return (
    <div className="flex justify-center mb-12">
      <div className="inline-flex rounded-lg bg-gray-800 p-1">
        <button
          onClick={() => setIsApp(true)}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${
            isApp
              ? 'bg-custom-blue text-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          App Development
        </button>
        <button
          onClick={() => setIsApp(false)}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${
            !isApp
              ? 'bg-custom-blue text-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Website Development
        </button>
      </div>
    </div>
  );
}

function Tooltip({ content }: { content: string }) {
  return (
    <div className="group relative">
      <HelpCircle className="w-4 h-4 text-slate-400" />
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 text-xs text-white bg-gray-800 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
        {content}
        <div className="absolute top-full left-1/2 -translate-x-1/2 -translate-y-1/2 border-4 border-transparent border-t-gray-800" />
      </div>
    </div>
  );
}

export function Pricing() {
  const [ref, isVisible] = useInView({ threshold: 0.1 });
  const [isApp, setIsApp] = useState(true);
  const [isMonthly, setIsMonthly] = useState(true);

  const tiers = isApp ? appTiers : websiteTiers;

  return (
    <section ref={ref} className="min-h-screen py-24 relative">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className={`text-3xl md:text-5xl font-bold text-white mb-8 text-center transition-all duration-1000 section-title ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          Transparent Pricing
        </h2>
        
        <p className="text-xl text-slate-300 text-center mb-12 max-w-2xl mx-auto">
          Choose the perfect plan for your project. All prices include design,
          development, testing, and deployment.
        </p>

        <ServiceToggle isApp={isApp} setIsApp={setIsApp} />
        <PriceToggle isMonthly={isMonthly} setIsMonthly={setIsMonthly} />

        <div className="grid md:grid-cols-3 gap-8">
          {tiers.map((tier, index) => (
            <div
              key={tier.name}
              className={`relative transition-all duration-[2000ms] ease-out ${
                isVisible
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-20 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              {tier.isPopular && (
                <div className="absolute -top-4 left-0 right-0 text-center">
                  <span className="bg-custom-blue text-white text-sm font-medium px-4 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className={`h-full p-8 rounded-2xl bg-gray-800 border-2 transition-transform duration-300 hover:scale-[1.02] ${
                tier.isPopular ? 'border-custom-blue' : 'border-transparent'
              }`}>
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-white mb-4">{tier.name}</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-white">
                      ${isMonthly ? Math.round(tier.price / 6 / 50) * 50 : tier.price}
                    </span>
                    <span className="text-slate-400">
                      /{isMonthly ? 'month' : 'project'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 mt-2">
                    Timeline: {tier.timeline}
                  </p>
                </div>

                <ul className="space-y-4 mb-8">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-custom-blue flex-shrink-0 mt-0.5" />
                      <span className="text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button className={`w-full py-3 px-4 rounded-lg font-medium transition-colors duration-300 ${
                  tier.isPopular
                    ? 'bg-custom-blue text-white hover:opacity-90'
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}>
                  {tier.ctaText}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}