import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import useSWR from 'swr';
import { fetchProjects, testGoogleSheetsAccess, fallbackProjects } from '../lib/sheets';
import { ArrowLeft, ArrowRight, ArrowUpRight, Code, Filter, Layers, Star } from 'lucide-react';
import { cn } from '../lib/utils';
import { getRandomFallbackImage } from '../lib/fallbackImages';

// Define the Project type
interface Project {
  id: string;
  title: string;
  description: string;
  image?: string;
  link?: string;
  type?: string;
  client?: string;
  technologies?: string;
}

// Enhanced project type with additional data
interface EnhancedProject {
  id: string;
  title: string;
  description: string;
  image: string;
  link?: string;
  type?: string;
  client?: string;
  category: string;
  features: string[];
  results: { metric: string; value: string }[];
  url: string;
  technologies: string[];
}

// Helper function to generate features from description and technologies
const generateFeaturesFromDescription = (): string[] => {
  // For now, just create some generic features based on project type
  return [
    'Responsive design for all devices',
    'Secure API integration',
    'Fast loading and optimized performance',
    'Modern user interface with intuitive UX'
  ];
};

// Helper function to enhance projects with additional data
const enhanceProjects = (projects: Project[]): EnhancedProject[] => {
  console.log('Enhancing projects:', projects);
  
  if (!projects || projects.length === 0) {
    console.warn('No projects to enhance or projects is undefined');
    return [];
  }
  
  return projects.map(project => {
    console.log('Processing project for enhancement:', project);
    
    // Map the original project type to a category
    const category = project.type || 'Other';
    
    // Generate features based on technologies and description
    const features = generateFeaturesFromDescription();
    
    // Generate mock results
    const results = [
      { metric: 'Development Time', value: '8-12 weeks' },
      { metric: 'Cost Savings', value: '35-45%' },
      { metric: 'User Satisfaction', value: '95%' }
    ];
    
    // Use fallback image if none provided
    const image = project.image && project.image.trim() !== '' 
      ? project.image 
      : getRandomFallbackImage();
    
    // Convert technologies string to array
    const technologiesArray = project.technologies 
      ? project.technologies.split(',').map(t => t.trim()).filter(t => t !== '')
      : [];
    
    const enhancedProject = {
      id: project.id,
      title: project.title,
      description: project.description,
      image,
      link: project.link,
      type: project.type,
      client: project.client,
      category,
      features,
      results,
      url: project.link || '#',
      technologies: technologiesArray
    };
    
    console.log('Enhanced project:', enhancedProject);
    return enhancedProject;
  });
};

