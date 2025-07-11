import { useEffect, useRef, useState, memo } from 'react';
import { useTheme } from '../hooks/useTheme';
import EPHEMERAL from './vanta/ephemeral.js';
import TOPOLOGY from './vanta/topology.js';
import colorSchemes from '../config/colorSchemes';
import * as THREE from 'three';
import { useIsMobile } from '../hooks/use-mobile';
import { getBrightness } from './vanta/helper.js';

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
  const prevIsMobileRef = useRef(isMobile);
  
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
    if ((theme !== prevThemeRef.current || isMobile !== prevIsMobileRef.current) && vantaEffectRef.current) {
      vantaEffectRef.current.destroy();
      vantaEffectRef.current = null;
    }
    
    prevThemeRef.current = theme;
    prevIsMobileRef.current = isMobile;
  }, [theme, isMobile]);

  // Initialize or update the effect with greatly optimized settings
  useEffect(() => {
    if (!vantaRef.current || !p5Loaded) return;
    
    // Get colors based on theme and active section
    const themeColors = colorSchemes[theme as 'dark' | 'light'];
    const sectionColors = themeColors[activeSection as keyof typeof themeColors] || themeColors.info;
    
    const backgroundColor = sectionColors.background;
    const foregroundColor = sectionColors.foreground;

    // Determine speed & direction dynamically based on foreground colour brightness
    const brightness = getBrightness(new THREE.Color(foregroundColor)); // 0–1 range
    // Speed ranges from 0.5 → 2.0. Darker colours yield slower speed and reverse direction.
    const speedFactor = 0.2 + brightness * 0.5; // slower magnitude
    const direction = brightness < 0.4 ? -1 : 1; // reverse for very dark colours
    const animationSpeed = speedFactor * direction;

    // Device-specific sizing for the EPHEMERAL effect (desktop only)
    let zoom = 1;
    let orbitScale = 1;
    if (!isMobile) {
      // Base zoom for desktop and further boost by colour brightness
      zoom = 2.5 + brightness * 1.0; // roughly 2.5 → 3.5
      // Keep the motion safely in frame but larger than before
      orbitScale = Math.min(1, 1.2 / zoom); // keeps within frame
    }

    // Optimized particle count for better performance and visual impact
    const particleCount = isMobile ? 400 : 1200;
    const particleSize = isMobile ? 1 : 1.2;
    const noiseSize = isMobile ? 0.008 : 0.006;
    const scale = isMobile ? 1.4 : 1.6;

    // Select effect implementation based on device
    const EffectImpl = isMobile ? TOPOLOGY : EPHEMERAL;

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
        vantaEffectRef.current = EffectImpl({
          el: vantaRef.current,
          p5: p5,
          mouseControls: false, 
          touchControls: false,  
          gyroControls: false,
          minHeight: 0.00,
          minWidth: 0.00,
          scale: scale,
          scaleMobile: 2.0,
          color: foregroundColor,
          backgroundColor: backgroundColor,
          speed: animationSpeed,
          particleCount: particleCount,
          particleSize: particleSize,
          flowCellSize: isMobile ? 6 : 10, // Better balance for performance vs detail
          noiseSize: noiseSize,
          noiseRadius: 0.15, // Increased for more organic movement
          colorMode: 'variance',
          colorVariance: 0.25, // More color variation for expressiveness
          pulseIntensity: 0.06, // Slightly more pulse for visual interest
          pulseSpeed: 0.4, // Faster pulse for more dynamic feel
          offset: 0.1, // Reduced to bring effect more toward center
          orbitScale: orbitScale,
        });
      } catch (error) {
        console.error("Failed to initialize topology effect:", error);
      }
    } 
    // If effect exists and section changed, just update colors
    else if (activeSection !== prevSectionRef.current) {
      try {
        // Update only the color properties (and animation params on desktop)
        const optionUpdate = {
          color: foregroundColor,
          backgroundColor: backgroundColor,
        } as any;
        if (!isMobile) {
          optionUpdate.speed = animationSpeed;
          optionUpdate.zoom = zoom;
          optionUpdate.orbitScale = orbitScale;
        }
        vantaEffectRef.current.setOptions(optionUpdate);
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
        padding: '0',
      }}
    />
  );
});

// Add display name for debugging
TopologyEffect.displayName = 'TopologyEffect';

export { TopologyEffect };
export default TopologyEffect;
