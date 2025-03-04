import { useInView } from '../hooks/useInView';
import { Bot, Zap, Brain, Code, ExternalLink, Loader2 } from 'lucide-react';
import useSWR from 'swr';
import { fetchAITools, type AITool } from '../lib/sheets';

const iconMap = {
  Bot: <Bot className="w-6 h-6" />,
  Code: <Code className="w-6 h-6" />,
  Zap: <Zap className="w-6 h-6" />,
  Brain: <Brain className="w-6 h-6" />,
};

export function AITools() {
  const [ref, isVisible] = useInView({ threshold: 0.1 });
  const { data: tools, error, isLoading } = useSWR('ai-tools', fetchAITools);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        <div ref={ref} className="space-y-16">
          <div className={`max-w-3xl transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
          }`}>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-8">
              AI Development Tools
            </h1>
            <p className="text-xl text-slate-300">
              Explore our suite of AI-powered development tools designed to accelerate
              your workflow and improve code quality. From automated testing to
              intelligent code completion, we've got you covered.
            </p>
          </div>

          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-custom-blue animate-spin" />
            </div>
          )}

          {error && (
            <div className="text-center text-red-400 py-12">
              <p>Failed to load AI tools. Please try again later.</p>
            </div>
          )}

          {tools && (
          <div className="grid md:grid-cols-2 gap-8">
            {tools.map((tool, index) => (
              <div
                key={tool.id}
                className={`group relative transition-all duration-[2000ms] ${
                  isVisible
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-20 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="h-full p-8 rounded-2xl bg-gray-800 border-2 border-transparent hover:border-custom-blue transition-all duration-300">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="p-3 rounded-xl bg-custom-blue/10 text-custom-blue">
                      {iconMap[tool.icon as keyof typeof iconMap] || <Bot className="w-6 h-6" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-2xl font-bold text-white">
                          {tool.name}
                        </h2>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          tool.status === 'Live'
                            ? 'bg-emerald-900/50 text-emerald-300'
                            : tool.status === 'Beta'
                            ? 'bg-amber-900/50 text-amber-300'
                            : tool.status === 'Alpha'
                            ? 'bg-rose-900/50 text-rose-300'
                            : 'bg-slate-900/50 text-slate-300'
                        }`}>
                          {tool.status}
                        </span>
                      </div>
                      <p className="text-slate-300">
                        {tool.description}
                      </p>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {tool.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-slate-300">
                        <div className="w-1.5 h-1.5 rounded-full bg-custom-blue" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <a
                    href={tool.link}
                    className="inline-flex items-center gap-2 text-custom-blue hover:text-white transition-colors"
                  >
                    Learn more
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
          )}
        </div>
      </div>
    </div>
  );
}