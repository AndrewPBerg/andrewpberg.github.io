import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import gsap from 'gsap';
import { useTheme } from '../hooks/useTheme';
import { useIsMobile } from '../hooks/use-mobile';
import GlobeEffect from './GlobeEffect';

const sections = [
  { id: 'info', title: 'Info' },
  { id: 'contact', title: 'Contact' },
  { id: 'stack', title: 'Stack' },
  { id: 'projects', title: 'Projects' },
];

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState<string>('info');
  const [previousSection, setPreviousSection] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const contentRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const buttonRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const { theme, setTheme } = useTheme();
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const path = location.pathname.slice(1) || 'info';
    if (path !== activeSection) {
      setPreviousSection(activeSection);
      setActiveSection(path);
    }
  }, [location, activeSection]);
  
  useEffect(() => {
    sections.forEach(section => {
      const buttonRef = buttonRefs.current[section.id];
      if (buttonRef) {
        gsap.killTweensOf(buttonRef);
        gsap.set(buttonRef, { boxShadow: 'none' });
      }
    });
    
    const activeButtonRef = buttonRefs.current[activeSection];
    if (activeButtonRef) {
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.1 });
      
      const glowColor = theme === 'dark'
        ? 'rgba(200, 200, 200, 0.5)'
        : 'rgba(80, 80, 80, 0.3)';
      
      tl.to(activeButtonRef, {
        boxShadow: `0 0 8px 2px ${glowColor}`,
        duration: 0.3, // Speed up animation
        ease: "sine.inOut"
      })
      .to(activeButtonRef, {
        boxShadow: '0 0 0px 0px rgba(128, 128, 128, 0)',
        duration: 0.3, // Speed up animation
        ease: "sine.inOut"
      });
    }
    
    return () => {
      sections.forEach(section => {
        const buttonRef = buttonRefs.current[section.id];
        if (buttonRef) gsap.killTweensOf(buttonRef);
      });
    };
  }, [activeSection, theme]);
  
  useEffect(() => {
    const activeContentRef = contentRefs.current[activeSection];
    if (!activeContentRef) return;
    
    if (tlRef.current) {
      tlRef.current.kill();
    }
    
    if (!previousSection) {
      gsap.set(activeContentRef, { opacity: 1, y: 0, x: 0 });
      return;
    }
    
    setIsAnimating(true);
    
    const tl = gsap.timeline({
      defaults: {
        ease: "power3.out",
        duration: 0.5
      },
      onComplete: () => {
        setIsAnimating(false);
      }
    });
    
    tlRef.current = tl;
    
    // Different animation for mobile vs desktop
    if (isMobile) {
      gsap.set(activeContentRef, { 
        opacity: 0, 
        y: 10,
        display: 'block'
      });
      
      tl.to(activeContentRef, { 
        opacity: 1, 
        y: 0,
        clearProps: "transform"
      });
    } else {
      gsap.set(activeContentRef, { 
        opacity: 0, 
        y: -8, 
        x: 8,
        display: 'block'
      });
      
      tl.to(activeContentRef, { 
        opacity: 1, 
        y: 0, 
        x: 0, 
        clearProps: "transform"
      });
    }
    
    if (activeContentRef.children.length > 0 && activeContentRef.children[0].children.length > 0) {
      tl.fromTo(
        activeContentRef.children[0].children,
        { 
          opacity: 0, 
          y: isMobile ? 8 : 6,
          scale: 0.99
        },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          stagger: isMobile ? 0.02 : 0.03, // Slightly faster stagger on mobile
          duration: isMobile ? 0.3 : 0.4,
          clearProps: "transform,opacity"
        },
        "-=0.35"
      );
    }
    
    return () => {
      if (tlRef.current) {
        tlRef.current.kill();
      }
    };
  }, [activeSection, previousSection, isMobile]);
  
  const handleSectionChange = (id: string) => {
    if (isAnimating || id === activeSection) return;
    
    setIsAnimating(true);
    
    const currentContentRef = contentRefs.current[activeSection];
    
    if (currentContentRef) {
      if (tlRef.current) {
        tlRef.current.kill();
      }
      
      const exitTl = gsap.timeline({
        defaults: {
          ease: "power2.in",
          duration: isMobile ? 0.2 : 0.3 // Faster on mobile
        },
        onComplete: () => {
          navigate(`/${id}`);
        }
      });
      
      tlRef.current = exitTl;
      
      if (isMobile) {
        exitTl.to(currentContentRef, {
          opacity: 0,
          y: -10,
          scale: 0.98
        });
      } else {
        exitTl.to(currentContentRef, {
          opacity: 0,
          y: -4,
          x: -4,
          scale: 0.99
        });
      }
    } else {
      navigate(`/${id}`);
      setIsAnimating(false);
    }
  };
  
  const toggleTheme = () => {
    document.body.classList.add('theme-transition');
    setTimeout(() => {
      document.body.classList.remove('theme-transition');
    }, 300);
    
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };
  
  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8">
      {/* Globe Effect */}
      <GlobeEffect activeSection={activeSection} />
      
      {/* Theme Toggle - positioned differently based on device */}
      <div className={`fixed ${isMobile ? 'top-6 left-6' : 'top-6 right-6'} z-50`}>
        <div className="flex items-center">
          <span className={`${isMobile ? 'text-sm' : 'text-xs'} mr-2 font-sans tracking-wide`}>
            {theme === 'dark' ? 'DARK' : 'LIGHT'}
          </span>
          <button
            onClick={toggleTheme}
            className={`theme-toggle ${isMobile ? 'w-10 h-3' : 'w-10 h-6'} transition-colors duration-300 ${
              theme === 'dark' 
                ? 'bg-primary border-primary' 
                : 'bg-secondary border-secondary'
            } border rounded-sm`}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            <div 
              className={`${isMobile ? 'w-3 h-3' : 'w-3 h-3'} transition-all duration-300 ${
                theme === 'dark' 
                  ? `bg-background ${isMobile ? 'ml-4' : 'ml-5'}` 
                  : `bg-foreground ${isMobile ? '-ml-3.5' : 'ml-2'}`
              }`}
            />
          </button>
        </div>
      </div>
      
      {/* Desktop Navigation and Content */}
      {!isMobile && (
        <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4 items-end">
          <div className="flex flex-col gap-6 items-end">
            {sections.map((section) => (
              <div key={section.id} className="relative">
                <button
                  onClick={() => handleSectionChange(section.id)}
                  className={`group flex items-center gap-2 focus:outline-none ${
                    isAnimating ? 'pointer-events-none opacity-70' : ''
                  }`}
                  disabled={isAnimating}
                >
                  <div 
                    ref={el => buttonRefs.current[section.id] = el}
                    className={`relative flex items-center justify-center h-3 w-3 rounded-full transition-all duration-300 ${
                      section.id === activeSection 
                        ? 'bg-primary' 
                        : 'bg-muted-foreground/40 group-hover:bg-muted-foreground/70'
                    }`} 
                  />
                  <span className={`text-xs tracking-wide transition-colors duration-300 ${
                    section.id === activeSection 
                      ? 'text-primary font-medium' 
                      : 'text-muted-foreground group-hover:text-muted-foreground/80'
                  }`}>
                    {section.title}
                  </span>
                </button>
                
                {section.id === activeSection && (
                  <div 
                    ref={el => contentRefs.current[section.id] = el}
                    className="content-container mt-6 w-80 pr-6"
                    style={{ opacity: 0 }}
                  >
                    <div>
                      <Outlet />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Mobile Navigation and Content */}
      {isMobile && (
        <>
          {/* Mobile Navigation Menu - Fixed at bottom */}
          <div className="fixed bottom-6 left-0 right-0 z-50">
            <div className="flex flex-row justify-center mx-auto">
              <div className="bg-background/90 backdrop-blur-md py-3 px-6 rounded-full shadow-md flex items-center gap-8 border border-border/30">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => handleSectionChange(section.id)}
                    className={`group flex flex-col items-center gap-1.5 focus:outline-none ${
                      isAnimating ? 'pointer-events-none opacity-70' : ''
                    }`}
                    disabled={isAnimating}
                  >
                    <div 
                      ref={el => buttonRefs.current[section.id] = el}
                      className={`relative flex items-center justify-center h-3.5 w-3.5 rounded-full transition-all duration-300 ${
                        section.id === activeSection 
                          ? 'bg-primary' 
                          : 'bg-muted-foreground/40 group-hover:bg-muted-foreground/70'
                      }`} 
                    />
                    <span className={`text-xs font-medium tracking-wide transition-colors duration-300 ${
                      section.id === activeSection 
                        ? 'text-primary' 
                        : 'text-muted-foreground/70 group-hover:text-muted-foreground'
                    }`}>
                      {section.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Mobile Content - Centered in view */}
          {sections.map((section) => (
            section.id === activeSection && (
              <div 
                key={section.id}
                ref={el => contentRefs.current[section.id] = el}
                className="content-container fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[90vw] px-4"
                style={{ opacity: 0 }}
              >
                <div className="flex flex-col items-center">
                  <Outlet />
                </div>
              </div>
            )
          ))}
        </>
      )}
    </div>
  );
};

export default Layout;
