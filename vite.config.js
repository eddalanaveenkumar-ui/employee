import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    // Proxy all /api requests to the Spring Boot backend
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
