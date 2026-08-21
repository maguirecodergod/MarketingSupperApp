import React from 'react';
import ReactDOM from 'react-dom/client';
import { bootstrapTheme } from '@enterprise/theme';
import { initI18n, detectLocale } from '@enterprise/localization';
import App from './App.js';
import './index.css';

// Synchronous theme bootstrap
bootstrapTheme();

// Initialize i18n
const detectedLocale = detectLocale();
initI18n(detectedLocale).then(() => {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  }
});
