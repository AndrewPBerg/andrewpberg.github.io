
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "dark",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "dark",
  storageKey = "theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );

  // Optimized theme application for better performance
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Apply transition class with minimal DOM operations
    const applyTheme = (newTheme: string) => {
      requestAnimationFrame(() => {
        // Apply transition class first (before changing classes)
        root.classList.add('theme-transition');
        
        // Update the document theme with minimal repaints
        root.classList.remove("light", "dark");
        root.classList.add(newTheme);
        
        // Dispatch custom event for theme change
        window.dispatchEvent(new CustomEvent('themechange', { 
          detail: { theme: newTheme } 
        }));
        
        // Remove transition class after the change is complete
        const transitionTimeout = setTimeout(() => {
          root.classList.remove('theme-transition');
        }, 300);
        
        return () => clearTimeout(transitionTimeout);
      });
    };
    
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      
      applyTheme(systemTheme);
    } else {
      applyTheme(theme);
    }
  }, [theme]);

  // Optimized system theme change listener
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      const root = window.document.documentElement;
      const systemTheme = mediaQuery.matches ? "dark" : "light";
      
      // Use requestAnimationFrame for smoother transitions
      requestAnimationFrame(() => {
        // Add transition class for system theme changes
        root.classList.add('theme-transition');
        
        root.classList.remove("light", "dark");
        root.classList.add(systemTheme);
        
        // Dispatch custom event for theme change
        window.dispatchEvent(new CustomEvent('themechange', { 
          detail: { theme: systemTheme } 
        }));
        
        // Remove transition class after the change is complete
        setTimeout(() => {
          root.classList.remove('theme-transition');
        }, 300);
      });
    };
    
    // Use the modern event listener approach
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      // Store theme in localStorage and update state in one pass
      localStorage.setItem(storageKey, newTheme);
      setTheme(newTheme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  
  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");
  
  return context;
};
