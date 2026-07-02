import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { sentryVitePlugin } from '@sentry/vite-plugin'

export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/github-mcp-test/' : '/',
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
}))
