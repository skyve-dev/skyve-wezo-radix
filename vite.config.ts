import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/wezo/', // 👈 important
  plugins: [react()],
  build: {
    outDir: 'dist/wezo',
  },
})
