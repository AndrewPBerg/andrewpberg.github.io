import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import gsap from 'gsap';
import { useTheme } from '../hooks/useTheme';
import { useIsMobile } from '../hooks/use-mobile';
import { TopologyEffect } from './TopologyEffect';

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
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  
  const memoizedActiveSection = useMemo(() => activeSection, [activeSection]);
  
  const handleSectionChange = useCallback((id: string) => {
    if (isAnimating || id === activeSection) return;
    
    setIsAnimating(true);
    
    // Hide previous section content immediately on mobile
    if (isMobile && previousSection) {
      const prevContentRef = contentRefs.current[previousSection];
      if (prevContentRef) {
        prevContentRef.style.display = 'none';
      }
    }
    
    // Use minimal GSAP animation for content transition
    navigate(`/${id}`);
    
    // Reset animation state after a minimal delay
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  }, [activeSection, isAnimating, navigate, previousSection, isMobile]);
  
  useEffect(() => {
    const path = location.pathname.slice(1) || 'info';
    if (path !== activeSection) {
      setPreviousSection(activeSection);
      setActiveSection(path);
    }
  }, [location, activeSection]);
  
  useEffect(() => {
    const activeButtonRef = buttonRefs.current[activeSection];
    
    if (activeButtonRef) {
      const glowColor = 'rgba(200, 200, 200, 0.5)';
      
      activeButtonRef.style.boxShadow = `0 0 6px 1px ${glowColor}`;
      
      return () => {
        if (activeButtonRef) {
          activeButtonRef.style.boxShadow = 'none';
        }
      };
    }
  }, [activeSection]);
  
  // Simplified content transition using CSS instead of GSAP
  useEffect(() => {
    const activeContentRef = contentRefs.current[activeSection];
    if (!activeContentRef) return;
    
    // Hide all other sections first (important for mobile)
    Object.entries(contentRefs.current).forEach(([id, ref]) => {
      if (id !== activeSection && ref) {
        ref.style.display = 'none';
        ref.style.opacity = '0';
      }
    });
    
    if (!previousSection) {
      activeContentRef.style.opacity = '1';
      activeContentRef.style.transform = 'translateY(0px)';
      activeContentRef.style.display = 'block';
      return;
    }
    
    setIsAnimating(true);
    
    // Use CSS transitions instead of GSAP for better performance
    activeContentRef.style.opacity = '0';
    activeContentRef.style.transform = isMobile ? 'translateY(0px)' : 'translateY(3px)';
    activeContentRef.style.display = 'block';
    
    // Force reflow to ensure transition works
    void activeContentRef.offsetWidth;
    
    // Apply transition
    activeContentRef.style.opacity = '1';
    activeContentRef.style.transform = 'translateY(0px)';
    
    // Clear animation state after transition
    const transitionEndHandler = () => {
      setIsAnimating(false);
    };
    
    activeContentRef.addEventListener('transitionend', transitionEndHandler);
    
    // Fallback in case transition event doesn't fire
    const timeoutId = setTimeout(transitionEndHandler, 300);
    
    return () => {
      activeContentRef.removeEventListener('transitionend', transitionEndHandler);
      clearTimeout(timeoutId);
    };
  }, [activeSection, previousSection, isMobile]);
  
  // Memoize the topology effect to prevent rerenders
  const topologyEffect = useMemo(() => (
    <TopologyEffect activeSection={memoizedActiveSection} />
  ), [memoizedActiveSection]);
  
  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8">
      {topologyEffect}
      
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
                    className={`relative flex items-center justify-center h-3 w-3 rounded-full transition-colors duration-200 ${
                      section.id === activeSection 
                        ? 'bg-primary' 
                        : 'bg-muted-foreground/40 group-hover:bg-muted-foreground/70'
                    }`} 
                    style={{ transform: 'translateZ(0)' }}
                  />
                  <span className={`text-xs tracking-wide transition-colors duration-200 ${
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
                    className="content-container glass-panel mt-6 w-80 pr-6 will-change-transform transition-all duration-300"
                    style={{ opacity: 0, transform: 'translateZ(0)', display: 'block' }}
                  >
                    <div className="p-4">
                      <Outlet />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {isMobile && (
        <>
          <div className="fixed bottom-6 left-0 right-0 z-50">
            <div className="flex flex-row justify-center mx-auto">
              <div className="menu-glass py-2 px-3 rounded-full shadow-md flex items-center gap-4 border border-border/30"
                   style={{ transform: 'translateZ(0)' }}>
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => handleSectionChange(section.id)}
                    className={`group flex flex-col items-center gap-1.5 py-1 px-1 focus:outline-none ${
                      isAnimating ? 'pointer-events-none opacity-70' : ''
                    }`}
                    disabled={isAnimating}
                  >
                    <div 
                      ref={el => buttonRefs.current[section.id] = el}
                      className={`relative h-2.5 w-2.5 rounded-full transition-colors duration-200 ${
                        section.id === activeSection 
                          ? 'bg-primary' 
                          : 'bg-muted-foreground/40 group-hover:bg-muted-foreground/70'
                      }`}
                    />
                    <span className={`text-xs tracking-wide transition-colors duration-200 ${
                      section.id === activeSection 
                        ? 'text-primary font-medium' 
                        : 'text-muted-foreground group-hover:text-muted-foreground/80'
                    }`}>
                      {section.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="p-4 sm:p-6 md:p-8 w-full pb-24">
            {sections.map((section) => (
              <div 
                key={section.id}
                ref={el => contentRefs.current[section.id] = el}
                className={`content-container glass-panel p-4 w-full mb-4 will-change-transform transition-all duration-300`}
                style={{ 
                  opacity: 0, 
                  transform: 'translateZ(0)', 
                  display: section.id === activeSection ? 'block' : 'none'
                }}
              >
                {<Outlet />}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Layout;
