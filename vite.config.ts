/// <reference types="vitest" />
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    base: '/PNG-Pro-Converter/',
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['vite.svg'], // we can add more logo variants later
        manifest: {
          name: 'Lumina Transcoder',
          short_name: 'Lumina',
          description: 'Zero-knowledge WebAssembly image compression pipeline.',
          theme_color: '#020617', // tailwind slate-950
          background_color: '#020617',
          display: 'standalone',
          orientation: 'portrait',
          icons: [
            {
              src: 'vite.svg',
              sizes: '192x192',
              type: 'image/svg+xml',
              purpose: 'any maskable'
            }
          ]
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,wasm}'],
          maximumFileSizeToCacheInBytes: 5000000 // 5MB limit to allow heavy WASM blobs
        }
      })
    ],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './setupTests.ts',
    },
    worker: {
      format: 'es'
    }
  };
});
