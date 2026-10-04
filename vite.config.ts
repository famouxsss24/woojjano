import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// base './' + HashRouter → 어느 주소(GitHub Pages 하위 경로 등)에 올려도 그대로 동작
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
})
