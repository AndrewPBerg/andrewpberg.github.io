import { useEffect, useRef, useState, memo } from 'react';
import { useTheme } from '../hooks/useTheme';
import TOPOLOGY from './vanta/topology.js';
import colorSchemes from '../config/colorSchemes';
import * as THREE from 'three';
import { useIsMobile } from '../hooks/use-mobile';

// Lazy load p5.js to improve initial load time
let p5: any = null;

interface TopologyEffectProps {
  activeSection: string;
}

// Use memo to prevent unnecessary re-renders
const TopologyEffect = memo(({ activeSection = 'info' }: TopologyEffectProps) => {
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  const vantaRef = useRef<HTMLDivElement>(null);
  const vantaEffectRef = useRef<any>(null);
  const [p5Loaded, setP5Loaded] = useState(false);
  const prevThemeRef = useRef(theme);
  const prevSectionRef = useRef(activeSection);
  
  // Load p5.js dynamically with optimized loading only when needed
  useEffect(() => {
    let isMounted = true;
    
    if (typeof window !== 'undefined' && !p5) {
      // Add THREE to window for VANTA
      (window as any).THREE = THREE;
      
      // Optimized async loading with error handling
      const loadP5 = async () => {
        try {
          const p5Module = await import(/* webpackChunkName: "p5" */ 'p5');
          if (isMounted) {
            p5 = p5Module.default;
            setP5Loaded(true);
          }
        } catch (error) {
          console.error("Failed to load p5.js:", error);
        }
      };
      
      loadP5();
    } else if (typeof window !== 'undefined') {
      // Just ensure THREE is on window
      (window as any).THREE = THREE;
      // If p5 is already loaded, set the state
      if (p5) {
        setP5Loaded(true);
      }
    }
    
    // Cleanup function
    return () => {
      isMounted = false;
      if (vantaEffectRef.current) {
        try {
          vantaEffectRef.current.destroy();
        } catch (error) {
          console.warn("Error destroying effect on unmount:", error);
        }
        vantaEffectRef.current = null;
      }
    };
  }, []);

  // Only destroy and recreate effect when theme changes
  useEffect(() => {
    if (theme !== prevThemeRef.current && vantaEffectRef.current) {
      vantaEffectRef.current.destroy();
      vantaEffectRef.current = null;
    }
    
    prevThemeRef.current = theme;
  }, [theme]);

  // Initialize or update the effect with greatly optimized settings
  useEffect(() => {
    if (!vantaRef.current || !p5Loaded) return;
    
    // Get colors based on theme and active section
    const themeColors = colorSchemes[theme as 'dark' | 'light'];
    const sectionColors = themeColors[activeSection as keyof typeof themeColors] || themeColors.info;
    
    const backgroundColor = sectionColors.background;
    const foregroundColor = sectionColors.foreground;

    // Significantly reduced particle count for better performance
    const particleCount = isMobile ? 1500 : 2500;
    const particleSize = isMobile ? 0.5 : 1.0;
    const noiseSize = isMobile ? 0.001 : 0.004;
    const scale = isMobile ? 0.5 : 1.0;

    // Check if effect exists and is still valid
    const effectExists = vantaEffectRef.current && 
                        vantaEffectRef.current.el && 
                        vantaEffectRef.current.el.parentNode;

    // Only create new effect if it doesn't exist or is invalid
    if (!effectExists) {
      // Clean up any existing effect first
      if (vantaEffectRef.current) {
        try {
          vantaEffectRef.current.destroy();
        } catch (error) {
          console.warn("Error destroying existing effect:", error);
        }
        vantaEffectRef.current = null;
      }

      try {
        vantaEffectRef.current = TOPOLOGY({
          el: vantaRef.current,
          p5: p5,
          mouseControls: false, 
          touchControls: false,  
          gyroControls: false,
          minHeight: 0.00,
          minWidth: 0.00,
          scale: scale,
          scaleMobile: 0.8,
          color: foregroundColor,
          backgroundColor: backgroundColor,
          speed: 2.0, // Reduced speed for better performance
          particleCount: particleCount,
          particleSize: particleSize,
          flowCellSize: isMobile ? 14 : 12, // Increased cell size for fewer calculations
          noiseSize: noiseSize,
          noiseRadius: 0.15,
          colorMode: 'variance',
          colorVariance: 0.35,
          pulseIntensity: 0.05,
          pulseSpeed: 0.4, // Slightly reduced for performance
          offset: 1.2,
        });
      } catch (error) {
        console.error("Failed to initialize topology effect:", error);
      }
    } 
    // If effect exists and section changed, just update colors
    else if (activeSection !== prevSectionRef.current) {
      try {
        // Update only the color properties, not recreating the entire effect
        vantaEffectRef.current.setOptions({
          color: foregroundColor,
          backgroundColor: backgroundColor
        });
      } catch (error) {
        console.error("Failed to update topology effect:", error);
      }
    }

    // Update refs with current values
    prevSectionRef.current = activeSection;
    
  }, [p5Loaded, theme, activeSection, isMobile]);

  return (
    <div 
      ref={vantaRef} 
      className="fixed top-0 left-0 w-full h-full -z-10 opacity-70 will-change-transform topology-effect-container" 
      aria-hidden="true"
      style={{ 
        transform: 'translate3d(0,0,0)',
        backfaceVisibility: 'hidden',
        mixBlendMode: 'normal',
        filter: isMobile ? 'contrast(1.2) brightness(1.3)' : 'contrast(1.4) brightness(1.5)',
        padding: '56px',
      }}
    />
  );
});

// Add display name for debugging
TopologyEffect.displayName = 'TopologyEffect';

export { TopologyEffect };
export default TopologyEffect;
