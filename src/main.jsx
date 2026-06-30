import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const gate = (await import('./introLoaderGate.js')).createIntroLoaderGate({
  sessionKey: 'acm_intro_seen_v3',
});

gate.renderWithGate(
  <StrictMode>
    <App />
  </StrictMode>,
  { IntroComponent: (await import('./components/IntroLoader.jsx')).default },
);