export default function RecentProjects() {
  const { data: rawProjects, error, isLoading } = useSWR<Project[]>('projects', fetchProjects);
  const [projects, setProjects] = useState<EnhancedProject[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const projectsPerPage = 2; // Show fewer projects per page to make them larger
  
  console.log('SWR Data State:', { 
    rawProjects, 
    error: error ? (error instanceof Error ? error.message : 'Unknown error') : null, 
    isLoading 
  });

  // Refs for scroll animation
  const sectionRef = useRef<HTMLElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  
  // Process the raw projects when they load
  useEffect(() => {
    const initialize = async () => {
      // Test Google Sheets API access when component loads
      console.log('Testing Google Sheets API access...');
      const success = await testGoogleSheetsAccess().catch(e => {
        console.error('Error during API test:', e);
        return false;
      });
      
      console.log('Google Sheets API test result:', success);
      
      // Handle API access issues
      if (!success) {
        console.log('API access test failed, using fallback projects');
        const enhanced = enhanceProjects(fallbackProjects);
        setProjects(enhanced);
        return;
      }
      
      // Handle successful API response but no projects
      if (rawProjects && Array.isArray(rawProjects)) {
        if (rawProjects.length === 0) {
          console.log('API returned empty projects array, using fallback projects');
          const enhanced = enhanceProjects(fallbackProjects);
          setProjects(enhanced);
        } else {
          console.log('Raw projects from Google Sheets:', rawProjects);
          const enhanced = enhanceProjects(rawProjects);
          console.log('Enhanced projects:', enhanced);
          setProjects(enhanced);
        }
      } else if (error || !rawProjects) {
        console.log('SWR returned error or no data, using fallback projects');
        const enhanced = enhanceProjects(fallbackProjects);
        setProjects(enhanced);
      }
    };
    
    initialize();
  }, [rawProjects, error]);
  
  // Toggle project details
  const toggleProjectDetails = (projectId: string) => {
    setActiveProject(activeProject === projectId ? null : projectId);
  };
  
  // Filter projects by category
  const filteredProjects = selectedCategory 
    ? projects?.filter(project => project.category === selectedCategory) 
    : projects;
    
  // Get unique categories for filter
  const categories = [...new Set(projects?.map(project => project.category))];
  
  // Calculate pagination
  const pageCount = filteredProjects ? Math.ceil(filteredProjects.length / projectsPerPage) : 0;
  const currentProjects = filteredProjects?.slice(
    currentPage * projectsPerPage, 
    (currentPage + 1) * projectsPerPage
  );
  
  // Intersection observer for scroll animation
  useEffect(() => {
    if (!sectionRef.current || hasAnimated) return;
    
    const observedElement = sectionRef.current;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.1 }
    );
    
    observer.observe(observedElement);
    
    return () => {
      observer.unobserve(observedElement);
    };
  }, [hasAnimated]);
  
  // Pagination controls
  const nextPage = () => {
    if (currentPage < pageCount - 1) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  if (error) return <div>Failed to load projects</div>;
  if (!projects.length) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-custom-blue border-t-transparent rounded-full animate-spin"></div></div>;
  
  return (
    <section ref={sectionRef} className="py-20 bg-gray-950 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 right-0 w-96 h-96 bg-custom-blue/5 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl opacity-50"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section title and filter controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 space-y-6 md:space-y-0">
          {/* Section title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={hasAnimated ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="space-y-2"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Recent Projects
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl">
              See how we've transformed ideas into powerful applications with our AI-powered development process.
            </p>
          </motion.div>
          
          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={hasAnimated ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap items-center gap-2"
          >
            <div className="flex items-center text-gray-400 mr-2">
              <Filter className="w-4 h-4 mr-1" />
              <span className="text-sm">Filter:</span>
            </div>
            <button
              onClick={() => setSelectedCategory(null)}
              className={cn(
                "px-3 py-1.5 text-sm rounded-full transition-all",
                !selectedCategory 
                  ? "bg-custom-blue text-white" 
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              )}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  "px-3 py-1.5 text-sm rounded-full transition-all",
                  selectedCategory === category 
                    ? "bg-custom-blue text-white" 
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                )}
              >
                {category}
              </button>
            ))}
          </motion.div>
        </div>
        
        {/* Project Grid - Simplified for better visibility */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {currentProjects?.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              animate={hasAnimated ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              className="relative"
            >
              <div 
                className="relative h-[450px] rounded-xl overflow-hidden border border-gray-800 cursor-pointer"
                onClick={() => toggleProjectDetails(project.id)}
              >
                {/* Project Image */}
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>
                
                {/* Category Tag */}
                <div className="absolute top-4 left-4 px-3 py-1 bg-gray-900/80 rounded-full text-sm font-medium text-custom-blue border border-gray-700">
                  {project.category}
                </div>
                
                {/* Project Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{project.title}</h3>
                  <p className="text-gray-300 text-sm line-clamp-2">{project.description}</p>
                </div>
                
                {/* Project Details Panel - Slides up from bottom */}
                <div 
                  className={cn(
                    "absolute inset-0 bg-gray-900/95 p-6 transition-transform duration-500 transform overflow-auto",
                    activeProject === project.id ? "translate-y-0" : "translate-y-full"
                  )}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-1">{project.title}</h3>
                      <div className="inline-flex items-center px-3 py-1 bg-gray-800/80 rounded-full text-sm font-medium text-custom-blue">
                        {project.category}
                      </div>
                    </div>
                    {project.client && (
                      <div className="text-right">
                        <div className="text-xs text-gray-400">Client</div>
                        <div className="text-sm text-white">{project.client}</div>
                      </div>
                    )}
                  </div>
                  
                  <div className="mb-6">
                    <p className="text-gray-300 text-sm leading-relaxed">{project.description}</p>
                  </div>
                  
                  {/* Technologies */}
                  <div className="flex flex-col gap-2 mt-4">
                    <h4 className="text-sm font-semibold text-gray-200 flex items-center">
                      <Code className="h-4 w-4 mr-2" />
                      Technologies
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies && project.technologies.length > 0 ? (
                        project.technologies.map((tech, techIndex) => (
                          <span 
                            key={`${tech}-${techIndex}`}
                            className="inline-flex items-center px-2 py-1 bg-gray-800 rounded-md text-xs text-gray-300"
                          >
                            {tech}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-400">No technologies specified</span>
                      )}
                    </div>
                  </div>
                  
                  {/* Key features */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center">
                      <Layers className="w-4 h-4 mr-1 text-custom-blue" />
                      Key Features
                    </h4>
                    <ul className="space-y-1">
                      {project.features.map((feature: string) => (
                        <li key={feature} className="text-xs text-gray-400 flex items-start">
                          <span className="inline-block w-1 h-1 bg-custom-blue rounded-full mt-1.5 mr-2"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Results Grid */}
                  {project.results && (
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center">
                        <Star className="w-4 h-4 mr-1 text-custom-blue" />
                        Results
                      </h4>
                      <div className="grid grid-cols-3 gap-2">
                        {project.results.map((result: { metric: string, value: string }) => (
                          <div key={result.metric} className="bg-gray-800/50 rounded-lg p-2 text-center">
                            <div className="text-custom-blue font-bold text-lg">{result.value}</div>
                            <div className="text-gray-400 text-xs">{result.metric}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* View project link */}
                  <a 
                    href={project.url} 
                    className="inline-flex items-center justify-center px-4 py-2 bg-custom-blue text-white font-medium rounded-full hover:bg-blue-600 transition-colors mt-4"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    View Project
                    <ArrowUpRight className="w-4 h-4 ml-1" />
                  </a>
                  
                  {/* Close Button */}
                  <button
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleProjectDetails(project.id);
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Pagination controls */}
        {pageCount > 1 && (
          <div className="flex justify-center items-center space-x-4">
            <button
              onClick={prevPage}
              disabled={currentPage === 0}
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                currentPage === 0 
                  ? "bg-gray-800 text-gray-600 cursor-not-allowed" 
                  : "bg-gray-800 text-white hover:bg-custom-blue"
              )}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            
            <div className="text-gray-400">
              Page {currentPage + 1} of {pageCount}
            </div>
            
            <button
              onClick={nextPage}
              disabled={currentPage === pageCount - 1}
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                currentPage === pageCount - 1 
                  ? "bg-gray-800 text-gray-600 cursor-not-allowed" 
                  : "bg-gray-800 text-white hover:bg-custom-blue"
              )}
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
        
        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={hasAnimated ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-20 text-center"
        >
          <div className="inline-block px-6 py-1.5 bg-custom-blue/10 rounded-full text-custom-blue font-medium text-sm mb-4">
            Ready to build your next big thing?
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Let's transform your vision into reality
          </h3>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">
            Our AI-powered development process can help you launch faster, with better quality, and at a lower cost.
          </p>
          <a
            href="#contact"
            className="inline-flex items-center px-8 py-3 bg-custom-blue text-white font-medium rounded-full hover:bg-blue-600 transition-colors"
          >
            Get Started Today
            <ArrowRight className="w-5 h-5 ml-2" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}