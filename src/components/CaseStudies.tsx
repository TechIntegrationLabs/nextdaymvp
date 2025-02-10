import { useInView } from '../hooks/useInView';

const caseStudies = [
  {
    title: 'AI-Powered SaaS Platform',
    description: 'Launched an AI analytics platform in just 2 weeks, achieving 10k+ users in the first month.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
    tags: ['AI/ML', 'React', 'Node.js'],
    results: [
      { metric: 'Development Time', value: '2 Weeks' },
      { metric: 'Initial Users', value: '10,000+' },
    ],
  },
  {
    title: 'E-commerce Mobile App',
    description: 'Built a complete e-commerce solution with AR try-on features in 3 weeks.',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800',
    tags: ['React Native', 'AR', 'Firebase'],
    results: [
      { metric: 'Development Time', value: '3 Weeks' },
      { metric: 'Conversion Rate', value: '+45%' },
    ],
  },
  {
    title: 'FinTech Dashboard',
    description: 'Developed a real-time financial analytics dashboard with AI predictions.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
    tags: ['Next.js', 'TensorFlow', 'AWS'],
    results: [
      { metric: 'Development Time', value: '4 Weeks' },
      { metric: 'Processing Speed', value: '10ms' },
    ],
  },
];

export function CaseStudies() {
  const [ref, isVisible] = useInView({ threshold: 0.1 });

  return (
    <section
      ref={ref}
      className="min-h-screen py-24 relative flex flex-col"
    >
      <div className="px-4 mb-12">
        <h2 className={`text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-8 transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          Case Studies
        </h2>
      </div>

      <div className="flex overflow-x-auto pb-8 px-4 scroll-smooth">
        {caseStudies.map((study, index) => (
          <div
            key={study.title}
            className="flex-none w-[calc(100vw-2rem)] md:w-[600px] mr-8 group transition-transform duration-2000 ease-out hover:scale-[0.98]"
          >
            <div
              className={`h-full bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg transition-all duration-[2000ms] ease-out ${
                isVisible
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-20 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 400}ms` }}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={study.image}
                  alt={study.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms] ease-out"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">
                  {study.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 mb-4">
                  {study.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {study.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full text-sm bg-violet-100 dark:bg-violet-900/50 text-violet-900 dark:text-violet-100"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {study.results.map((result) => (
                    <div key={result.metric}>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {result.metric}
                      </p>
                      <p className="text-lg font-semibold text-slate-900 dark:text-white">
                        {result.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}