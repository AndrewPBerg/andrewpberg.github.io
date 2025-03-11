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
    if (!vantaRef.current || !p5Loaded) return;
    
    // Set initialMount to false after first initialization
    initialMountRef.current = false;

    // Get colors based on theme and active section
    const themeColors = colorSchemes[theme as 'dark' | 'light'];
    const sectionColors = themeColors[activeSection as keyof typeof themeColors] || themeColors.info;
    
    const backgroundColor = sectionColors.background;
    const foregroundColor = sectionColors.foreground;

    // If effect already exists but theme changed, destroy it first
    if (vantaEffectRef.current) {
      vantaEffectRef.current.destroy();
      vantaEffectRef.current = null;
    }

    // Initialize the effect with smoother settings and without pulse/wave effects
    try {
      vantaEffectRef.current = TOPOLOGY({
        el: vantaRef.current,
        p5: p5,
        mouseControls: true,  // Keep mouse interaction which isn't too heavy
        touchControls: true,  
        gyroControls: false,
        minHeight: 100.00,
        minWidth: 100.00,
        scale: 1.0,
        scaleMobile: 0.8,
        color: foregroundColor,
        backgroundColor: backgroundColor,
        speed: 1.0,           // Moderate speed for smooth movement
        particleCount: 4000,  // Number of particles from topology.js
        particleSize: 1.4,
        flowCellSize: 10,     // Match the flow_cell_size in topology.js
        noiseSize: 0.003,     // Match the noise_size in topology.js
        noiseRadius: 0.1,     // Match the noise_radius in topology.js
        colorMode: 'variance', // Custom parameter for color
        colorVariance: 0.25,  // Custom parameter for color variance
        pulseIntensity: 0,    // Remove pulse effect completely
        pulseSpeed: 0,        // Remove pulse speed
        offset: 100,          // Match the offset in topology.js
      });

      setIsInitialized(true);
      prevThemeRef.current = theme;
      prevSectionRef.current = activeSection;
    } catch (error) {
      console.error("Failed to initialize topology effect:", error);
    }
  }, [p5Loaded, theme, activeSection]);

  // Replace the complex update effect with a simpler one that just triggers reinitialization
  useEffect(() => {
    if (!isInitialized || !vantaEffectRef.current) return;
    
    // Only update if theme or section has changed
    if (theme !== prevThemeRef.current || activeSection !== prevSectionRef.current) {
      // Get colors based on theme and active section
      const themeColors = colorSchemes[theme as 'dark' | 'light'];
      const sectionColors = themeColors[activeSection as keyof typeof themeColors] || themeColors.info;
      
      // Destroy and recreate the effect to properly apply the new background color
      if (vantaEffectRef.current) {
        vantaEffectRef.current.destroy();
        vantaEffectRef.current = null;
        setIsInitialized(false); // This will trigger the initialization effect
      }
    }
  }, [theme, activeSection, isInitialized]);

  return (
    <div 
      ref={vantaRef} 
      className="fixed top-0 left-0 w-full h-full -z-10 opacity-60 will-change-transform" // Increased opacity
      aria-hidden="true"
      style={{ 
        transform: 'translate3d(0,0,0)',
        backfaceVisibility: 'hidden',
        mixBlendMode: 'normal', // Normal blend for clarity
        filter: 'contrast(1.05) brightness(1.02)' // Reduced filter intensity
      }}
    />
  );
});

// Add display name for debugging
TopologyEffect.displayName = 'TopologyEffect';

export { TopologyEffect };
export default TopologyEffect;
