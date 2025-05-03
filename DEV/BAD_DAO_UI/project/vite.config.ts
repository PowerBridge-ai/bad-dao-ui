import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      // Whether to polyfill `node:` protocol imports.
      protocolImports: true,
    }),
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  define: {
    // Define process.env to avoid "process is not defined" errors
    'process.env': {
      OPENAI_API_KEY: '',
      MISTRAL_API_KEY: '',
      GOOGLE_API_KEY: '',
      OPENROUTER_API_KEY: '',
      ANTHROPIC_API_KEY: '',
      THIRDWEB_SECRET_KEY: '',
    }
  }
});
