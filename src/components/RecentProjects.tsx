import { useInView } from '../hooks/useInView';
import useSWR from 'swr';
import { fetchProjects, type Project } from '../lib/sheets';
import { ExternalLink, Loader2, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

function ProjectCard({ project, index, isVisible }: { 
  project: Project; 
  index: number;
  isVisible: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={cardRef}
      className={`group transition-all duration-[2000ms] ease-out ${
        isVisible
          ? 'translate-y-0 opacity-100'
          : 'translate-y-20 opacity-0'
      } snap-center flex-none w-[90vw] md:w-[60vw] lg:w-[50vw] px-4`}
      style={{ 
        transitionDelay: `${index * 150}ms`,
      }}
    >
      <div className="h-full bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full text-left focus:outline-none focus:ring-2 focus:ring-sky-600 focus:ring-inset rounded-t-2xl"
        >
          <div className="relative h-80 overflow-hidden">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms] ease-out"
            />
          </div>
          <div className="p-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-white">
                {project.title}
              </h3>
              <ChevronDown
                className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${
                  isExpanded ? 'rotate-180' : ''
                }`}
              />
            </div>
          </div>
        </button>

        <div
          className={`transition-all duration-500 ease-in-out ${
            isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
          } overflow-hidden`}
        >
          <div className="p-6 pt-0">
            <p className="text-slate-200 mb-6">
              {project.description}
            </p>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 rounded-full text-sm bg-sky-800 text-sky-50"
                >
                  {tech}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-300">
                Type: <span className="text-sky-400">{project.type}</span>
              </div>
              
              {project.link && (
                <a
                  href={project.link.startsWith('http') ? project.link : `https://${project.link}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-500 transition-colors"
                >
                  View Live Site
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function RecentProjects() {
  const [ref, isVisible] = useInView({ threshold: 0.1 });
  const { data: projects, error, isLoading } = useSWR('projects', fetchProjects);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollToProject = (index: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const cards = container.children;
    if (index >= 0 && index < cards.length) {
      cards[index].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
      setActiveIndex(index);
    }
  };

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container || !projects) return;

    // Calculate the center point of the viewport
    const viewportCenter = container.scrollLeft + container.offsetWidth / 2;
    
    // Find which card's center is closest to the viewport center
    let closestIndex = 0;
    let minDistance = Infinity;
    
    Array.from(container.children).forEach((child, index) => {
      const rect = child.getBoundingClientRect();
      const cardCenter = container.scrollLeft + rect.left + rect.width / 2;
      const distance = Math.abs(viewportCenter - cardCenter);
      
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });
    
    if (closestIndex !== activeIndex) {
      setActiveIndex(closestIndex);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [activeIndex]);

  return (
    <section ref={ref} className="min-h-screen py-24 relative">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className={`text-3xl md:text-5xl font-bold text-white mb-16 transition-all duration-1000 section-title ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          Recent Projects
        </h2>

        {isLoading && (
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-8 h-8 text-sky-600 animate-spin" />
          </div>
        )}

        {error && (
          <div className="text-center text-red-600 dark:text-red-400 py-12">
            <p>Failed to load projects. Please try again later.</p>
          </div>
        )}

        {projects && (
          <div className="relative">
            <div
              ref={scrollContainerRef}
              className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none -mx-8 px-4 pb-8 scroll-smooth"
            >
              {projects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                  isVisible={isVisible}
                />
              ))}
            </div>

            <button
              onClick={() => scrollToProject(activeIndex - 1)}
              className={`absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-gray-800/80 backdrop-blur-sm text-white transition-opacity ${
                activeIndex === 0 ? 'opacity-0' : 'opacity-100'
              }`}
              disabled={activeIndex === 0}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={() => scrollToProject(activeIndex + 1)}
              className={`absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-gray-800/80 backdrop-blur-sm text-white transition-opacity ${
                activeIndex === (projects.length - 1) ? 'opacity-0' : 'opacity-100'
              }`}
              disabled={activeIndex === projects.length - 1}
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <div className="flex justify-center gap-2 mt-8">
              {projects.map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollToProject(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === activeIndex
                      ? 'bg-sky-500 w-6'
                      : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                  aria-label={`Go to project ${index + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}