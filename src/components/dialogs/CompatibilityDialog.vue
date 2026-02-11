<template>
  <Teleport to="body">
    <div 
      v-if="uiStore.activeDialog === 'compatibility'"
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
            <h3 class="text-xl font-bold text-gray-800">兼容性详情</h3>
            <button 
              @click="uiStore.closeDialog()"
              class="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <X class="w-6 h-6" />
            </button>
          </div>

          <div class="max-h-[70vh] overflow-y-auto">
            <!-- Loading State -->
            <div v-if="isLoading" class="flex flex-col items-center justify-center py-12">
              <Loader2 class="w-8 h-8 text-blue-600 animate-spin mb-4" />
              <p class="text-gray-600">正在获取实时兼容性数据...</p>
            </div>

            <div v-else-if="featureData" class="space-y-6">
              <!-- Feature Header -->
              <div>
                <h4 class="text-lg font-semibold text-gray-800">{{ selectedFeature }}</h4>
                <p class="text-gray-600 mt-1">{{ featureData.description }}</p>
              </div>

              <!-- Data Source Badge -->
              <div class="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 p-2 rounded">
                <Database class="w-3 h-3" />
                <span>数据来源: {{ realtimeInfo?.source || '本地数据' }}</span>
                <template v-if="realtimeInfo">
                  <span class="mx-1">|</span>
                  <Globe class="w-3 h-3" />
                  <span>更新于: {{ realtimeInfo.lastUpdated }}</span>
                </template>
              </div>

              <!-- Global Support -->
              <div class="bg-blue-50 p-4 rounded-lg">
                <div class="flex items-center justify-between">
                  <span class="text-blue-800 font-medium">全球支持率</span>
                  <div class="flex items-center gap-2">
                    <span class="text-2xl font-bold text-blue-600">{{ featureData.globalSupport }}%</span>
                    <span v-if="realtimeInfo" class="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">实时</span>
                    <span v-else class="text-xs text-gray-600 bg-gray-200 px-2 py-1 rounded">缓存</span>
                  </div>
                </div>
              </div>

              <!-- Browser Versions -->
              <div>
                <h5 class="font-semibold text-gray-800 mb-3">最低版本要求</h5>
                <div class="grid grid-cols-2 gap-3">
                  <div 
                    v-for="(version, browser) in featureData.minVersions" 
                    :key="browser"
                    class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <span class="capitalize text-gray-700">{{ browser }}</span>
                    <span class="font-medium text-gray-900">{{ version }}</span>
                  </div>
                </div>
              </div>

              <!-- Features -->
              <div>
                <h5 class="font-semibold text-gray-800 mb-3">功能特性</h5>
                <ul class="space-y-2">
                  <li 
                    v-for="feature in featureData.features" 
                    :key="feature"
                    class="flex items-center text-gray-700"
                  >
                    <Check class="w-4 h-4 text-green-500 mr-2" />
                    {{ feature }}
                  </li>
                </ul>
              </div>

              <!-- Limitations -->
              <div class="bg-yellow-50 p-4 rounded-lg">
                <h5 class="font-semibold text-yellow-800 mb-2">限制说明</h5>
                <p class="text-yellow-700">{{ featureData.limitations }}</p>
              </div>

              <!-- Detection Method -->
              <div class="bg-purple-50 p-4 rounded-lg">
                <h5 class="font-semibold text-purple-800 mb-3 flex items-center">
                  <Code class="w-4 h-4 mr-2" />
                  检测方式
                </h5>
                
                <!-- Detection Summary -->
                <p class="text-purple-700 mb-4">{{ featureData.detectionMethod.summary }}</p>
                
                <!-- APIs Used -->
                <div class="mb-4">
                  <h6 class="text-sm font-medium text-purple-800 mb-2">使用的 API：</h6>
                  <div class="flex flex-wrap gap-2">
                    <span 
                      v-for="api in featureData.detectionMethod.apis" 
                      :key="api"
                      class="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded font-mono"
                    >
                      {{ api }}
                    </span>
                  </div>
                </div>
                
                <!-- Code Example -->
                <div class="mb-4">
                  <h6 class="text-sm font-medium text-purple-800 mb-2">代码示例：</h6>
                  <pre class="bg-gray-900 text-green-400 p-3 rounded-lg text-xs overflow-x-auto font-mono"><code>{{ featureData.detectionMethod.codeExample }}</code></pre>
                </div>
                
                <!-- Detection Details -->
                <div>
                  <h6 class="text-sm font-medium text-purple-800 mb-2">详细说明：</h6>
                  <ul class="space-y-2">
                    <li 
                      v-for="(detail, index) in featureData.detectionMethod.details" 
                      :key="index"
                      class="flex items-start text-sm text-purple-700"
                    >
                      <Info class="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{{ detail }}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div v-else class="text-center py-8 text-gray-500">
              未找到该功能的兼容性信息
            </div>
          </div>

          <div class="mt-6 flex justify-end">
            <button 
              @click="uiStore.closeDialog()"
              class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              关闭
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { X, Check, Code, Info, Loader2, Database, Globe } from 'lucide-vue-next'
import { useUIStore } from '@/stores/ui'
import { compatibilityDatabase } from '@/data/compatibility'
import type { FeatureCompatibility } from '@/data/compatibility'
import { useCompatData } from '@/composables/useCompatData'

const uiStore = useUIStore()
const { isLoading, fetchFeatureData, getMergedData } = useCompatData()

const selectedFeature = ref('')
const featureData = ref<FeatureCompatibility | null>(null)
const realtimeInfo = ref<{ lastUpdated: string; source: string } | null>(null)

// Watch for dialog open to load feature data
watch(() => uiStore.activeDialog, async (dialog) => {
  if (dialog === 'compatibility') {
    const feature = sessionStorage.getItem('selectedFeature')
    if (feature) {
      selectedFeature.value = feature
      const staticData = compatibilityDatabase[feature]
      if (staticData) {
        // 获取实时数据并合并
        const merged = await getMergedData(staticData, feature)
        featureData.value = merged
        // 获取实时数据信息
        const rtData = await fetchFeatureData(feature)
        if (rtData) {
          realtimeInfo.value = {
            lastUpdated: rtData.lastUpdated,
            source: rtData.source
          }
        }
      } else {
        featureData.value = null
      }
    }
  }
})
</script>
