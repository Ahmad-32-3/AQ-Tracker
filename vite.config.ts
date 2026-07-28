import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      // Large demo clips in docs/ can lock and crash the watcher on Windows
      ignored: ['**/docs/**/*.mp4'],
    },
  },
})
