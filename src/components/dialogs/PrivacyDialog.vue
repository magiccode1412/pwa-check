<template>
  <Teleport to="body">
    <div 
      v-if="uiStore.activeDialog === 'privacy'"
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
            <h3 class="text-xl font-bold text-gray-800">隐私政策</h3>
            <button 
              @click="uiStore.closeDialog()"
              class="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <X class="w-6 h-6" />
            </button>
          </div>

          <div class="prose max-h-[60vh] overflow-y-auto">
            <h4>数据收集与使用</h4>
            <p>本工具仅在用户同意的情况下收集以下数据：</p>
            <ul>
              <li><strong>访问统计：</strong>用于了解工具使用情况的匿名化访问计数</li>
              <li><strong>错误报告：</strong>帮助改进工具稳定性和功能的错误信息（不包含个人身份信息）</li>
              <li><strong>检测结果缓存：</strong>存储在本地浏览器中，用于提升用户体验（5分钟有效期）</li>
            </ul>

            <h4>数据存储</h4>
            <p>所有个人相关数据均存储在您的本地浏览器中，包括：</p>
            <ul>
              <li>检测结果缓存（LocalStorage）</li>
              <li>用户偏好设置（LocalStorage）</li>
            </ul>

            <h4>第三方服务</h4>
            <p>本工具不使用任何第三方跟踪服务。所有分析数据均为匿名化处理。</p>

            <h4>用户权利</h4>
            <p>您有权：</p>
            <ul>
              <li>随时清除所有本地存储的数据</li>
              <li>禁用统计和错误报告功能</li>
              <li>导出您的个人数据</li>
            </ul>

            <h4>联系我们</h4>
            <p>如有隐私相关问题，请通过以下方式联系我们。</p>
          </div>

          <div class="mt-6 flex justify-end">
            <button 
              @click="uiStore.closeDialog()"
              class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              我已了解
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { X } from 'lucide-vue-next'
import { useUIStore } from '@/stores/ui'

const uiStore = useUIStore()
</script>
