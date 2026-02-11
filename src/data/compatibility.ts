import type { BrowserCompatibility } from '@/types'

// 功能兼容性数据库
export interface FeatureCompatibility {
  canIUseId: string
  globalSupport: number
  description: string
  minVersions: {
    chrome: string
    firefox: string
    safari: string
    edge: string
  }
  features: string[]
  limitations: string
  detectionMethod: {
    summary: string
    apis: string[]
    codeExample: string
    details: string[]
  }
}

export const compatibilityDatabase: Record<string, FeatureCompatibility> = {
  'Service Worker': {
    canIUseId: 'serviceworkers',
    globalSupport: 94.5,
    description: 'Service Worker API允许在后台运行脚本',
    minVersions: {
      chrome: '40',
      firefox: '44',
      safari: '11.1',
      edge: '17'
    },
    features: ['离线缓存', '后台同步', '推送通知'],
    limitations: '需要HTTPS环境，同源策略限制',
    detectionMethod: {
      summary: '检测 navigator.serviceWorker 对象是否存在',
      apis: ['navigator.serviceWorker', 'ServiceWorkerContainer'],
      codeExample: "const supported = 'serviceWorker' in navigator;\nif (supported) {\n  navigator.serviceWorker.register('/sw.js');\n}",
      details: [
        "使用 'serviceWorker' in navigator 检测浏览器是否支持 Service Worker",
        '检查 navigator.serviceWorker 对象及其 register 方法是否存在',
        '尝试注册 Service Worker 时必须在 HTTPS 或 localhost 环境下',
        '可以通过 navigator.serviceWorker.controller 检查当前页面是否被 Service Worker 控制'
      ]
    }
  },
  'HTTPS环境': {
    canIUseId: 'https',
    globalSupport: 99.8,
    description: '安全传输协议，PWA的基本要求',
    minVersions: {
      chrome: '1',
      firefox: '1',
      safari: '1',
      edge: '12'
    },
    features: ['数据加密', '安全连接'],
    limitations: '需要有效SSL证书',
    detectionMethod: {
      summary: '检测 window.location.protocol 和 hostname',
      apis: ['window.location.protocol', 'window.location.hostname', 'isSecureContext'],
      codeExample: "const isHttps = window.location.protocol === 'https:' || window.location.hostname === 'localhost';\nconst isSecure = window.isSecureContext;",
      details: [
        "检查 window.location.protocol 是否等于 'https:'",
        '允许 localhost 作为开发环境例外（无需 HTTPS）',
        '使用 window.isSecureContext 检测当前上下文是否为安全环境',
        'Service Worker 和某些敏感 API 必须在安全上下文中运行'
      ]
    }
  },
  'Web App Manifest': {
    canIUseId: 'web-app-manifest',
    globalSupport: 78.3,
    description: '允许Web应用添加到主屏幕',
    minVersions: {
      chrome: '38',
      firefox: '未完全支持',
      safari: '11.3',
      edge: '17'
    },
    features: ['主屏幕安装', '启动画面', '全屏模式'],
    limitations: 'Firefox需要手动安装',
    detectionMethod: {
      summary: '检测 HTML link 标签中是否存在 manifest 引用',
      apis: ['document.querySelector', 'HTMLLinkElement', 'manifest'],
      codeExample: 'const manifests = document.querySelectorAll(\'link[rel="manifest"]\');\nconst hasManifest = manifests.length > 0;',
      details: [
        '使用 document.querySelectorAll(\'link[rel="manifest"]\') 查找所有 manifest 链接',
        '检测页面头部是否包含 <link rel="manifest" href="/manifest.json">',
        'Manifest 文件必须在同域或通过 CORS 允许访问',
        '可以通过 fetch(manifestUrl) 获取并解析 manifest 内容验证格式'
      ]
    }
  },
  '推送通知': {
    canIUseId: 'push-api',
    globalSupport: 73.2,
    description: '允许服务器向用户推送消息',
    minVersions: {
      chrome: '42',
      firefox: '44',
      safari: '16',
      edge: '17'
    },
    features: ['实时通知', '后台消息', '用户交互'],
    limitations: '需要用户授权，Safari限制较多',
    detectionMethod: {
      summary: '检测 PushManager 和 Notification API 是否可用',
      apis: ['PushManager', 'Notification', 'Notification.permission'],
      codeExample: "const pushSupported = 'PushManager' in window;\nconst notificationSupported = 'Notification' in window;\nconst permission = Notification.permission;",
      details: [
        "检查 'PushManager' in window 判断是否支持推送功能",
        "检查 'Notification' in window 判断是否支持通知显示",
        '读取 Notification.permission 获取当前权限状态（granted/denied/default）',
        '在 Service Worker 中使用 self.registration.pushManager 订阅推送',
        'Safari 需要使用 safari.pushNotification 私有 API'
      ]
    }
  },
  '离线存储': {
    canIUseId: 'indexeddb',
    globalSupport: 96.8,
    description: '客户端数据存储解决方案',
    minVersions: {
      chrome: '23',
      firefox: '10',
      safari: '8',
      edge: '12'
    },
    features: ['大数据存储', '事务支持', '异步操作'],
    limitations: '同源限制，配额管理',
    detectionMethod: {
      summary: '检测 IndexedDB 和 Cache API 是否可用',
      apis: ['indexedDB', 'caches', 'IDBFactory', 'CacheStorage'],
      codeExample: "const indexedDBSupported = 'indexedDB' in window;\nconst cacheSupported = 'caches' in window;\n// 检测能否实际打开数据库\nif (indexedDBSupported) {\n  const request = indexedDB.open('test', 1);\n}",
      details: [
        "检查 'indexedDB' in window 判断是否支持 IndexedDB",
        "检查 'caches' in window 判断是否支持 Cache API",
        'IndexedDB 提供结构化数据存储，支持索引和事务',
        'Cache API 主要用于 Service Worker 中缓存网络请求响应',
        '可以尝试实际打开数据库验证功能是否真正可用',
        '使用 navigator.storage.estimate() 检查可用存储配额'
      ]
    }
  },
  '设备API': {
    canIUseId: 'web-share',
    globalSupport: 89.4,
    description: '与系统原生功能交互',
    minVersions: {
      chrome: '89',
      firefox: '85',
      safari: '12.3',
      edge: '89'
    },
    features: ['系统分享', '文件操作', '设备通信'],
    limitations: '需要用户权限，功能有限',
    detectionMethod: {
      summary: '检测 Web Share API 和 Bluetooth API 是否可用',
      apis: ['navigator.share', 'navigator.bluetooth', 'navigator.canShare'],
      codeExample: "const shareSupported = 'share' in navigator;\nconst bluetoothSupported = 'bluetooth' in navigator;\n// 检测能否分享特定数据\nconst canShareFiles = navigator.canShare && navigator.canShare({ files: [] });",
      details: [
        "检查 'share' in navigator 判断是否支持系统分享功能",
        "检查 'bluetooth' in navigator 判断是否支持 Web Bluetooth",
        '使用 navigator.canShare(data) 验证特定数据是否可以分享',
        'navigator.share({ title, text, url, files }) 调用系统分享面板',
        'Web Bluetooth 需要用户手势触发才能请求配对',
        '还包含其他设备 API：USB、Serial、HID 等'
      ]
    }
  },
  '媒体控制': {
    canIUseId: 'media-session',
    globalSupport: 81.7,
    description: '媒体播放控制和系统集成',
    minVersions: {
      chrome: '73',
      firefox: '71',
      safari: '15',
      edge: '79'
    },
    features: ['媒体控制', '锁屏信息', '系统通知'],
    limitations: '需要媒体元素，权限限制',
    detectionMethod: {
      summary: '检测 Media Session API 和 Wake Lock API 是否可用',
      apis: ['navigator.mediaSession', 'navigator.wakeLock'],
      codeExample: "const mediaSessionSupported = 'mediaSession' in navigator;\nconst wakeLockSupported = 'wakeLock' in navigator;\n// 设置媒体元数据\nif (mediaSessionSupported) {\n  navigator.mediaSession.metadata = new MediaMetadata({ title: '...' });\n}",
      details: [
        "检查 'mediaSession' in navigator 判断是否支持媒体会话",
        "检查 'wakeLock' in navigator 判断是否支持屏幕唤醒锁定",
        'Media Session API 允许自定义媒体控制中心和锁屏界面显示',
        '设置 navigator.mediaSession.metadata 提供歌曲/视频信息',
        '使用 navigator.mediaSession.setActionHandler() 处理播放控制',
        'Wake Lock API 防止屏幕自动熄灭，需要用户激活'
      ]
    }
  },
  '性能优化': {
    canIUseId: 'webworkers',
    globalSupport: 98.7,
    description: '多线程JavaScript执行',
    minVersions: {
      chrome: '4',
      firefox: '3.5',
      safari: '4',
      edge: '12'
    },
    features: ['多线程', '并行计算', '后台处理'],
    limitations: '不能直接操作DOM，通信开销',
    detectionMethod: {
      summary: '检测 Web Workers 和 WebAssembly 是否可用',
      apis: ['Worker', 'WebAssembly', 'SharedArrayBuffer'],
      codeExample: "const workerSupported = 'Worker' in window;\nconst wasmSupported = typeof WebAssembly === 'object';\n// 检测 WebAssembly 具体功能\nconst wasmMemory = WebAssembly.Memory !== undefined;",
      details: [
        "检查 'Worker' in window 判断是否支持 Web Workers",
        '检查 typeof WebAssembly === "object" 判断是否支持 WASM',
        'Web Workers 允许在后台线程运行 JavaScript，不阻塞主线程',
        'SharedArrayBuffer 用于 Workers 之间共享内存（需要安全上下文）',
        'WebAssembly 提供接近原生的执行性能',
        '可以进一步检测 WebAssembly.instantiate() 等方法是否可用'
      ]
    }
  },
  '后台同步': {
    canIUseId: 'background-sync',
    globalSupport: 61.2,
    description: '网络恢复时自动同步数据',
    minVersions: {
      chrome: '49',
      firefox: '未支持',
      safari: '未支持',
      edge: '79'
    },
    features: ['离线同步', '数据一致性', '自动恢复'],
    limitations: '仅Chrome和Edge支持',
    detectionMethod: {
      summary: '检测 SyncManager API 是否在 Service Worker 注册中可用',
      apis: ['SyncManager', 'ServiceWorkerRegistration.sync', 'PeriodicSyncManager'],
      codeExample: "// 在 Service Worker 支持的基础上\nconst swSupported = 'serviceWorker' in navigator;\nasync function checkSyncSupport() {\n  const reg = await navigator.serviceWorker.ready;\n  return 'sync' in reg;\n}",
      details: [
        '后台同步必须在 Service Worker 支持的基础上检测',
        '注册 Service Worker 后，检查 registration.sync 是否存在',
        '使用 registration.sync.register("tag-name") 注册同步任务',
        'Service Worker 监听 sync 事件执行后台同步',
        'Periodic Background Sync 用于定期同步，支持度更低',
        '需要用户之前访问过页面才能触发后台同步'
      ]
    }
  }
}

