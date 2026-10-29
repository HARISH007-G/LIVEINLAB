import fs from 'node:fs';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Fix Node v25+ on Windows sandbox where native realpath throws EPERM
try {
  fs.realpathSync.native(process.cwd());
} catch (err) {
  if (err && (err.code === 'EPERM' || err.code === 'EISDIR')) {
    fs.realpathSync.native = fs.realpathSync;
  }
}

export default defineConfig({
  // Use environment-aware base URL
  // Development: '/' for localhost
  // Production: '/LIVEINLAB/' for GitHub Pages (or custom VITE_BASE_PATH if set)
  base: process.env.VITE_BASE_PATH || (process.env.NODE_ENV === 'production' ? '/LIVEINLAB/' : '/'),

  plugins: [react()],

  server: {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    },
    fs: {
      strict: false
    }
  },

  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  }
});
