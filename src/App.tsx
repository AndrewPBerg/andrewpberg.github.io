import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, HashRouter, Routes, Route, Navigate } from "react-router-dom";
import SplashScreen from "./components/SplashScreen";
import Layout from "./components/Layout";
import Info from "./pages/Info";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";
import Stack from "./pages/Stack";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "./hooks/useTheme";

const queryClient = new QueryClient();

// Use HashRouter on production (GitHub Pages) to avoid 404s on deep routes
const Router = process.env.NODE_ENV === "production" ? HashRouter : BrowserRouter;
// const Router = HashRouter;

const App = () => {
  const [showingSplash, setShowingSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowingSplash(false);
  };

  // Add GSAP to the global window object for debugging
  useEffect(() => {
    import("gsap").then((gsap) => {
      (window as any).gsap = gsap.default;
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          {showingSplash ? (
            <SplashScreen onComplete={handleSplashComplete} />
          ) : (
            <Router basename="/">
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
            </Router>
          )}
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
