import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/vue3-intelipark/', // github仓库名称
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    })
  ],
  build: {
    outDir: 'docs',
    chunkSizeWarningLimit: 2000 // 将限制调整到 1000 kB
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    preprocessorOptions: {
      // 自动导入定制化样式文件进行样式覆盖
      scss: { additionalData: `@use "@/assets/var.scss" as *;` }
    }
  }
  // server: {
  //   host: '::' // 使用IPV6地址
  //   cors: true // 允许跨域
  // }
})
