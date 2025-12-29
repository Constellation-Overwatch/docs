import react from '@vitejs/plugin-react';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import { defineConfig } from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';
import tailwindcss from '@tailwindcss/vite';
import mdx from 'fumadocs-mdx/vite';
import netlify from '@netlify/vite-plugin-tanstack-start';

export default defineConfig({
  server: {
    port: 3003,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Split large visualization libraries
          if (id.includes('mermaid')) return 'mermaid';
          if (id.includes('katex')) return 'katex';
          if (id.includes('cytoscape')) return 'cytoscape';
          // Vendor chunks
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            // Don't separate fumadocs into its own chunk to avoid context issues
            // if (id.includes('fumadocs')) {
            //   return 'fumadocs-vendor';
            // }
            return 'vendor';
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  plugins: [
    mdx(await import('./source.config')),
    tailwindcss(),
    tsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tanstackStart({
      pages: [
        {
          path: '/docs',
        },
        {
          path: '/api/search',
        },
      ],
    }),
    netlify(),
    react(),
  ],
});
