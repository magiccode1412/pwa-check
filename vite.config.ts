import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 通过环境变量 VITE_BASE_PATH 控制构建时的 base，实现指定路径部署
  // 例如：VITE_BASE_PATH=/subpath pnpm build
  const env = loadEnv(mode, process.cwd(), '')
  const base = env.VITE_BASE_PATH || '/'
  const normalizedBase = base.endsWith('/') ? base : `${base}/`

  // 图标位于 public/ 下，构建后会被拷贝到 base 对应的子路径。
  // 因此需要为 manifest 中的图标路径拼接 base，确保子路径部署时也能正确加载。
  const iconSrc = (file: string) => `${normalizedBase}icons/${file}`

  return {
    base,
    plugins: [
      vue(),
      VitePWA({
        registerType: 'autoUpdate',
        manifest: {
          name: 'PWA支持检测工具',
          short_name: 'PWA检测',
          description: '一个用于检测浏览器对PWA关键能力的支持情况，并展示结果与建议的轻量工具。',
          start_url: normalizedBase,
          scope: normalizedBase,
        display: 'standalone',
        background_color: '#F8FAFC',
        theme_color: '#3B82F6',
        icons: [
          {
            src: iconSrc('icon-192.png'),
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: iconSrc('icon-192-maskable.png'),
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: iconSrc('icon-512.png'),
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: iconSrc('icon-512-maskable.png'),
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        navigateFallback: normalizedBase,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/cdnjs\.cloudflare\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'cdn-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              }
            }
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  server: {
    host: '0.0.0.0',
    allowedHosts: true
  }
  }
})
