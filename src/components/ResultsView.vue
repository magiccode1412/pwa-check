<template>
  <section ref="resultsRef" class="max-w-3xl mx-auto">
    <!-- 骨架屏 -->
    <div v-if="showSkeleton" class="bg-white rounded-2xl shadow-xl overflow-hidden">
      <div class="p-6 md:p-8">
        <div class="skeleton skeleton-title"></div>
        <div class="flex items-center mt-4">
          <div class="skeleton skeleton-text" style="width: 150px; height: 40px;"></div>
        </div>
      </div>
      <div class="bg-gray-50 px-6 md:px-8 py-4 border-t border-gray-100">
        <div class="skeleton skeleton-title" style="width: 30%;"></div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
          <div class="skeleton skeleton-text"></div>
          <div class="skeleton skeleton-text"></div>
          <div class="skeleton skeleton-text"></div>
          <div class="skeleton skeleton-text"></div>
        </div>
      </div>
      <div class="p-6 md:p-8 border-t border-gray-100">
        <div class="skeleton skeleton-title" style="width: 40%;"></div>
        <div class="space-y-4 mt-4">
          <div class="skeleton skeleton-card"></div>
          <div class="skeleton skeleton-card"></div>
          <div class="skeleton skeleton-card"></div>
        </div>
      </div>
    </div>

    <!-- 实际结果 -->
    <div 
      v-else-if="detectionStore.detectionResult"
      class="bg-white rounded-2xl shadow-xl overflow-hidden progressive-show"
    >
      <!-- 结果头部 -->
      <div class="p-6 md:p-8">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h2 class="text-2xl font-bold text-gray-800 mb-2">检测结果</h2>
            <p class="text-gray-600">{{ resultSummary }}</p>
          </div>
          <div class="mt-4 md:mt-0">
            <div 
              class="inline-flex items-center px-4 py-2 rounded-full text-lg font-bold"
              :class="supportRateClass"
            >
              {{ detectionStore.supportRate }}%
            </div>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="flex flex-wrap gap-3">
          <button 
            @click="handleCopyReport"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center"
          >
            <Copy class="w-4 h-4 mr-2" />
            复制报告
          </button>
          <button 
            v-if="share.shareSupported"
            @click="handleShare"
            class="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center"
          >
            <Share2 class="w-4 h-4 mr-2" />
            分享
          </button>
        </div>
      </div>

      <!-- 设备信息 -->
      <div class="bg-gray-50 px-6 md:px-8 py-4 border-t border-gray-100">
        <h3 class="text-lg font-semibold text-gray-800 mb-3">设备信息</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex items-center">
            <Globe class="w-5 h-5 text-gray-400 mr-2" />
            <span class="text-gray-600">浏览器:</span>
            <span class="ml-2 font-medium">{{ detectionStore.browserInfo?.name }} {{ detectionStore.browserInfo?.version }}</span>
          </div>
          <div class="flex items-center">
            <Cpu class="w-5 h-5 text-gray-400 mr-2" />
            <span class="text-gray-600">引擎:</span>
            <span class="ml-2 font-medium">{{ detectionStore.browserInfo?.engine }}</span>
          </div>
          <div class="flex items-center">
            <Smartphone v-if="detectionStore.browserInfo?.isMobile" class="w-5 h-5 text-gray-400 mr-2" />
            <Monitor v-else class="w-5 h-5 text-gray-400 mr-2" />
            <span class="text-gray-600">设备:</span>
            <span class="ml-2 font-medium">{{ detectionStore.browserInfo?.isMobile ? '移动设备' : '桌面设备' }}</span>
          </div>
          <div class="flex items-center">
            <Lock v-if="detectionStore.browserInfo?.isHttps" class="w-5 h-5 text-green-500 mr-2" />
            <Unlock v-else class="w-5 h-5 text-red-500 mr-2" />
            <span class="text-gray-600">连接:</span>
            <span class="ml-2 font-medium">{{ detectionStore.browserInfo?.isHttps ? 'HTTPS' : 'HTTP' }}</span>
          </div>
        </div>
      </div>

      <!-- 功能列表 -->
      <div class="p-6 md:p-8 border-t border-gray-100">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">功能检测详情</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div 
            v-for="feature in features" 
            :key="feature.name"
            class="p-4 rounded-lg border transition-all duration-300 hover:shadow-md cursor-pointer card-hover"
            :class="feature.supported ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'"
            @click="showCompatibilityDetail(feature.name)"
          >
            <div class="flex items-center">
              <div 
                class="w-10 h-10 rounded-full flex items-center justify-center mr-3 flex-shrink-0"
                :class="feature.supported ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'"
              >
                <Check v-if="feature.supported" class="w-5 h-5" />
                <X v-else class="w-5 h-5" />
              </div>
              <div class="flex-1">
                <h4 class="font-semibold text-gray-800">{{ feature.name }}</h4>
                <p class="text-sm text-gray-600 mt-1">{{ feature.details }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 使用建议 -->
      <div class="p-6 md:p-8 border-t border-gray-100 bg-gray-50">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">使用建议</h3>
        <div class="space-y-3">
          <div 
            v-for="(recommendation, index) in recommendations" 
            :key="index"
            class="p-4 rounded-lg"
            :class="{
              'bg-green-100 text-green-800': recommendation.type === 'success',
              'bg-yellow-100 text-yellow-800': recommendation.type === 'warning',
              'bg-red-100 text-red-800': recommendation.type === 'error'
            }"
          >
            <div class="flex items-start">
              <CheckCircle v-if="recommendation.type === 'success'" class="w-5 h-5 mr-2 mt-0.5" />
              <AlertTriangle v-else-if="recommendation.type === 'warning'" class="w-5 h-5 mr-2 mt-0.5" />
              <XCircle v-else class="w-5 h-5 mr-2 mt-0.5" />
              <div>
                <h4 class="font-semibold">{{ recommendation.title }}</h4>
                <p class="text-sm mt-1 opacity-90">{{ recommendation.content }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  Copy, Share2, Globe, Cpu, Smartphone, Monitor,
  Lock, Unlock, Check, X, CheckCircle, AlertTriangle, XCircle
} from 'lucide-vue-next'
import { useDetectionStore } from '@/stores/detection'
import { useUIStore } from '@/stores/ui'
import { useShare } from '@/composables/useShare'
import { usePdfExport } from '@/composables/usePdfExport'
import type { FeatureResult, Recommendation } from '@/types'

