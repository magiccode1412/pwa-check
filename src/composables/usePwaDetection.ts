import { ref } from 'vue'
import type { DetectionResult, FeatureResult } from '@/types'

export function usePwaDetection() {
  const isDetecting = ref(false)

  async function detectServiceWorker(): Promise<FeatureResult> {
    const supported = 'serviceWorker' in navigator
    return {
      name: 'Service Worker',
      supported,
      icon: 'fa-refresh',
      details: supported ? '支持离线缓存和后台同步' : '不支持 Service Worker'
    }
  }

  async function detectHttps(): Promise<FeatureResult> {
    const isHttps = window.location.protocol === 'https:' || window.location.hostname === 'localhost'
    return {
      name: 'HTTPS环境',
      supported: isHttps,
      icon: 'fa-lock',
      details: isHttps ? '安全连接已启用' : '当前使用 HTTP 连接'
    }
  }

  async function detectManifest(): Promise<FeatureResult> {
    const manifests = document.querySelectorAll('link[rel="manifest"]')
    const supported = manifests.length > 0
    return {
      name: 'Web App Manifest',
      supported,
      icon: 'fa-mobile',
      details: supported ? 'Manifest 文件已配置' : '未找到 Manifest 文件'
    }
  }

  async function detectPushNotification(): Promise<FeatureResult> {
    const pushSupported = 'PushManager' in window
    const notificationSupported = 'Notification' in window
    const supported = pushSupported && notificationSupported
    return {
      name: '推送通知',
      supported,
      icon: 'fa-bell',
      details: supported ? '支持推送通知功能' : '不支持推送通知'
    }
  }

  async function detectOfflineStorage(): Promise<FeatureResult> {
    const indexedDBSupported = 'indexedDB' in window
    const cacheSupported = 'caches' in window
    const supported = indexedDBSupported && cacheSupported
    return {
      name: '离线存储',
      supported,
      icon: 'fa-database',
      details: supported ? '支持 IndexedDB 和 Cache API' : '离线存储功能受限'
    }
  }

  async function detectDeviceAPI(): Promise<FeatureResult> {
    const shareSupported = 'share' in navigator
    const bluetoothSupported = 'bluetooth' in navigator
    const supported = shareSupported || bluetoothSupported
    return {
      name: '设备API',
      supported,
      icon: 'fa-bluetooth',
      details: supported ? '支持设备交互 API' : '设备 API 支持有限'
    }
  }

  async function detectMediaControl(): Promise<FeatureResult> {
    const mediaSessionSupported = 'mediaSession' in navigator
    const wakeLockSupported = 'wakeLock' in navigator
    const supported = mediaSessionSupported || wakeLockSupported
    return {
      name: '媒体控制',
      supported,
      icon: 'fa-play-circle',
      details: supported ? '支持媒体控制和屏幕保持唤醒' : '媒体控制功能受限'
    }
  }

  async function detectPerformance(): Promise<FeatureResult> {
    const workerSupported = 'Worker' in window
    const wasmSupported = typeof WebAssembly === 'object'
    const supported = workerSupported && wasmSupported
    return {
      name: '性能优化',
      supported,
      icon: 'fa-tachometer',
      details: supported ? '支持 Web Workers 和 WebAssembly' : '性能优化功能受限'
    }
  }

  async function runFullDetection(
    onStepComplete?: (step: number) => void
  ): Promise<DetectionResult> {
    isDetecting.value = true

    const steps = [
      detectServiceWorker,
      detectHttps,
      detectManifest,
      detectPushNotification,
      detectOfflineStorage,
      detectDeviceAPI,
      detectMediaControl,
      detectPerformance
    ]

    const results: Partial<DetectionResult> = {}

    for (let i = 0; i < steps.length; i++) {
      const stepName = ['serviceWorker', 'https', 'manifest', 'pushNotification', 'offlineStorage', 'deviceAPI', 'mediaControl', 'performance'][i] as keyof DetectionResult
      results[stepName] = await steps[i]()
      onStepComplete?.(i + 1)
      // Small delay for visual feedback
      await new Promise(resolve => setTimeout(resolve, 300))
    }

    isDetecting.value = false
    return results as DetectionResult
  }

  return {
    isDetecting,
    detectServiceWorker,
    detectHttps,
    detectManifest,
    detectPushNotification,
    detectOfflineStorage,
    detectDeviceAPI,
    detectMediaControl,
    detectPerformance,
    runFullDetection
  }
}
