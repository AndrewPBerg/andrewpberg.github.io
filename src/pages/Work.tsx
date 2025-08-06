import { useState, useMemo, useRef, useEffect } from 'react';
import { Github, Globe, FileText, ChevronDown, File, Youtube } from 'lucide-react';
import gsap from 'gsap';

const workItems = [
  {
    id: 'work1',
    title: 'UAV Classification',
    description: 'Transformer and CNN model training on a limited spectral dataset. Currently under review for publication(s).',
    tags: ['Deep Learning','Signal Processing'],
    dateRange: 'Sep 2024 - Present',
    links: {
      github: 'https://github.com/AndrewPBerg/UAV_Classification',
      website: null,
      paper: null,
      pdfs: null,
      youtube: null
    }
  },
  {
    id: 'work2',
    title: 'Fuzzify',
    description: 'Domain impersonation analysis tool. Submitted for Senior Capstone Project',
    tags: ['Full-Stack'],
    dateRange: 'Jan 2025 - Apr 2025',
    links: {
      github: 'https://github.com/AndrewPBerg/Fuzzify',
      website: 'https://fuzzify-jade.vercel.app/',
      paper: null,
      pdfs: null,
      youtube: 'https://www.youtube.com/watch?v=olAi481-A0Y'
    }
  },
  {
    id: 'project5',
    title: 'andrewpberg.github.io',
    description: 'This website! Personal Portfolio Website.',
    tags: ['React'],
    dateRange: 'Jan 2025 - Present',
    links: {
      github: 'https://github.com/AndrewPBerg/andrewpberg.github.io',
      website: 'https://andrewpberg.github.io',
      paper: null,
      pdfs: null,
      youtube: null
    }
  },
  {
    id: 'work4',
    title: 'Dope Dictionary',
    description: 'AI dictionary of custom styles and words.',
    tags: ['Spring Boot'],
    dateRange: 'Nov 2024 - Dec 2024',
    links: {
      github: 'https://github.com/AndrewPBerg/Dope_Dictionary',
      website: null,
      paper: null,
      pdfs: null,
      youtube: null
    }
  },
  {
    id: 'work5',
    title: 'Wine Price Regression',
    description: 'Machine/Deep Learning models for prediction wine prices from web scraped data.',
    tags: ['Machine Learning'],
    dateRange: 'Nov 2024 - Dec 2024',
    links: {
      github: 'https://github.com/riordanaa/Wine---price-ratings-prediction',
      website: null,
      paper: null,
      pdfs: null,
      youtube: null
    }
  },
  {
    id: 'work6',
    title: 'Women in Computing Conference 2025',
    description: 'Online recorded presentation for the Carolina 2025 Women in Computing Conference',
    tags: ['Poster', 'Online'],
    dateRange: 'Feb 2025',
    links: {
      github: null,
      website: 'https://www.carolinaswic.org/',
      paper: null,
      pdfs: 'WIC_Poster_Andrew_Berg_2025.pdf',
      youtube: 'https://www.youtube.com/watch?v=wjg381nPX_8'
    }
  },
  {
    id: 'work7',
    title: 'College of Charleston Research Expo 2025',
    description: 'In-Person presentation for the College of Charleston Research Expo',
    tags: ['Presentation', 'In-Person'],
    dateRange: 'Apr 2025',
    links: {
      github: null,
      website: 'https://charleston.edu/academics/research/expo.php',
      paper: null,
      pdfs: 'EXPO_Presentation_Andrew_Berg_2025.pdf',
      youtube: 'https://www.youtube.com/watch?v=76DLp8WH5ik'
    }
  },
  {
    id: 'work8',
    title: 'Summer Mentorship',
    description: 'Mentorship for high school students in the summer of 2025. Worked to teach them about the basics of programming, ML, DL, and Gen AI.',
    tags: ['Teaching'],
    dateRange: 'Jun 2025 - Aug 2025',
    links: {
      github: null,
      website: null,
      paper: null,
      pdfs: 'HS_mentorship_2025_Class_Syllabus.pdf',
      youtube: null
    }
  },
];

type SortOption = 'latest' | 'oldest' | 'a-z' | 'z-a';

const monthMap: { [key: string]: number } = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
};

const parseEndDate = (dateRange: string): Date => {
  const parts = dateRange.split(' - ');
  const endDateStr = parts.length > 1 ? parts[1] : parts[0];
  
  if (endDateStr.toLowerCase() === 'present') {
    return new Date();
  }
  
  const [monthStr, yearStr] = endDateStr.split(' ');
  const month = monthMap[monthStr];
  const year = parseInt(yearStr, 10);
  
  if (isNaN(year) || month === undefined) {
    // Fallback for single month-year like "Feb 2025"
    const singleDate = new Date(endDateStr);
    if (!isNaN(singleDate.getTime())) {
      return singleDate;
    }
    return new Date(0); // Return a default old date if parsing fails
  }

  return new Date(year, month);
};

