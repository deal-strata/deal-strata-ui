import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/deal-strata-ui/',
  server: {
    host: '0.0.0.0', // 👈 makes it accessible on all interfaces
    port: 5173, // or your custom port
    allowedHosts: [
      'laptop-jf79v4jb.tail9990f6.ts.net', // 👈 Add your host here
      'localhost'
    ],
  },
})

