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
      title: "The Expanse Series",
      author: "James S.A. Corey",
      description: "Explores politics of a future star-spanning humanity",
      categories: ["Sci-Fi", "Series", "Fiction"]
    },
    {
      title: "The Giver Series",
      author: "Lois Lowry",
      description: "Isolated Dystopian society that lacks chaos ",
      categories: ["Fiction", "Series", "Dystopian"]
    },
    {
      title: "Endurance: Shackleton's Incredible Voyage",
      author: "Alfred Lansing",
      description: "A true story of leadership in Antartica",
      categories: ["Non-Fiction", "Adventure", "History","Biography"]
    },
    {
      title: "Genghis Khan and the Making of the Modern World",
      author: "Jack Weatherford",
      description: "The bloody history of the Mongols",
      categories: ["Non-Fiction", "History"]
    },
    {
      title: "Genghis Khan and the Making of the Modern World",
      author: "Jack Weatherford",
      description: "The bloody history of the Mongols",
      categories: ["Non-Fiction", "History"]
    },
    {
      title: "1984",
      author: "George Orwell",
      description: "A dystopian soceity of self-censorship",
      categories: ["Fiction", "Dystopian", "Classics"]
    },
    {
      title: "Brave New World",
      author: "Aldous Huxley",
      description: "Dystopian exploration of a painless controlled society",
      categories: ["Fiction", "Dystopian", "Classics"]
    },
    {
      title: "The Devil in the White City",
      author: "Eric Larson",
      description: "The intersection of serial killings, engineering, and the 1893 world's fair",
      categories: ["Non-Fiction", "History", "True Crime"]
    },
    {
      title: "Man's Search for Meaning",
      author: "Viktor E. Frankl",
      description: "Frankl's lessons learned in Nazi camps",
      categories: ["Non-Fiction", "History", "Philosophy","Self-Development","Psychology","Autobiography"]
    },
    {
        title: "Atomic Habits",
        author: "James Clear",
        description: "1% Better",
        categories: ["Non-Fiction", "Self-Development", "Psychology"]
    }

  ];

  // Get unique categories for filtering
  const categories = ['All', ...Array.from(new Set(bookRecommendations.flatMap(book => book.categories)))];
  
  // Filter books based on selected category
  const filteredBooks = selectedCategory === 'All' 
    ? bookRecommendations 
    : bookRecommendations.filter(book => book.categories.includes(selectedCategory));

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
            <div className="max-h-[168px] overflow-y-auto scrollbar-thin">
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
                <div className="flex items-center gap-1 mt-1 flex-wrap">
                  {book.categories.map((category, catIndex) => (
                    <span key={catIndex} className="text-[9px] text-muted-foreground/70 px-1.5 py-0.5 bg-muted/30 rounded-full">
                      {category}
                    </span>
                  ))}
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