const Work = () => {
  const [sortOrder, setSortOrder] = useState<SortOption>('latest');
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const workContainerRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(false);

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
    if (!scrollIndicatorRef.current || !workContainerRef.current) return;
    
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.5 });
    tl.to(scrollIndicatorRef.current, { y: 6, duration: 0.8, ease: "sine.inOut" })
      .to(scrollIndicatorRef.current, { y: 0, duration: 0.8, ease: "sine.inOut" });
    
    const handleScroll = () => {
      if (!workContainerRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = workContainerRef.current;
      const reachedBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 5;
      setIsAtBottom(reachedBottom);
      gsap.to(scrollIndicatorRef.current, { rotation: reachedBottom ? 180 : 0, duration: 0.3, ease: "power2.out" });
    };
    
    const workElement = workContainerRef.current;
    workElement.addEventListener('scroll', handleScroll);
    
    return () => {
      tl.kill();
      if (workElement) workElement.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleScrollClick = () => {
    if (!workContainerRef.current) return;
    const workElement = workContainerRef.current;
    if (isAtBottom) {
      gsap.to(workElement, { scrollTop: 0, duration: 0.8, ease: "power2.inOut" });
    } else {
      const pageHeight = workElement.clientHeight;
      const newScrollTop = workElement.scrollTop + pageHeight * 0.8;
      gsap.to(workElement, { scrollTop: newScrollTop, duration: 0.5, ease: "power2.out" });
    }
  };

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    workItems.forEach(item => {
      item.tags.forEach(tag => tags.add(tag));
    });
    return ['All', ...Array.from(tags).sort()];
  }, []);
  
  const sortedAndFilteredWork = useMemo(() => {
    let filtered = workItems;
    if (selectedTag !== 'All') {
      filtered = workItems.filter(item => item.tags.includes(selectedTag));
    }
    const workToSort = [...filtered];
    workToSort.sort((a, b) => {
      switch (sortOrder) {
        case 'a-z': return a.title.localeCompare(b.title);
        case 'z-a': return b.title.localeCompare(a.title);
        case 'oldest': return parseEndDate(a.dateRange).getTime() - parseEndDate(b.dateRange).getTime();
        case 'latest':
        default: return parseEndDate(b.dateRange).getTime() - parseEndDate(a.dateRange).getTime();
      }
    });
    return workToSort;
  }, [sortOrder, selectedTag]);

  return (
    <div className="space-y-4 antialiased">
      <p className="text-xs text-muted-foreground">
        A collection of my work, including personal projects, research, and experiences.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        {/* Sorting Dropdown */}
        <div className="relative">
          <select
            onChange={(e) => setSortOrder(e.target.value as SortOption)}
            value={sortOrder}
            className="appearance-none border rounded-md px-3 py-2 pr-10 text-sm cursor-pointer transition-colors w-full bg-background border-border text-foreground hover:border-border/80 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
            <option value="a-z">A-Z</option>
            <option value="z-a">Z-A</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-muted-foreground" />
        </div>
        
        {/* Tag Filters Dropdown */}
        <div ref={dropdownRef} className="relative sm:min-w-[120px]">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="appearance-none border rounded-md px-3 py-2 text-sm cursor-pointer transition-colors w-full bg-background border-border text-foreground hover:border-border/80 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 flex justify-between items-center"
          >
            <span className="truncate">{selectedTag}</span>
            <ChevronDown size={16} className={`transition-transform duration-200 ml-2 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 w-full bg-background border border-border/30 rounded-md shadow-lg z-10 overflow-hidden">
              <div className="max-h-[168px] overflow-y-auto scrollbar-thin">
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      setSelectedTag(tag);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-sm text-left hover:bg-muted/30 transition-colors ${selectedTag === tag ? 'bg-primary/10 text-primary' : 'text-foreground'}`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="relative">
        <div ref={workContainerRef} className="space-y-6 pt-4 max-h-[300px] overflow-y-auto pb-8 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/50 hover:scrollbar-thumb-white/70">
          {sortedAndFilteredWork.map((item) => (
            <div key={item.id} className="group relative">
              <h3 className="text-base font-medium font-display mb-1">{item.title}</h3>
              <p className="text-xs text-muted-foreground mb-2">{item.dateRange}</p>
              <p className="mt-1 text-xs text-foreground/90">{item.description}</p>
              
              <div className="mt-3 flex items-center gap-3">
                {item.links.github && <a href={item.links.github} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors"><Github size={16} /></a>}
                {item.links.website && <a href={item.links.website} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors"><Globe size={16} /></a>}
                {item.links.paper && <a href={item.links.paper} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors"><FileText size={16} /></a>}
                {item.links.pdfs && <a href={`/src/pdfs/${item.links.pdfs}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors"><File size={16} /></a>}
                {item.links.youtube && <a href={item.links.youtube} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors"><Youtube size={16} /></a>}
              </div>
              
              <div className="mt-3 flex flex-wrap gap-1">
                {item.tags.map((tag) => (
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

export default Work;
