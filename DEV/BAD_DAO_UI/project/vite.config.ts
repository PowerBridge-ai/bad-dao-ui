import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
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
        // Use environment variables with fallbacks
        OPENAI_API_KEY: env.VITE_OPENAI_API_KEY || '',
        MISTRAL_API_KEY: env.VITE_MISTRAL_API_KEY || 'YkPOw8pc2totUqczBksPrC3Z5s7Plw0y',
        GOOGLE_API_KEY: env.VITE_GOOGLE_API_KEY || '',
        OPENROUTER_API_KEY: env.VITE_OPENROUTER_API_KEY || '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',
        ANTHROPIC_API_KEY: env.VITE_ANTHROPIC_API_KEY || '',
        THIRDWEB_SECRET_KEY: env.VITE_THIRDWEB_SECRET_KEY || 'ZuG7FQ2uD7F5sJzckw02P_SNAiEHtWsUA46AYC124wHsZxqmgz84RPDsuFO_dfUF6Uj6K2e4XtzN_ODQGO41UA',
        THIRDWEB_CLIENT_ID: env.VITE_THIRDWEB_CLIENT_ID || '3eb01797a1d9f0b74a8f3e1dc5b624ab'
      }
    }
  };
});
