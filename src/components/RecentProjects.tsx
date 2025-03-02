import { useInView } from '../hooks/useInView';
import { useState, useRef, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ExternalLink, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';
import useSWR from 'swr';
import { fetchProjects, type Project } from '../lib/sheets';

const fallbackProjects: Project[] = []; // Define fallback projects here

function ProjectCard({ project, index, hasAnimated, isSelected }: { 
  project: Project; 
  index: number;
  hasAnimated: boolean;
  isSelected: boolean;
}) {
  return (
    <div
      className={cn(
        "group relative rounded-xl shadow-lg overflow-hidden transition-all duration-1000 transform aspect-[16/9]",
        isSelected 
          ? "scale-110 z-10 md:w-[120%] md:-ml-[10%] w-full" 
          : "scale-95 opacity-50 w-full",
        hasAnimated ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
      )}
      style={{
        transitionDelay: `${index * 100}ms`,
        transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)"
      }}
    >
      {/* Full-size image background */}
      <div className="absolute inset-0">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          loading="lazy"
        />
        {!isSelected && (
          <div className="absolute inset-0 bg-black/40 transition-opacity duration-1000" />
        )}
      </div>

      {/* Glass-morphic text overlay */}
      <div className={cn(
        "absolute inset-x-0 bottom-0 p-4 md:p-6 backdrop-blur-md bg-black/30 transition-all duration-1000",
        isSelected ? "translate-y-0" : "translate-y-2 group-hover:translate-y-0"
      )}>
        <div className="relative z-10">
          <h3 className="text-lg md:text-xl font-semibold mb-2 text-white">{project.title}</h3>
          <p className="text-sm md:text-base text-gray-200 mb-4 line-clamp-2 opacity-90">{project.description}</p>
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sky-300 hover:text-sky-200 transition-colors text-sm md:text-base"
            >
              View Project <ExternalLink className="ml-1 w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function RecentProjects() {
  const { data: projects, error } = useSWR<Project[]>('projects', fetchProjects, {
    fallbackData: fallbackProjects,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 60000, // 1 minute
    onError: (err) => {
      console.error('Error loading projects:', err);
    }
  });
  const [ref, isVisible] = useInView({ threshold: 0.1 });
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);

  const autoplayOptions = useRef([
    Autoplay({
      delay: 4000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
      rootNode: (emblaRoot) => emblaRoot.parentElement,
    }),
  ]);
  
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: 'center',
      containScroll: 'trimSnaps',
      dragFree: true,
      loop: true
    },
    autoplayOptions.current
  );

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (isVisible && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [isVisible, hasAnimated]);

  if (error) return (
    <div className="min-h-[50vh] flex items-center justify-center text-red-400">
      Failed to load projects. Please try again later.
    </div>
  );
  
  if (!projects) return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-custom-blue" />
    </div>
  );

  return (
    <section 
      ref={ref} 
      className="py-24 pb-32 bg-black/5"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="container mx-auto px-4">
        <h2 className={`text-3xl md:text-5xl font-bold text-white mb-8 text-center transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          Recent Projects
        </h2>
        
        <div className="relative max-w-6xl mx-auto">
          <div 
            className="overflow-hidden py-20" 
            ref={emblaRef}
          >
            <div className="flex gap-12">
              {projects.map((project, index) => (
                <div key={project.id} className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_60%] lg:flex-[0_0_40%]">
                  <ProjectCard
                    project={project}
                    index={index}
                    hasAnimated={hasAnimated}
                    isSelected={index === selectedIndex}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            className={cn(
              "absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white transition-all",
              prevBtnEnabled ? "opacity-100 hover:bg-black/50" : "opacity-50 cursor-not-allowed"
            )}
            onClick={scrollPrev}
            disabled={!prevBtnEnabled}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            className={cn(
              "absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white transition-all",
              nextBtnEnabled ? "opacity-100 hover:bg-black/50" : "opacity-50 cursor-not-allowed"
            )}
            onClick={scrollNext}
            disabled={!nextBtnEnabled}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  );
}