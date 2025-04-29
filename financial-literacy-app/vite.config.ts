// financial-literacy-app/vite.config.js
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');
  return {
    // vite config
    define: {
      // Make VITE_ variables available client-side
      'process.env.VITE_API_BASE_URL': JSON.stringify(env.VITE_API_BASE_URL)
      // Add other VITE_ variables here if needed
    },
    plugins: [react()],
    server: { // Optional: Define server options for local dev
        port: 5173, // Default port
        strictPort: true, // Fail if port is already in use
        // proxy: { // Optional: Setup proxy if needed (alternative to CORS)
        //   '/api': {
        //     target: 'http://localhost:8000', // Your local backend
        //     changeOrigin: true,
        //     rewrite: (path) => path.replace(/^\/api/, ''), // Remove /api prefix if backend doesn't use it
        //   }
        // }
    }
  }
})