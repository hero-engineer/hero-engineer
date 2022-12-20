import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import cwd from 'vite-plugin-cwd' // This is needed by Hero Engineer to resolve the current working directory

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), cwd()],
  optimizeDeps: {
    include: ['react-dom'],
  },
})