// 浏览器市场份额数据（2024年全球数据）
export const browserMarketShare = {
  chrome: 65.8,
  safari: 18.7,
  firefox: 9.2,
  edge: 4.6,
  other: 1.7
}

// 浏览器兼容性详情
export const browserCompatibilityData: BrowserCompatibility[] = [
  {
    name: 'Chrome',
    icon: 'fa-chrome',
    supportRate: '94.5%',
    minVersion: '40+',
    marketShare: '65.8%',
    features: ['完整的PWA支持', 'Service Worker', '推送通知', '后台同步'],
    limitations: '无重大限制'
  },
  {
    name: 'Firefox',
    icon: 'fa-firefox',
    supportRate: '88.2%',
    minVersion: '44+',
    marketShare: '9.2%',
    features: ['Service Worker', '推送通知', '离线存储'],
    limitations: 'Manifest支持不完整，不支持后台同步'
  },
  {
    name: 'Safari',
    icon: 'fa-safari',
    supportRate: '82.1%',
    minVersion: '11.1+',
    marketShare: '18.7%',
    features: ['Service Worker', '离线存储', '媒体控制'],
    limitations: '推送通知限制较多，不支持后台同步'
  },
  {
    name: 'Edge',
    icon: 'fa-edge',
    supportRate: '93.8%',
    minVersion: '17+',
    marketShare: '4.6%',
    features: ['完整的PWA支持', 'Service Worker', '推送通知', '后台同步'],
    limitations: '无重大限制'
  }
]

