import { useEffect, useRef, useState, memo } from 'react';
import { useTheme } from '../hooks/useTheme';
import TOPOLOGY from './vanta/topology.js';
import colorSchemes from '../config/colorSchemes';

// Import p5.js dynamically to avoid SSR issues
let p5: any = null;

interface TopologyEffectProps {
  activeSection: string;
}

// Use memo to prevent unnecessary re-renders
const TopologyEffect = memo(({ activeSection = 'info' }: TopologyEffectProps) => {
  const { theme } = useTheme();
  const vantaRef = useRef<HTMLDivElement>(null);
  const vantaEffectRef = useRef<any>(null);
  const [p5Loaded, setP5Loaded] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const prevThemeRef = useRef(theme);
  const prevSectionRef = useRef(activeSection);
  
  // Store the initial mount state to avoid remounting
  const initialMountRef = useRef(true);

  // Load p5.js dynamically
  useEffect(() => {
    if (typeof window !== 'undefined' && !p5) {
      import('p5').then((p5Module) => {
        p5 = p5Module.default;
        setP5Loaded(true);
      });
    }
    
    // Cleanup function for component unmount only
    return () => {
      if (!initialMountRef.current && vantaEffectRef.current) {
        vantaEffectRef.current.destroy();
        vantaEffectRef.current = null;
      }
    };
  }, []);

  // Initialize the effect only once
  useEffect(() => {
    if (!vantaRef.current || !p5Loaded || isInitialized) return;
    
    // Set initialMount to false after first initialization
    initialMountRef.current = false;

    // Get colors based on theme and active section
    const themeColors = colorSchemes[theme as 'dark' | 'light'];
    const sectionColors = themeColors[activeSection as keyof typeof themeColors] || themeColors.info;
    
    const backgroundColor = sectionColors.background;
    const foregroundColor = sectionColors.foreground;

    // Initialize the effect with balanced settings for performance and visuals
    try {
      vantaEffectRef.current = TOPOLOGY({
        el: vantaRef.current,
        p5: p5,
        mouseControls: false,
        touchControls: false,
        gyroControls: false,
        minHeight: 100.00,
        minWidth: 100.00,
        scale: 1.5,
        scaleMobile: 0.8,
        color: foregroundColor,
        backgroundColor: backgroundColor,
        speed: 2,               // Balanced speed
        particleCount: 4500,      // Match the updated particle count
        particleSize: 1.3,        // Match the updated particle size
        flowCellSize: 10,          // Match the updated flow cell size
        noiseSize: 0.005,         // Match the updated noise size
        noiseRadius: 0.1,        // Match the updated noise radius
        offset: 50,              // Keep the offset value
      });

      setIsInitialized(true);
      prevThemeRef.current = theme;
      prevSectionRef.current = activeSection;
    } catch (error) {
      console.error("Failed to initialize topology effect:", error);
    }
  }, [p5Loaded, isInitialized, theme, activeSection]);

  // Update colors when theme or section changes, but don't reinitialize the effect
  useEffect(() => {
    if (!isInitialized || !vantaEffectRef.current) return;
    
    // Only update if theme or section has changed
    if (theme !== prevThemeRef.current || activeSection !== prevSectionRef.current) {
      try {
        // Get colors based on theme and active section
        const themeColors = colorSchemes[theme as 'dark' | 'light'];
        const sectionColors = themeColors[activeSection as keyof typeof themeColors] || themeColors.info;
        
        const backgroundColor = sectionColors.background;
        const foregroundColor = sectionColors.foreground;

        // Update colors without reinitializing the effect
        if (vantaEffectRef.current.options) {
          vantaEffectRef.current.options.backgroundColor = backgroundColor;
          vantaEffectRef.current.options.color = foregroundColor;
          
          // Force a redraw if the effect has a setOptions method
          if (typeof vantaEffectRef.current.setOptions === 'function') {
            vantaEffectRef.current.setOptions({
              backgroundColor,
              color: foregroundColor
            });
          }
        }

        prevThemeRef.current = theme;
        prevSectionRef.current = activeSection;
      } catch (error) {
        console.error("Failed to update topology effect colors:", error);
      }
    }
  }, [theme, activeSection, isInitialized]);

  return (
    <div 
      ref={vantaRef} 
      className="fixed top-0 left-0 w-full h-full -z-10 opacity-30 will-change-transform"
      aria-hidden="true"
      style={{ 
        transform: 'translate3d(0,0,0)', // Force hardware acceleration
        backfaceVisibility: 'hidden' 
      }}
    />
  );
});

// Add display name for debugging
TopologyEffect.displayName = 'TopologyEffect';

export { TopologyEffect };
export default TopologyEffect;
