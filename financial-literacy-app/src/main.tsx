// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App'; // Assumes App.tsx
import './index.css';

const rootElement = document.getElementById('root');

// --- ADDED NULL CHECK ---
if (rootElement) { // Check if element exists before creating root
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>,
  );
} else {
  console.error("Fatal Error: Root element with ID 'root' not found in HTML. Check public/index.html.");
}
// --- END NULL CHECK ---