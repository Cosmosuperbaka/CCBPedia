import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// 纯 CSR 静态站点：使用相对路径 + Hash 路由，任意静态托管目录都能直接打开
export default defineConfig({
  base: './',
  plugins: [react()],
  server: { port: 5199 },
});
