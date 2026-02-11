<template>
  <div class="relative w-32 h-32 mb-6">
    <!-- 进度环 -->
    <svg class="w-full h-full" viewBox="0 0 100 100">
      <!-- 背景环 -->
      <circle 
        cx="50" 
        cy="50" 
        r="45" 
        fill="none" 
        stroke="#E5E7EB" 
        stroke-width="8" 
      />
      <!-- 进度环 -->
      <circle 
        class="progress-ring-circle" 
        cx="50" 
        cy="50" 
        r="45" 
        fill="none"
        stroke="#3B82F6" 
        stroke-width="8" 
        :stroke-dasharray="circumference"
        :stroke-dashoffset="strokeDashoffset"
      />
    </svg>

    <!-- 加载图标 -->
    <div 
      v-if="!isComplete" 
      class="absolute inset-0 flex items-center justify-center"
    >
      <RefreshCw class="w-8 h-8 text-primary animate-spin" />
    </div>

    <!-- 完成图标 -->
    <div 
      v-else 
      class="absolute inset-0 flex items-center justify-center"
    >
      <CheckCircle class="w-10 h-10 text-secondary" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RefreshCw, CheckCircle } from 'lucide-vue-next'

const props = defineProps<{
  progress: number
  isComplete: boolean
}>()

const radius = 45
const circumference = 2 * Math.PI * radius

const strokeDashoffset = computed(() => {
  return circumference - (props.progress / 100) * circumference
})
</script>
