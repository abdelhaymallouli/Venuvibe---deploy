import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/', // Explicitly tell Vite your app is at the root
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
