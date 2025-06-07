import { useRef, useEffect, useState } from 'react';
import { BookOpen, ExternalLink, ChevronDown } from 'lucide-react';
import gsap from 'gsap';

const Books = () => {
  const booksRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  const bookRecommendations = [
    {
      title: "The Pragmatic Programmer",
      author: "David Thomas & Andrew Hunt",
      description: "Essential reading for any developer. Timeless principles that have shaped how I approach software development.",
      category: "Programming",
      link: "https://pragprog.com/titles/tpp20/the-pragmatic-programmer-20th-anniversary-edition/",
    },
    {
      title: "Clean Code",
      author: "Robert C. Martin",
      description: "A handbook of agile software craftsmanship. Changed how I think about writing maintainable code.",
      category: "Programming",
      link: "https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882",
    },
    {
      title: "Designing Data-Intensive Applications",
      author: "Martin Kleppmann",
      description: "Deep dive into the architecture of modern data systems. Essential for understanding distributed systems.",
      category: "Systems",
      link: "https://dataintensive.net/",
    },
    {
      title: "The Design of Everyday Things",
      author: "Don Norman",
      description: "Fundamental principles of design that apply to both physical and digital products.",
      category: "Design",
      link: "https://www.amazon.com/Design-Everyday-Things-Revised-Expanded/dp/0465050654",
    },
    {
      title: "Atomic Habits",
      author: "James Clear",
      description: "Practical strategies for building good habits and breaking bad ones. Life-changing insights.",
      category: "Personal Development",
      link: "https://jamesclear.com/atomic-habits",
    },
    {
      title: "The Lean Startup",
      author: "Eric Ries",
      description: "Revolutionary approach to building and launching successful products through validated learning.",
      category: "Business",
      link: "https://theleanstartup.com/",
    },
  ];

  // Get unique categories for filtering
  const categories = ['All', ...Array.from(new Set(bookRecommendations.map(book => book.category)))];
  
  // Filter books based on selected category
  const filteredBooks = selectedCategory === 'All' 
    ? bookRecommendations 
    : bookRecommendations.filter(book => book.category === selectedCategory);

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
        Books that have influenced my thinking and approach to technology, design, and life.
      </p>
      
      {/* Category Filter */}
      <div className="flex flex-wrap gap-1 mb-4">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-2 py-1 text-[10px] rounded-full transition-colors ${
              selectedCategory === category
                ? 'bg-primary/20 text-primary border border-primary/30'
                : 'bg-muted/30 text-muted-foreground hover:bg-muted/50'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
      
      <div className="relative">
        <div ref={booksRef} className="space-y-8 max-h-[400px] invisible-scroll pb-8">
          {filteredBooks.map((book, index) => (
            <div key={index} className="group relative">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="space-y-1 flex-1">
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
                <a 
                  href={book.link}
                  className="text-primary hover:text-primary/80 transition-colors flex-shrink-0"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="View book"
                >
                  <ExternalLink size={16} />
                </a>
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