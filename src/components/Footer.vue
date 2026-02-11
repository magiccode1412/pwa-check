<template>
  <footer class="bg-white border-t border-gray-200 mt-auto">
    <div class="container mx-auto px-4 py-6">
      <div class="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
        <div class="mb-4 md:mb-0">
          <p>本工具用于检测浏览器对PWA关键能力的支持情况</p>
        </div>
        <div class="flex items-center space-x-4">
          <span>访问次数: <span class="font-semibold text-primary">{{ settingsStore.visitCount || '--' }}</span></span>
          <button 
            @click="uiStore.openDialog('dataSettings')"
            class="text-primary hover:underline focus:outline-none"
            title="数据设置"
          >
            <Settings class="w-4 h-4 inline mr-1" />
            设置
          </button>
          <button 
            @click="uiStore.openDialog('privacy')"
            class="text-primary hover:underline focus:outline-none"
            title="查看隐私政策"
          >
            <Shield class="w-4 h-4 inline mr-1" />
            隐私
          </button>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { Settings, Shield } from 'lucide-vue-next'
import { useSettingsStore } from '@/stores/settings'
import { useUIStore } from '@/stores/ui'

const settingsStore = useSettingsStore()
const uiStore = useUIStore()
</script>
