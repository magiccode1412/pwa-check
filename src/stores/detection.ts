import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { DetectionResult, BrowserInfo, DetectionStep, CachedResult } from '@/types'

const CACHE_KEY = 'pwa_detection_cache'
const CACHE_DURATION = 5 * 60 * 1000 // 5分钟

export const useDetectionStore = defineStore('detection', () => {
  // State
  const isDetecting = ref(false)
  const progress = ref(0)
  const currentStep = ref(0)
  const detectionResult = ref<DetectionResult | null>(null)
  const browserInfo = ref<BrowserInfo | null>(null)
  const error = ref<string | null>(null)

  const steps = ref<DetectionStep[]>([
    { id: 1, name: '检查Service Worker支持', status: 'pending' },
    { id: 2, name: '验证HTTPS环境', status: 'pending' },
    { id: 3, name: '检测Manifest支持', status: 'pending' },
    { id: 4, name: '检查推送通知功能', status: 'pending' },
    { id: 5, name: '检测离线存储能力', status: 'pending' },
    { id: 6, name: '检测设备API支持', status: 'pending' },
    { id: 7, name: '检测媒体控制能力', status: 'pending' },
    { id: 8, name: '检测性能优化特性', status: 'pending' },
    { id: 9, name: '汇总检测结果', status: 'pending' }
  ])

  // Getters
  const isComplete = computed(() => progress.value >= 100)
  const supportedCount = computed(() => {
    if (!detectionResult.value) return 0
    return Object.values(detectionResult.value).filter(r => r.supported).length
  })
  const totalCount = computed(() => 8)
  const supportRate = computed(() => {
    return Math.round((supportedCount.value / totalCount.value) * 100)
  })

  // Actions
  function setStepStatus(stepId: number, status: DetectionStep['status']) {
    const step = steps.value.find(s => s.id === stepId)
    if (step) {
      step.status = status
    }
  }

  function updateProgress(value: number) {
    progress.value = Math.min(100, Math.max(0, value))
  }

  function setDetectionResult(result: DetectionResult) {
    detectionResult.value = result
  }

  function setBrowserInfo(info: BrowserInfo) {
    browserInfo.value = info
  }

  function setError(err: string) {
    error.value = err
  }

  function reset() {
    isDetecting.value = false
    progress.value = 0
    currentStep.value = 0
    detectionResult.value = null
    error.value = null
    steps.value.forEach(step => step.status = 'pending')
  }

  // Cache management
  function getCachedResult(): CachedResult | null {
    try {
      const cached = localStorage.getItem(CACHE_KEY)
      if (!cached) return null

      const data: CachedResult = JSON.parse(cached)
      const now = Date.now()

      if (now - data.timestamp > CACHE_DURATION) {
        localStorage.removeItem(CACHE_KEY)
        return null
      }

      return data
    } catch {
      return null
    }
  }

  function saveToCache(result: DetectionResult, browser: BrowserInfo) {
    try {
      const data: CachedResult = {
        timestamp: Date.now(),
        result,
        browserInfo: browser
      }
      localStorage.setItem(CACHE_KEY, JSON.stringify(data))
    } catch (e) {
      console.error('Failed to save cache:', e)
    }
  }

  function clearCache() {
    try {
      localStorage.removeItem(CACHE_KEY)
    } catch (e) {
      console.error('Failed to clear cache:', e)
    }
  }

  return {
    isDetecting,
    progress,
    currentStep,
    steps,
    detectionResult,
    browserInfo,
    error,
    isComplete,
    supportedCount,
    totalCount,
    supportRate,
    setStepStatus,
    updateProgress,
    setDetectionResult,
    setBrowserInfo,
    setError,
    reset,
    getCachedResult,
    saveToCache,
    clearCache
  }
})
