import { useEffect, useRef, useState, memo } from 'react';
import { useTheme } from '../hooks/useTheme';
import TOPOLOGY from './vanta/topology.js';
import colorSchemes from '../config/colorSchemes';

let p5: any = null;

interface TopologyEffectProps {
  activeSection: string;
}

const TopologyEffect = memo(({ activeSection = 'info' }: TopologyEffectProps) => {
  const { theme } = useTheme();
  const vantaRef = useRef<HTMLDivElement>(null);
  const vantaEffectRef = useRef<any>(null);
  const [p5Loaded, setP5Loaded] = useState(false);
  
  // Load p5.js dynamically
  useEffect(() => {
    if (typeof window !== 'undefined' && !p5) {
      import('p5').then((p5Module) => {
        p5 = p5Module.default;
        setP5Loaded(true);
      });
    }
    
    return () => {
      if (vantaEffectRef.current) {
        vantaEffectRef.current.destroy();
        vantaEffectRef.current = null;
      }
    };
  }, []);

  // Handle effect initialization and updates
  useEffect(() => {
    if (!vantaRef.current || !p5Loaded) return;

    const themeColors = colorSchemes[theme as 'dark' | 'light'];
    const sectionColors = themeColors[activeSection as keyof typeof themeColors] || themeColors.info;
    
    const backgroundColor = sectionColors.background;
    const foregroundColor = sectionColors.foreground;

    const updateEffect = () => {
      if (vantaEffectRef.current) {
        vantaEffectRef.current.setOptions({
          color: foregroundColor,
          backgroundColor: backgroundColor
        });
      } else {
        vantaEffectRef.current = TOPOLOGY({
          el: vantaRef.current,
          p5: p5,
          mouseControls: false, 
          touchControls: false,  
          gyroControls: false,
          minHeight: 100.00,
          minWidth: 100.00,
          scale: 1.0,
          scaleMobile: 0.8,
          color: foregroundColor,
          backgroundColor: backgroundColor,
          speed: 1.0,
          particleCount: 4000,
          particleSize: 1.4,
          flowCellSize: 10,
          noiseSize: 0.003,
          noiseRadius: 0.1,
          colorMode: 'variance',
          colorVariance: 0.25,
          pulseIntensity: 0,
          pulseSpeed: 0,
          offset: 100,
        });
      }
    };

    // Use RAF to ensure smooth color transitions
    if (typeof window !== 'undefined') {
      window.requestAnimationFrame(updateEffect);
    }
  }, [p5Loaded, theme, activeSection]);

  return (
    <div 
      ref={vantaRef} 
      className="fixed top-0 left-0 w-full h-full -z-10 opacity-60 will-change-transform"
      aria-hidden="true"
      style={{ 
        transform: 'translate3d(0,0,0)',
        backfaceVisibility: 'hidden',
        mixBlendMode: 'normal',
        filter: 'contrast(1.4) brightness(1.5)',
        transition: 'background-color 0.2s ease-out'
      }}
    />
  );
});

TopologyEffect.displayName = 'TopologyEffect';

export { TopologyEffect };
export default TopologyEffect;
