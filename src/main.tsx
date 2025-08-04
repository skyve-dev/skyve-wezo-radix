import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import App from './App.tsx'
import './styles/scrollbar.css'
import { initializeScrollbarBehavior } from './utils/scrollbar.ts'

// Global styles
document.body.style.margin = '0';
document.body.style.padding = '0';
document.body.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif';
document.body.style.backgroundColor = '#f9fafb';

// Initialize custom scrollbar behavior
initializeScrollbarBehavior();

// Prevent zoom gestures on touch devices
const preventZoom = (e: TouchEvent) => {
  if (e.touches.length > 1) {
    e.preventDefault();
  }
};

// Prevent double-tap zoom
let lastTouchEnd = 0;
const preventDoubleTapZoom = (e: TouchEvent) => {
  const now = new Date().getTime();
  if (now - lastTouchEnd <= 300) {
    e.preventDefault();
  }
  lastTouchEnd = now;
};

// Prevent keyboard zoom shortcuts
const preventKeyboardZoom = (e: KeyboardEvent) => {
  if ((e.ctrlKey || e.metaKey) && (e.key === '+' || e.key === '-' || e.key === '0')) {
    e.preventDefault();
  }
};

// Prevent wheel zoom
const preventWheelZoom = (e: WheelEvent) => {
  if (e.ctrlKey || e.metaKey) {
    e.preventDefault();
  }
};

// Add event listeners
document.addEventListener('touchstart', preventZoom, { passive: false });
document.addEventListener('touchmove', preventZoom, { passive: false });
document.addEventListener('touchend', preventDoubleTapZoom, { passive: false });
document.addEventListener('keydown', preventKeyboardZoom, { passive: false });
document.addEventListener('wheel', preventWheelZoom, { passive: false });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
