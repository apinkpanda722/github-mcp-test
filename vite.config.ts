import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { sentryVitePlugin } from '@sentry/vite-plugin'

export default defineConfig({
  plugins: [
    react(),
    sentryVitePlugin({
      org: 'papa-jg',
      project: 'papa-jg',
    }),
  ],
  build: {
    sourcemap: true,
  },
})
