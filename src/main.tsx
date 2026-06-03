import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Intercept and safely silence expected development-side WebSocket and HMR connection errors
if (typeof window !== 'undefined') {
  const silenceHmrErrors = (event: PromiseRejectionEvent | ErrorEvent) => {
    const errorMsg = event instanceof ErrorEvent ? event.message : String(event.reason);
    if (
      errorMsg &&
      (errorMsg.includes('WebSocket') ||
        errorMsg.includes('websocket') ||
        errorMsg.includes('ws://') ||
        errorMsg.includes('wss://') ||
        errorMsg.includes('vite') ||
        errorMsg.includes('HMR') ||
        errorMsg.includes('closed without opened'))
    ) {
      event.preventDefault();
      event.stopImmediatePropagation?.();
    }
  };

  window.addEventListener('unhandledrejection', silenceHmrErrors as EventListener, true);
  window.addEventListener('error', silenceHmrErrors as EventListener, true);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

