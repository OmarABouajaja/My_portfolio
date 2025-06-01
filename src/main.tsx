import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css'; // Global styles

// Get the root DOM element
const container = document.getElementById('root');
if (!container) throw new Error('Failed to find the root element');

// Create React root and render the App
const root = createRoot(container);
root.render(<App />);
