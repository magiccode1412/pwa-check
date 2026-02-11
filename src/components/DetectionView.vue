<template>
  <section class="max-w-3xl mx-auto">
    <!-- 检测卡片 -->
    <div class="bg-white rounded-2xl shadow-xl p-6 md:p-10 mb-10 transform transition-all duration-500">
      <div class="text-center mb-8">
        <h2 class="text-[clamp(1.25rem,2.5vw,1.75rem)] font-bold text-gray-800 mb-2">
          正在检测浏览器PWA支持情况
        </h2>
        <p class="text-gray-600">请稍候，我们正在检查您的浏览器功能...</p>
      </div>

      <!-- 检测动画 -->
      <div class="flex flex-col items-center">
        <ProgressRing :progress="detectionStore.progress" :is-complete="detectionStore.isComplete" />

        <!-- 检测步骤文本 -->
        <div class="text-center space-y-2 w-full max-w-lg">
          <div 
            v-for="step in detectionStore.steps" 
            :key="step.id"
            class="flex items-center justify-between"
          >
            <span :class="{ 'text-primary font-medium': step.status === 'checking' }">
              {{ step.name }}
            </span>
            <component 
              :is="getStepIcon(step.status)"
              class="w-4 h-4"
              :class="getStepIconClass(step.status)"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Circle, CheckCircle, Loader2 } from 'lucide-vue-next'
import { useDetectionStore } from '@/stores/detection'
import ProgressRing from './ProgressRing.vue'
import type { DetectionStep } from '@/types'
import type { Component } from 'vue'

const detectionStore = useDetectionStore()

function getStepIcon(status: DetectionStep['status']): Component {
  switch (status) {
    case 'completed':
      return CheckCircle
    case 'checking':
      return Loader2
    default:
      return Circle
  }
}

function getStepIconClass(status: DetectionStep['status']): string {
  switch (status) {
    case 'completed':
      return 'text-secondary'
    case 'checking':
      return 'text-primary animate-spin'
    default:
      return 'text-gray-300'
  }
}
</script>