const detectionStore = useDetectionStore()
const uiStore = useUIStore()
const share = useShare()
const pdfExport = usePdfExport()

const resultsRef = ref<HTMLElement>()
const showSkeleton = ref(true)

// Show skeleton for a short time then reveal results
onMounted(() => {
  setTimeout(() => {
    showSkeleton.value = false
  }, 800)
})

const features = computed<FeatureResult[]>(() => {
  if (!detectionStore.detectionResult) return []
  return Object.values(detectionStore.detectionResult)
})

const resultSummary = computed(() => {
  const count = detectionStore.supportedCount
  const total = detectionStore.totalCount
  if (count === total) {
    return '恭喜！您的浏览器完全支持 PWA 功能'
  } else if (count >= total * 0.6) {
    return '您的浏览器支持大部分 PWA 功能'
  } else {
    return '您的浏览器 PWA 支持有限'
  }
})

const supportRateClass = computed(() => {
  const rate = detectionStore.supportRate
  if (rate >= 80) return 'bg-green-100 text-green-700'
  if (rate >= 60) return 'bg-yellow-100 text-yellow-700'
  return 'bg-red-100 text-red-700'
})

const recommendations = computed<Recommendation[]>(() => {
  const recs: Recommendation[] = []
  const rate = detectionStore.supportRate

  if (rate === 100) {
    recs.push({
      type: 'success',
      title: '完全支持',
      content: '您的浏览器完全支持 PWA 功能，可以享受完整的现代 Web 应用体验。'
    })
  } else if (rate >= 60) {
    recs.push({
      type: 'warning',
      title: '部分支持',
      content: '您的浏览器支持大部分 PWA 功能，但可能缺少某些高级特性。建议升级到最新版本以获得更好的体验。'
    })
  } else {
    recs.push({
      type: 'error',
      title: '支持有限',
      content: '您的浏览器 PWA 支持有限。为了获得最佳体验，建议使用 Chrome、Firefox、Edge 或 Safari 的最新版本。'
    })
  }

  if (!detectionStore.detectionResult?.https.supported) {
    recs.push({
      type: 'warning',
      title: '安全连接',
      content: '当前使用 HTTP 连接。PWA 的许多功能需要 HTTPS 环境才能正常工作。'
    })
  }

  return recs
})

function showCompatibilityDetail(featureName: string) {
  uiStore.openDialog('compatibility')
  // Store selected feature for dialog
  sessionStorage.setItem('selectedFeature', featureName)
}

async function handleCopyReport() {
  if (!detectionStore.detectionResult || !detectionStore.browserInfo) return

  const report = pdfExport.generateReport(
    detectionStore.detectionResult,
    detectionStore.browserInfo,
    detectionStore.supportRate
  )

  const success = await share.copyText(report)
  if (success) {
    uiStore.showSuccess('报告已复制到剪贴板')
  } else {
    uiStore.showError('复制失败，请重试')
  }
}

async function handleShare() {
  const success = await share.shareText(
    'PWA 检测结果',
    `我的浏览器 PWA 支持率为 ${detectionStore.supportRate}%`,
    window.location.href
  )

  if (!success) {
    uiStore.showError('分享失败，请重试')
  }
}
</script>
