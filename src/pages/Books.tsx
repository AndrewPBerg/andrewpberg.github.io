import { useRef, useEffect, useState } from 'react';
import { BookOpen, ChevronDown } from 'lucide-react';
import gsap from 'gsap';

const Books = () => {
  const booksRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const bookRecommendations = [
    {
      title: "The Pragmatic Programmer",
      author: "David Thomas & Andrew Hunt",
      description: "Essential reading for any developer. Timeless principles that have shaped how I approach software development.",
      category: "Programming",
    },
    {
      title: "Clean Code",
      author: "Robert C. Martin",
      description: "A handbook of agile software craftsmanship. Changed how I think about writing maintainable code.",
      category: "Programming",
    },
    {
      title: "Designing Data-Intensive Applications",
      author: "Martin Kleppmann",
      description: "Deep dive into the architecture of modern data systems. Essential for understanding distributed systems.",
      category: "Systems",
    },
    {
      title: "The Design of Everyday Things",
      author: "Don Norman",
      description: "Fundamental principles of design that apply to both physical and digital products.",
      category: "Design",
    },
    {
      title: "Atomic Habits",
      author: "James Clear",
      description: "Practical strategies for building good habits and breaking bad ones. Life-changing insights.",
      category: "Personal Development",
    },
    {
      title: "The Lean Startup",
      author: "Eric Ries",
      description: "Revolutionary approach to building and launching successful products through validated learning.",
      category: "Business",
    },
  ];

  // Get unique categories for filtering
  const categories = ['All', ...Array.from(new Set(bookRecommendations.map(book => book.category)))];
  
  // Filter books based on selected category
  const filteredBooks = selectedCategory === 'All' 
    ? bookRecommendations 
    : bookRecommendations.filter(book => book.category === selectedCategory);

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
    if (!scrollIndicatorRef.current || !booksRef.current) return;
    
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
      if (!booksRef.current) return;
      
      const { scrollTop, scrollHeight, clientHeight } = booksRef.current;
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
    
    const booksElement = booksRef.current;
    booksElement.addEventListener('scroll', handleScroll);
    
    return () => {
      tl.kill();
      if (booksElement) {
        booksElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);
  
  const handleScrollClick = () => {
    if (!booksRef.current) return;
    
    const booksElement = booksRef.current;
    
    if (isAtBottom) {
      gsap.to(booksElement, {
        scrollTop: 0,
        duration: 0.8,
        ease: "power2.inOut"
      });
    } else {
      const pageHeight = booksElement.clientHeight;
      const newScrollTop = booksElement.scrollTop + pageHeight * 0.8;
      
      gsap.to(booksElement, {
        scrollTop: newScrollTop,
        duration: 0.5,
        ease: "power2.out"
      });
    }
  };


  
  return (
    <div className="space-y-4 antialiased will-change-transform">
      <p className="text-xs text-muted-foreground mb-4">
        Non-fiction & fiction that influence my thinking.
      </p>
      
      {/* Category Filter Dropdown */}
      <div ref={dropdownRef} className="relative mb-4">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2 px-2 py-1.5 text-xs bg-muted/30 hover:bg-muted/50 border border-border/30 rounded-md transition-colors w-full max-w-36"
        >
          <span className="flex-1 text-left">{selectedCategory}</span>
          <ChevronDown 
            size={10} 
            className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
          />
        </button>
        
        {isDropdownOpen && (
          <div className="absolute top-full left-0 mt-1 w-full max-w-36 bg-background border border-border/30 rounded-md shadow-lg z-10 overflow-hidden">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setIsDropdownOpen(false);
                }}
                                 className={`w-full px-2 py-1.5 text-xs text-left hover:bg-muted/30 transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary/10 text-primary'
                    : 'text-foreground'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}
      </div>
      
      <div className="relative">
        <div ref={booksRef} className="space-y-8 max-h-[400px] invisible-scroll pb-8">
          {filteredBooks.map((book, index) => (
            <div key={index} className="group relative">
              <div className="space-y-1 mb-2">
                <h3 className="text-base font-medium font-display will-change-transform">
                  {book.title}
                </h3>
                <p className="text-xs text-muted-foreground">
                  by {book.author}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[9px] text-muted-foreground/70 px-1.5 py-0.5 bg-muted/30 rounded-full">
                    {book.category}
                  </span>
                </div>
              </div>
              <p className="text-xs text-foreground/90 leading-relaxed">
                {book.description}
              </p>
            </div>
          ))}
          
          <div className="pt-2 border-t border-border/30 mt-6">
            <p className="text-[9px] text-muted-foreground/60 flex items-center gap-1">
              <BookOpen size={10} />
              Updated regularly with new discoveries and timeless classics
            </p>
          </div>
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

export default Books; 