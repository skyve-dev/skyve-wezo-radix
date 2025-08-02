import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import App from './App.tsx'

// Global styles
document.body.style.margin = '0';
document.body.style.padding = '0';
document.body.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif';
document.body.style.backgroundColor = '#f9fafb';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
