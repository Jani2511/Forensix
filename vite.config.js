import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const securityHeaders = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Content-Security-Policy": "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self' ws:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'",
}

export default defineConfig(({ command }) => {
  const headers = command === "serve"
    ? {
        ...securityHeaders,
        "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' ws:; worker-src 'self' blob:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'",
      }
    : securityHeaders

  return {
    base: process.env.VITE_BASE_PATH || "/",
    plugins: [react()],
    server: { headers },
    preview: { headers: securityHeaders },
  }
})
