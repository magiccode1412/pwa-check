<template>
  <div class="font-inter bg-gray-50 text-dark min-h-screen flex flex-col">
    <Header />

    <main class="flex-grow container mx-auto px-4 py-8 md:py-16">
      <DetectionView v-if="!showResults" />
      <ResultsView v-else />
    </main>

    <Footer />

    <!-- Dialogs -->
    <ScreenshotDialog />
    <CompatibilityDialog />
    <PrivacyDialog />
    <DataSettingsDialog />

    <!-- Notifications -->
    <div class="fixed top-4 right-4 z-50 space-y-2">
      <TransitionGroup name="notification">
        <div
          v-for="notification in uiStore.notifications"
          :key="notification.id"
          class="px-4 py-3 rounded-lg shadow-lg flex items-center min-w-[300px]"
          :class="{
            'bg-green-500 text-white': notification.type === 'success',
            'bg-red-500 text-white': notification.type === 'error',
            'bg-blue-500 text-white': notification.type === 'info'
          }"
        >
          <CheckCircle v-if="notification.type === 'success'" class="w-5 h-5 mr-2" />
          <XCircle v-else-if="notification.type === 'error'" class="w-5 h-5 mr-2" />
          <Info v-else class="w-5 h-5 mr-2" />
          <span>{{ notification.message }}</span>
          <button 
            @click="uiStore.removeNotification(notification.id)"
            class="ml-auto hover:opacity-80"
          >
            <X class="w-4 h-4" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { CheckCircle, XCircle, Info, X } from 'lucide-vue-next'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import DetectionView from './components/DetectionView.vue'
import ResultsView from './components/ResultsView.vue'
import ScreenshotDialog from './components/dialogs/ScreenshotDialog.vue'
import CompatibilityDialog from './components/dialogs/CompatibilityDialog.vue'
import PrivacyDialog from './components/dialogs/PrivacyDialog.vue'
import DataSettingsDialog from './components/dialogs/DataSettingsDialog.vue'
import { useDetectionStore } from './stores/detection'
import { useSettingsStore } from './stores/settings'
import { useUIStore } from './stores/ui'
import { usePwaDetection } from './composables/usePwaDetection'
import { useDeviceInfo } from './composables/useDeviceInfo'

const detectionStore = useDetectionStore()
const settingsStore = useSettingsStore()
const uiStore = useUIStore()
const pwaDetection = usePwaDetection()
const deviceInfo = useDeviceInfo()

const showResults = ref(false)

onMounted(async () => {
  // Increment visit count
  settingsStore.incrementVisit()

  // Check for cached result
  if (settingsStore.settings.cacheEnabled) {
    const cached = detectionStore.getCachedResult()
    if (cached) {
      detectionStore.setDetectionResult(cached.result)
      detectionStore.setBrowserInfo(cached.browserInfo)
      showResults.value = true
      return
    }
  }

  // Start detection
  detectionStore.isDetecting = true

  // Detect browser info
  const browser = deviceInfo.detectBrowser()
  detectionStore.setBrowserInfo(browser)

  // Run PWA detection
  const result = await pwaDetection.runFullDetection((step) => {
    detectionStore.setStepStatus(step, 'completed')
    detectionStore.updateProgress((step / 9) * 100)
    if (step < 9) {
      detectionStore.setStepStatus(step + 1, 'checking')
    }
  })

  // Mark all steps complete
  detectionStore.steps.forEach(step => {
    step.status = 'completed'
  })
  detectionStore.updateProgress(100)
  detectionStore.setDetectionResult(result)

  // Save to cache
  if (settingsStore.settings.cacheEnabled) {
    detectionStore.saveToCache(result, browser)
  }

  // Show results after a short delay
  setTimeout(() => {
    showResults.value = true
    detectionStore.isDetecting = false
  }, 500)
})
</script>

<style>
/* Notification transitions */
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
