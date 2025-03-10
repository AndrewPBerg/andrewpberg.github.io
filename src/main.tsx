
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import gsap from 'gsap'

// No need to directly import SplitText in main.tsx
// The SplashScreen component will handle its own GSAP plugins

createRoot(document.getElementById("root")!).render(<App />);
