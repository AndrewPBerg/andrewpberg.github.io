import { useRef, useEffect, useState } from 'react';
import { FileText, ExternalLink, Youtube, ChevronDown } from 'lucide-react';
import gsap from 'gsap';

const Publications = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const publications = [
    {
      title: "4,500 Seconds: Small Data Training Approaches for Deep UAV Audio Classification",
      authors: "Berg, Zhang, Wang",
      venue: "Intl. Conf. on DATA Science, Technology, and Applications",
      season: "Spring 2025",
      link: "https://arxiv.org/abs/2505.23782",
      youtubeLink: "https://www.youtube.com/watch?v=zFLgPipWOqI",
      tags: ["Best Student Paper", "Oral", "Conference"]
    },
    {
      title: "15,500 Seconds: Lean UAV Classification Leveraging PEFT and Pre-Trained Networks",
      authors: "Berg, Zhang, Wang",
      venue: "Under Review",
      season: "Summer 2025",
      link: "https://arxiv.org/abs/2506.11049",
      tags: ["Preprint"]
    },
  ];

  // Get unique tags for filtering
  const tags = ['All', ...Array.from(new Set(publications.flatMap(pub => pub.tags)))];
  
  // Filter publications based on selected tag
  const filteredPublications = selectedTag === 'All' 
    ? publications 
    : publications.filter(pub => pub.tags.includes(selectedTag));

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!scrollIndicatorRef.current || !contentRef.current) return;
    
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
      if (!contentRef.current) return;
      
      const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
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
    
    const contentElement = contentRef.current;
    contentElement.addEventListener('scroll', handleScroll);
    
    return () => {
      tl.kill();
      if (contentElement) {
        contentElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const handleScrollClick = () => {
    if (!contentRef.current) return;
    
    const contentElement = contentRef.current;
    
    if (isAtBottom) {
      gsap.to(contentElement, {
        scrollTop: 0,
        duration: 0.8,
        ease: "power2.inOut"
      });
    } else {
      const pageHeight = contentElement.clientHeight;
      const newScrollTop = contentElement.scrollTop + pageHeight * 0.8;
      
      gsap.to(contentElement, {
        scrollTop: newScrollTop,
        duration: 0.5,
        ease: "power2.out"
      });
    }
  };
  
  return (
    <div className="space-y-4 antialiased will-change-transform">
      <p className="text-xs text-muted-foreground">
        Selected research papers, articles, and technical writing hosted elsewhere.
      </p>

      {/* Tag Filter Dropdown */}
      <div ref={dropdownRef} className="relative mb-4">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2 px-2 py-1.5 text-xs bg-muted/30 hover:bg-muted/50 border border-border/30 rounded-md transition-colors w-full max-w-36"
        >
          <span className="flex-1 text-left">{selectedTag}</span>
          <ChevronDown 
            size={10} 
            className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
          />
        </button>
        
        {isDropdownOpen && (
          <div className="absolute top-full left-0 mt-1 w-full max-w-36 bg-background border border-border/30 rounded-md shadow-lg z-10 overflow-hidden">
            <div className="max-h-[168px] overflow-y-auto scrollbar-thin">
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    setSelectedTag(tag);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full px-2 py-1.5 text-xs text-left hover:bg-muted/30 transition-colors ${
                    selectedTag === tag
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="relative">
        <div ref={contentRef} className="space-y-3 pt-2 max-h-[400px] overflow-y-auto pb-8 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/50 hover:scrollbar-thumb-white/70">
          {filteredPublications.map((pub, index) => (
            <div key={index} className="border-l-2 border-primary/20 pl-3 space-y-1">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-xs font-medium text-foreground leading-relaxed">
                  {pub.title}
                </h3>
                <div className="flex flex-col items-center gap-2 flex-shrink-0">
                  {pub.youtubeLink && (
                    <a 
                      href={pub.youtubeLink}
                      className="text-red-500 hover:text-red-600 transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                      title="YouTube Presentation"
                    >
                      <Youtube size={16} />
                    </a>
                  )}
                  <a 
                    href={pub.link}
                    className="text-primary hover:text-primary/80 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="View Publication"
                  >
                    <ExternalLink size={16} />
                  </a>
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground">
                {pub.authors}
              </p>
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                <span>{pub.venue} • {pub.season}</span>
              </div>
              <div className="flex items-center gap-1 mt-1 flex-wrap">
                {pub.tags.map((tag, tagIndex) => (
                  <span key={tagIndex} className="text-[9px] text-muted-foreground/70 px-1.5 py-0.5 bg-muted/30 rounded-full">
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

export default Publications; 