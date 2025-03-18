import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      manifest: {
        name: 'Habillement App',
        short_name: 'Habillement',
        description: 'A PWA for habillement management.',
        theme_color: '#007AFF',
        icons: [
          {
            src: '/habillement_V3 192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/habillement_V3 512x512.png',
            sizes: '512x512',
            type: 'image/png',
          }
        ],
        start_url: '/',
        display: 'standalone',
      },
    })
  ],
})
