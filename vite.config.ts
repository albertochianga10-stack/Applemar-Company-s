import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Garante que 'process.env' exista no navegador para não quebrar o SDK da Google
    'process.env': {}
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'lucide-react', 'recharts']
        }
      }
    }
  },
  server: {
    port: 3000
  }
});