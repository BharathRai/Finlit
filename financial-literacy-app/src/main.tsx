// src/main.jsx (or .tsx)
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.js'
import './index.css' // <-- Make sure this line is present
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> {/* Wrap App with BrowserRouter */}
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)