// 计算用户覆盖率
export function calculateCoverage(globalSupport: number): number {
  return Math.round(globalSupport)
}

// 翻译功能名称
export function translateFeatureName(name: string): string {
  const translations: Record<string, string> = {
    'Service Worker': 'Service Worker',
    'HTTPS环境': 'HTTPS Environment',
    'Web App Manifest': 'Web App Manifest',
    '推送通知': 'Push Notifications',
    '离线存储': 'Offline Storage',
    '设备API': 'Device APIs',
    '媒体控制': 'Media Controls',
    '性能优化': 'Performance Features',
    '后台同步': 'Background Sync'
  }
  return translations[name] || name
}

// 获取英文建议
export function getEnglishRecommendation(result: string): string {
  if (result.includes('完全支持') || result.includes('Fully Support')) {
    return 'Excellent! Your browser fully supports PWA features. You can enjoy complete modern web application experiences including offline access, device interaction, and background sync.'
  } else if (result.includes('部分支持') || result.includes('Partial Support')) {
    return 'Your browser supports some PWA features but may be missing critical functionality. We recommend upgrading to the latest version of Chrome, Firefox, or Edge for better PWA support.'
  } else {
    return 'Your browser has limited PWA support. For the best modern web experience, we strongly recommend upgrading to a modern browser such as Chrome, Firefox, Edge, or Safari.'
  }
}
