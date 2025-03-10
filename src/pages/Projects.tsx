
import { useRef, useEffect, useState } from 'react';
import { ChevronDown, Github, Globe, FileText } from 'lucide-react';
import gsap from 'gsap';

const projects = [
  {
    id: 'project1',
    title: 'UAV Classification',
    description: 'Transformer and CNN model training on a limited spectral dataset. Currently under review for publication(s).',
    tags: ['Python', 'Pytorch', 'Transformers', 'Docker'],
    dateRange: 'Sep 2024 - Present',
    links: {
      github: 'https://github.com/AndrewPBerg/UAV_Classification',
      website: null,
      paper: null
    }
  },
  {
    id: 'project2',
    title: 'DNS Fuzzing',
    description: 'Domain monitoring and secutiry analysis tool. Currently under private development.',
    tags: ['Python', 'React', 'Docker', 'Pub/Sub', 'MySQL'],
    dateRange: 'Jan 2025 - Present',
    links: {
      github: null,
      website: null,
      paper: null
    }
  },
  {
    id: 'project5',
    title: 'andrewpberg.github.io',
    description: 'This website! Personal Portfolio Website.',
    tags: ['React', 'Shadcn', 'Vite'],
    dateRange: 'Jan 2025 - Present',
    links: {
      github: 'https://github.com/AndrewPBerg/andrewpberg.github.io',
      website: 'https://andrewpberg.github.io',
      paper: null
    }
  },
  {
    id: 'project4',
    title: 'Dope Dictionary',
    description: 'AI dictionary of custom styles and words.',
    tags: ['Python', 'GoogleAI', 'Spring Boot', 'Django'],
    dateRange: 'Nov 2024 - Dec 2024',
    links: {
      github: 'https://github.com/AndrewPBeratings-prediction',
      website: null,
      paper: null
    }
  },
  {
    id: 'project3',
    title: 'Wine Price Regression',
    description: 'Machine/Deep Learning models for prediction wine prices from web scraped data.',
    tags: ['Python', 'Jupyter', 'Pandas', 'Scikit-learn', 'Pytorch', 'Matplotlib', 'Seaborn'],
    dateRange: 'Nov 2024 - Dec 2024',
    links: {
      github: 'https://github.com/riordanaa/Wine---price-ratings-prediction',
      website: null,
      paper: null
    }
  },

];

const Projects = () => {
  const projectsRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(false);
  
  useEffect(() => {
    if (!scrollIndicatorRef.current || !projectsRef.current) return;
    
    const tl = gsap.timeline({
      repeat: -1,
      repeatDelay: 0.5
    });
    
    tl.to(scrollIndicatorRef.current, {
      y: 6,
      duration: 0.8,
      ease: "sine.inOut"
    })
    .to(scrollIndicatorRef.current, {
      y: 0,
      duration: 0.8,
      ease: "sine.inOut"
    });
    
    const handleScroll = () => {
      if (!projectsRef.current) return;
      
      const { scrollTop, scrollHeight, clientHeight } = projectsRef.current;
      const reachedBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 5;
      
      setIsAtBottom(reachedBottom);
      
      if (reachedBottom) {
        gsap.to(scrollIndicatorRef.current, {
          rotation: 180,
          duration: 0.3,
          ease: "power2.out"
        });
      } else {
        gsap.to(scrollIndicatorRef.current, {
          rotation: 0,
          duration: 0.3,
          ease: "power2.out"
        });
      }
    };
    
    const projectsElement = projectsRef.current;
    projectsElement.addEventListener('scroll', handleScroll);
    
    return () => {
      tl.kill();
      if (projectsElement) {
        projectsElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);
  
  const handleScrollClick = () => {
    if (!projectsRef.current) return;
    
    const projectsElement = projectsRef.current;
    
    if (isAtBottom) {
      gsap.to(projectsElement, {
        scrollTop: 0,
        duration: 0.8,
        ease: "power2.inOut"
      });
    } else {
      const pageHeight = projectsElement.clientHeight;
      const newScrollTop = projectsElement.scrollTop + pageHeight * 0.8;
      
      gsap.to(projectsElement, {
        scrollTop: newScrollTop,
        duration: 0.5,
        ease: "power2.out"
      });
    }
  };
  
  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground mb-4">
        Projects are updated as I see fit. Some are open-source, some are not. <br />
        Listed by importance.
      </p>
      
      <div className="relative">
        <div ref={projectsRef} className="space-y-8 max-h-[400px] invisible-scroll pb-8">
          {projects.map((project) => (
            <div 
              key={project.id} 
              className="group relative"
            >
              <h3 className="text-base font-medium font-display mb-1">{project.title}</h3>
              <p className="text-xs text-muted-foreground mb-2">{project.dateRange}</p>
              <p className="mt-1 text-xs text-foreground/90">{project.description}</p>
              
              {/* Project links */}
              <div className="mt-3 flex items-center gap-3">
                {project.links.github && (
                  <a 
                    href={project.links.github} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="GitHub Repository"
                  >
                    <Github size={16} />
                  </a>
                )}
                
                {project.links.website && (
                  <a 
                    href={project.links.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Project Website"
                  >
                    <Globe size={16} />
                  </a>
                )}
                
                {project.links.paper && (
                  <a 
                    href={project.links.paper} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Research Paper"
                  >
                    <FileText size={16} />
                  </a>
                )}
              </div>
              
              <div className="mt-3 flex flex-wrap gap-1">
                {project.tags.map((tag) => (
                  <span key={tag} className="px-1.5 py-0.5 bg-secondary/50 text-secondary-foreground rounded-full text-[10px]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div 
          ref={scrollIndicatorRef}
          onClick={handleScrollClick}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-secondary/30 backdrop-blur-sm cursor-pointer hover:bg-secondary/50 transition-colors"
        >
          <ChevronDown size={16} className="text-muted-foreground" />
        </div>
      </div>
    </div>
  );
};

export default Projects;
