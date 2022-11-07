import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue2 from '@vitejs/plugin-vue2'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue2(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src/client', import.meta.url))
    }
  },
//   build: {
//     rollupOptions: {
//       input: {
//         // eslint-disable-next-line no-undef
//         main: resolve(__dirname, 'index.html'),
//         // eslint-disable-next-line no-undef
//         login: resolve(__dirname, 'login/index.html'),
//       }
//     }
//   }
})
