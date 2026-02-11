<template>
  <Teleport to="body">
    <div 
      v-if="uiStore.activeDialog === 'dataSettings'"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <!-- Backdrop -->
      <div 
        class="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
        @click="uiStore.closeDialog()"
      ></div>

      <!-- Dialog -->
      <div class="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden animate-[dialogFadeIn_0.3s_ease-out]">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-xl font-bold text-gray-800">数据设置</h3>
            <button 
              @click="uiStore.closeDialog()"
              class="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <X class="w-6 h-6" />
            </button>
          </div>

          <div class="space-y-6">
            <!-- 缓存设置 -->
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 class="font-medium text-gray-800">启用结果缓存</h4>
                <p class="text-sm text-gray-600">缓存检测结果以减少重复检测</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  v-model="settingsStore.settings.cacheEnabled"
                  class="sr-only peer"
                >
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <!-- 统计设置 -->
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 class="font-medium text-gray-800">允许访问统计</h4>
                <p class="text-sm text-gray-600">发送匿名化访问数据帮助改进工具</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  v-model="settingsStore.settings.analyticsEnabled"
                  class="sr-only peer"
                >
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <!-- 错误报告设置 -->
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 class="font-medium text-gray-800">启用错误报告</h4>
                <p class="text-sm text-gray-600">发送错误信息帮助修复问题</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  v-model="settingsStore.settings.errorReportingEnabled"
                  class="sr-only peer"
                >
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <!-- 数据管理操作 -->
            <div class="border-t border-gray-200 pt-4">
              <h4 class="font-medium text-gray-800 mb-3">数据管理</h4>
              <div class="space-y-2">
                <button 
                  @click="clearCache"
                  class="w-full px-4 py-2 text-left text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center"
                >
                  <Trash2 class="w-4 h-4 mr-2" />
                  仅清除检测结果缓存
                </button>
                <button 
                  @click="exportData"
                  class="w-full px-4 py-2 text-left text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors flex items-center"
                >
                  <Download class="w-4 h-4 mr-2" />
                  导出我的数据
                </button>
                <button 
                  @click="deleteAllData"
                  class="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center"
                >
                  <AlertTriangle class="w-4 h-4 mr-2" />
                  删除所有数据
                </button>
              </div>
            </div>
          </div>

          <div class="mt-6 flex justify-end space-x-3">
            <button 
              @click="uiStore.closeDialog()"
              class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              保存设置
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { X, Trash2, Download, AlertTriangle } from 'lucide-vue-next'
import { useUIStore } from '@/stores/ui'
import { useSettingsStore } from '@/stores/settings'
import { useDetectionStore } from '@/stores/detection'

const uiStore = useUIStore()
const settingsStore = useSettingsStore()
const detectionStore = useDetectionStore()

function clearCache() {
  detectionStore.clearCache()
  uiStore.showSuccess('缓存已清除')
}

function exportData() {
  const data = settingsStore.exportData()
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `pwa-detector-data-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
  uiStore.showSuccess('数据导出成功')
}

function deleteAllData() {
  if (confirm('确定要删除所有数据吗？此操作不可恢复。')) {
    settingsStore.clearAllData()
    detectionStore.clearCache()
    uiStore.showSuccess('所有数据已删除')
    uiStore.closeDialog()
  }
}
</script>
