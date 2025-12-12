import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

declare const process: any;

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    define: {
      // Safely stringify the API key. If missing, it defaults to an empty string to prevent build crash,
      // though API calls will fail gracefully later.
      'process.env.API_KEY': JSON.stringify(env.API_KEY || '')
    }
  };
});