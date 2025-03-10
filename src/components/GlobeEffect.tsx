
import { useEffect, useRef, useState } from 'react';
import { useTheme } from '../hooks/useTheme';
import * as THREE from 'three';
import gsap from 'gsap';

// Import the full Vanta.js library instead of just the Topology effect
// This ensures we have all dependencies properly loaded
import VANTA from 'vanta/dist/vanta.topology.min';

interface GlobeEffectProps {
  activeSection: string;
}

interface SectionConfig {
  cameraPosition: [number, number, number];
  backgroundColor: number;
  speed: number;
}

const GlobeEffect = ({ activeSection }: GlobeEffectProps) => {
  const vantaRef = useRef<HTMLDivElement>(null);
  const [vantaEffect, setVantaEffect] = useState<any>(null);
  const { theme } = useTheme();
  
  // Configuration based on active section - now just camera position
  const getSectionConfig = (): SectionConfig => {
    const baseConfig = {
      backgroundColor: 0x0,
      speed: 1.0
    };
    
    // Different camera positions for each section
    switch (activeSection) {
      case 'info':
        return {
          ...baseConfig,
          cameraPosition: [0, 0, 150]
        };
      case 'contact':
        return {
          ...baseConfig,
          cameraPosition: [-100, 20, 80]
        };
      case 'stack':
        return {
          ...baseConfig,
          cameraPosition: [80, -40, 100]
        };
      case 'projects':
        return {
          ...baseConfig,
          cameraPosition: [40, 80, 120]
        };
      default:
        return {
          ...baseConfig,
          cameraPosition: [0, 0, 150]
        };
    }
  };
  
  // Get color configuration based on theme
  const getThemeColors = () => {
    if (theme === 'dark') {
      return {
        color: 0x3a7ad5,  // Dark blue
        color2: 0x403E43, // Charcoal Gray
        backgroundColor: 0x221F26 // Dark Charcoal
      };
    } else {
      return {
        color: 0x33C3F0,  // Sky Blue
        color2: 0x0FA0CE, // Bright Blue
        backgroundColor: 0xF2FCE2 // Soft Green background
      };
    }
  };
  
  useEffect(() => {
    if (!vantaEffect && vantaRef.current) {
      // Create base configuration for topology with more conservative settings
      const baseConfig = {
        el: vantaRef.current,
        THREE: THREE,
        mouseControls: false,
        touchControls: false,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        points: 10,
        maxDistance: 20.00,
        spacing: 15.00,
        showDots: true
      };
      
      // Merge configurations
      const colors = getThemeColors();
      const sectionConfig = getSectionConfig();
      
      // Debug the configuration
      console.log("Initializing Topology with config:", {
        ...baseConfig,
        ...colors,
        ...sectionConfig
      });
      
      // Initialize the effect
      try {
        const effect = VANTA.TOPOLOGY({
          ...baseConfig,
          ...colors,
          ...sectionConfig
        });
        setVantaEffect(effect);
        console.log("Topology effect initialized successfully");
      } catch (error) {
        console.error("Failed to initialize Topology effect:", error);
      }
    }
    
    return () => {
      if (vantaEffect) {
        console.log("Cleaning up Topology effect");
        vantaEffect.destroy();
      }
    };
  }, []);
  
  // Update when theme changes
  useEffect(() => {
    if (vantaEffect) {
      const colors = getThemeColors();
      console.log("Updating colors for theme:", theme, colors);
      vantaEffect.setOptions({
        color: colors.color,
        color2: colors.color2,
        backgroundColor: colors.backgroundColor
      });
    }
  }, [theme]);
  
  // Update when active section changes - adjust camera position
  useEffect(() => {
    if (vantaEffect && vantaEffect.camera) {
      const sectionConfig = getSectionConfig();
      const [targetX, targetY, targetZ] = sectionConfig.cameraPosition;
      
      console.log("Animating camera to:", { targetX, targetY, targetZ });
      
      // Kill any ongoing animations to prevent rubber-banding
      gsap.killTweensOf(vantaEffect.camera.position);
      
      // Animate the camera position with smoother settings
      gsap.to(vantaEffect.camera.position, {
        x: targetX,
        y: targetY,
        z: targetZ,
        duration: 2, // Slightly longer for smoother motion
        ease: "power2.inOut",
        overwrite: "auto" // Ensure we don't conflict with other animations
      });
    }
  }, [activeSection]);
  
  return (
    <div 
      ref={vantaRef} 
      className="fixed top-0 left-0 w-3/5 h-full z-10 pointer-events-none transition-opacity duration-500 pl-14 pr-14 pt-14 pb-14"
      aria-hidden="true"
    />
  );
};

export default GlobeEffect;
