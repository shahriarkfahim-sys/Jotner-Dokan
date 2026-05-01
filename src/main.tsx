import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { seedDatabase } from './seed.ts';

// Seed database in dev mode
if (process.env.NODE_ENV !== 'production') {
  seedDatabase().catch((error) => {
    console.warn('Skipping database seed:', error);
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
