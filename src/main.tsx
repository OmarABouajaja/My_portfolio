import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css'; // Global styles

// Get the root DOM element
const container = document.getElementById('root');

// Ensure the root element exists
if (!container) {
  throw new Error('Failed to find the root element. Please ensure there is a div with id="root" in your index.html');
}

// Create React root and render the App
const root = createRoot(container);

// Render the app with error boundary
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
