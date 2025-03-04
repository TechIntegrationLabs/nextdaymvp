import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useSWR from 'swr';
import { fetchProjects, Project, fallbackProjects } from '../lib/sheets';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useInView } from '../hooks/useInView';
import { cn } from '../lib/utils';

export default function RecentProjects() {
  // Use SWR for data fetching with improved configuration
  const { data: rawProjects, error, isLoading, mutate } = useSWR<Project[]>(
    'projects', 
    fetchProjects,
    {
      revalidateOnFocus: false,
      errorRetryCount: 3,
      dedupingInterval: 60000, // 1 minute
      refreshInterval: 300000, // 5 minutes
      onError: (err) => console.error('SWR Error fetching projects:', err)
    }
  );

  // State for projects and carousel
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [ref, isVisible] = useInView({ threshold: 0.1 });
  
  // Projects per page (2 per row, 2 rows = 4 per page)
  const projectsPerPage = 4;
  
  // Calculate total pages
  const totalPages = Math.ceil((projects?.length || 0) / projectsPerPage);
  
  // Debug logging
  useEffect(() => {
    console.log('RecentProjects component state:', {
      rawProjects: rawProjects ? `${rawProjects.length} projects` : 'none',
      error: error ? 'Error fetching projects' : 'No error',
      isLoading,
      usingFallback: !rawProjects && !isLoading,
      currentPage,
      totalPages
    });
    
    if (error) {
      console.error('Error details:', error);
    }
    
    if (rawProjects && rawProjects.length > 0) {
      console.log('First project sample:', rawProjects[0]);
    }
  }, [rawProjects, error, isLoading, currentPage, totalPages]);

  // Update projects when data changes
  useEffect(() => {
    if (rawProjects && rawProjects.length > 0) {
      setProjects(rawProjects);
    } else if (!isLoading && (!rawProjects || rawProjects.length === 0)) {
      // Use fallback projects if no data is available and not loading
      console.log('Using fallback projects');
      setProjects(fallbackProjects);
    }
  }, [rawProjects, isLoading]);

  // Manual retry function
  const handleRetry = async () => {
    console.log('Manually retrying project fetch');
    await mutate();
  };
  
  // Navigation functions
  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      // Loop back to first page
      setCurrentPage(0);
    }
  };
  
  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    } else {
      // Loop to last page
      setCurrentPage(totalPages - 1);
    }
  };
  
  // Get current page projects
  const getCurrentPageProjects = () => {
    const startIndex = currentPage * projectsPerPage;
    return projects.slice(startIndex, startIndex + projectsPerPage);
  };
  
  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      if (!hoveredProject) { // Only auto-advance if not hovering
        nextPage();
      }
    }, 8000); // Change slide every 8 seconds
    
    return () => clearInterval(interval);
  }, [currentPage, hoveredProject, totalPages]);

  return (
    <section ref={ref} className="py-24 bg-gray-950 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl opacity-50"></div>
      </div>
      
      <div className="container px-4 mx-auto relative z-10">
        <div className="flex flex-col items-center mb-16 text-center">
          <h2 className={cn(
            "text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300 mb-8 relative inline-block",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
            "transition-all duration-1000 ease-out"
          )}>
            Recent Projects
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
            Check out some of our recent work. We've helped businesses of all sizes bring their ideas to life.
          </p>
          
          {/* Show retry button if there was an error */}
          {error && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={handleRetry}
              className="px-6 py-2.5 mt-6 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            >
              Retry Loading Projects
            </motion.button>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center w-full h-96">
            <div className="w-16 h-16 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
          </div>
        ) : (
          <div className="relative">
            {/* Carousel container */}
            <div 
              ref={carouselRef}
              className="overflow-hidden rounded-xl"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPage}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-8"
                >
                  {getCurrentPageProjects().map((project, index) => (
                    <motion.div
                      key={project.id || index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="relative h-[400px] group rounded-xl overflow-hidden border border-gray-800 shadow-xl"
                      onMouseEnter={() => setHoveredProject(project.id)}
                      onMouseLeave={() => setHoveredProject(null)}
                    >
                      {/* Project image */}
                      <div className="absolute inset-0 w-full h-full">
                        {project.image ? (
                          <img
                            src={project.image}
                            alt={project.title}
                            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                            onError={(e) => {
                              console.warn(`Failed to load image for project: ${project.title}`);
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x400?text=Project+Image';
                            }}
                          />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full bg-gray-800 text-gray-400">
                            <span>No image available</span>
                          </div>
                        )}
                        
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent opacity-80"></div>
                      </div>
                      
                      {/* Project type badge */}
                      <div className="absolute top-4 left-4 px-3 py-1 text-xs font-medium text-blue-300 bg-blue-900/50 backdrop-blur-sm rounded-full border border-blue-700/50">
                        {project.type || 'Project'}
                      </div>
                      
                      {/* Project title always visible at bottom */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 transform transition-transform duration-500">
                        <h3 className="text-2xl font-bold text-white mb-2">{project.title}</h3>
                      </div>
                      
                      {/* Details panel that slides up on hover */}
                      <div 
                        className={`absolute inset-0 bg-gray-900/95 p-6 flex flex-col transition-transform duration-500 ease-in-out transform ${
                          hoveredProject === project.id ? 'translate-y-0' : 'translate-y-full'
                        }`}
                      >
                        <h3 className="text-2xl font-bold text-white mb-2">{project.title}</h3>
                        <p className="text-gray-300 mb-4 flex-grow">{project.description}</p>
                        
                        {/* Technologies */}
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold text-gray-200 mb-2">Technologies</h4>
                          <div className="flex flex-wrap gap-2">
                            {project.technologies && project.technologies.split(',').map((tech, i) => (
                              <span
                                key={i}
                                className="inline-block px-2.5 py-1 text-xs font-medium text-blue-300 bg-blue-900/30 rounded-md border border-blue-800/50"
                              >
                                {tech.trim()}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        {/* Client if available */}
                        {project.client && (
                          <div className="mb-4">
                            <h4 className="text-sm font-semibold text-gray-200 mb-1">Client</h4>
                            <p className="text-gray-300">{project.client}</p>
                          </div>
                        )}
                        
                        {/* View project button */}
                        {project.link && (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center px-4 py-2.5 font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-300 mt-auto"
                          >
                            View Project
                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                            </svg>
                          </a>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* Navigation arrows */}
            <button 
              onClick={prevPage}
              className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 md:-ml-6 w-12 h-12 rounded-full bg-gray-900/80 text-white flex items-center justify-center border border-gray-700 hover:bg-blue-600 transition-colors z-20"
              aria-label="Previous projects"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <button 
              onClick={nextPage}
              className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 md:-mr-6 w-12 h-12 rounded-full bg-gray-900/80 text-white flex items-center justify-center border border-gray-700 hover:bg-blue-600 transition-colors z-20"
              aria-label="Next projects"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            
            {/* Pagination indicators */}
            <div className="flex justify-center mt-8 space-x-2">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    currentPage === index 
                      ? 'bg-blue-500 w-8' 
                      : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                  aria-label={`Go to page ${index + 1}`}
                />
              ))}
            </div>
          </div>
        )}
        
        {/* Call to action */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-20 text-center"
        >
          <div className="inline-block px-6 py-1.5 bg-blue-500/10 rounded-full text-blue-400 font-medium text-sm mb-4">
            Ready to build your next big thing?
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Let's transform your vision into reality
          </h3>
          <p className="text-gray-300 max-w-2xl mx-auto mb-8">
            Our AI-powered development process can help you launch faster, with better quality, and at a lower cost.
          </p>
          <a
            href="#contact"
            className="inline-flex items-center px-8 py-3.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-300"
          >
            Get Started Today
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}