import { useState, useEffect, lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import SplashScreen from "./components/SplashScreen";
import { ThemeProvider } from "./hooks/useTheme";

// Lazy load components to improve initial load time
const Layout = lazy(() => import("./components/Layout"));
const Info = lazy(() => import("./pages/Info"));
const Projects = lazy(() => import("./pages/Projects"));
const Contact = lazy(() => import("./pages/Contact"));
const Stack = lazy(() => import("./pages/Stack"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Create QueryClient with optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Use HashRouter for GitHub Pages compatibility
const App = () => {
  const [showingSplash, setShowingSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowingSplash(false);
  };

  // Don't add GSAP to window - it's an unnecessary performance hit
  // and causes memory leaks

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" forcedTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          {showingSplash ? (
            <SplashScreen onComplete={handleSplashComplete} />
          ) : (
            <HashRouter>
              <Suspense fallback={<div className="min-h-screen bg-background"></div>}>
                <Routes>
                  <Route path="/" element={<Layout />}>
                    <Route index element={<Navigate to="/info" replace />} />
                    <Route path="info" element={<Info />} />
                    <Route path="contact" element={<Contact />} />
                    <Route path="projects" element={<Projects />} />
                    <Route path="stack" element={<Stack />} />
                  </Route>
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </HashRouter>
          )}
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
