<template>
  <Teleport to="body">
    <div
      v-if="uiStore.activeDialog === 'screenshot'"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <!-- Backdrop -->
      <div
        class="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
        @click="uiStore.closeDialog()"
      ></div>

      <!-- Dialog -->
      <div class="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-[dialogFadeIn_0.3s_ease-out]">
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-bold text-gray-800">截图预览</h3>
            <button
              @click="uiStore.closeDialog()"
              class="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <X class="w-6 h-6" />
            </button>
          </div>

          <div class="bg-gray-100 rounded-lg p-4 mb-4 overflow-auto max-h-[60vh] border-2 border-dashed border-gray-300">
            <img
              v-if="imageUrl"
              :src="imageUrl"
              class="max-w-full h-auto rounded shadow-lg animate-[imageSlideIn_0.4s_ease-out]"
              style="min-height: 100px;"
              alt="检测结果截图"
              @load="console.log('Image loaded successfully, size:', imageUrl.length)"
              @error="console.error('Image failed to load')"
            />
            <div v-else class="text-center text-gray-500 py-8">
              暂无截图数据
            </div>
          </div>

          <div class="flex flex-col sm:flex-row gap-3 justify-end">
            <button
              @click="handleCopy"
              class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
            >
              <Copy class="w-4 h-4 mr-2" />
              复制图片
            </button>
            <button
              @click="handleShare"
              class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center"
            >
              <Share2 class="w-4 h-4 mr-2" />
              分享
            </button>
            <button
              @click="handleDownload"
              class="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center justify-center"
            >
              <Download class="w-4 h-4 mr-2" />
              下载
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { X, Copy, Share2, Download } from 'lucide-vue-next'
import { useUIStore } from '@/stores/ui'
import { useScreenshot } from '@/composables/useScreenshot'
import { useShare } from '@/composables/useShare'

const uiStore = useUIStore()
const screenshot = useScreenshot()
const share = useShare()

const imageUrl = computed(() => {
  const url = uiStore.screenshotDataUrl
  console.log('ScreenshotDialog - imageUrl length:', url?.length || 0)
  console.log('ScreenshotDialog - imageUrl prefix:', url?.substring(0, 50) || 'empty')
  return url
})

async function handleCopy() {
  const success = await screenshot.copyToClipboard()
  if (success) {
    uiStore.showSuccess('图片已复制到剪贴板')
  } else {
    uiStore.showError('复制失败，请重试')
  }
}

async function handleShare() {
  if (!imageUrl.value) return

  const success = await share.shareImage(imageUrl.value)
  if (success) {
    uiStore.showSuccess('分享成功')
  } else {
    uiStore.showError('分享失败，请重试')
  }
}

function handleDownload() {
  screenshot.downloadScreenshot()
  uiStore.showSuccess('图片下载成功')
}
</script>
