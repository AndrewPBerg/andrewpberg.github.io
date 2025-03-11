import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    if (!containerRef.current || !textRef.current || !overlayRef.current) return;
    
    // Initial state setup
    gsap.set(containerRef.current, { autoAlpha: 1 });
    gsap.set(textRef.current, { autoAlpha: 0, y: 5 }); // Smaller movement
    gsap.set(overlayRef.current, { scaleX: 0, transformOrigin: "left" });
    
    const tl = gsap.timeline({
      onComplete: () => {
        // Exit animation
        const exitTl = gsap.timeline({
          onComplete: () => {
            setIsVisible(false);
            onComplete();
          }
        });
        
        exitTl.to(textRef.current, {
          autoAlpha: 0,
          y: -5, // Smaller movement
          duration: 0.25,
          ease: "power2.in"
        })
        .to(overlayRef.current, {
          scaleX: 0,
          transformOrigin: "right",
          duration: 0.5,
          ease: "power2.inOut"
        });
      }
    });
    
    // Clean, Apple-inspired animation sequence
    tl.to(overlayRef.current, {
      scaleX: 1,
      duration: 0.6,
      ease: "power2.inOut"
    })
    .to(textRef.current, {
      autoAlpha: 1,
      y: 0,
      duration: 0.4,
      ease: "power2.out"
    })
    .to(textRef.current, {
      scale: 1.02, // Smaller scale effect
      duration: 0.2,
      ease: "power2.out"
    })
    .to(textRef.current, {
      scale: 1,
      duration: 0.2,
      ease: "power2.in"
    });
    
    // Ensure total duration is about 2 seconds
    if (tl.duration() > 1.6) {
      tl.timeScale(tl.duration() / 1.6);
    }
    
    return () => {
      tl.kill();
    };
  }, [onComplete]);
  
  if (!isVisible) return null;
  
  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 z-50 flex items-center justify-center bg-background dark:bg-background"
    >
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-background dark:bg-background"
      />
      <div 
        ref={textRef}
        className="font-display text-4xl sm:text-5xl md:text-6xl text-foreground dark:text-foreground tracking-tight z-10 absolute-center"
        style={{ fontFamily: "'Bebas Neue', sans-serif" }}
      >
        Andrew P. Berg
      </div>
    </div>
  );
};

export default SplashScreen;
