import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    // Proxy para a API oficial de consulta do PNCP. O upstream não envia
    // headers CORS, então o request sai do servidor de dev (Node), não do
    // browser. Em produção estática não há proxy → o radar cai para os dados
    // de demonstração (a coleta real roda server-side; ver README).
    proxy: {
      '/pncp': {
        target: 'https://pncp.gov.br/api/consulta',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/pncp/, ''),
      },
    },
  },
})
