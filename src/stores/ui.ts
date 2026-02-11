import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { DialogType, Notification } from '@/types'

export const useUIStore = defineStore('ui', () => {
  // State
  const activeDialog = ref<DialogType>(null)
  const notifications = ref<Notification[]>([])
  const isLoading = ref(false)
  
  // Screenshot state (shared across components)
  const screenshotDataUrl = ref<string>('')
  const isCapturing = ref(false)

  // Dialog actions
  function openDialog(type: DialogType) {
    activeDialog.value = type
  }

  function closeDialog() {
    activeDialog.value = null
  }

  // Notification actions
  function showNotification(type: Notification['type'], message: string, duration = 3000) {
    const id = Date.now().toString()
    const notification: Notification = {
      id,
      type,
      message
    }

    notifications.value.push(notification)

    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, duration)
    }

    return id
  }

  function removeNotification(id: string) {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  function showSuccess(message: string, duration?: number) {
    return showNotification('success', message, duration)
  }

  function showError(message: string, duration?: number) {
    return showNotification('error', message, duration)
  }

  function showInfo(message: string, duration?: number) {
    return showNotification('info', message, duration)
  }

  // Loading state
  function setLoading(loading: boolean) {
    isLoading.value = loading
  }

  // Screenshot actions
  function setScreenshotDataUrl(url: string) {
    console.log('Store - setting screenshotDataUrl, length:', url.length)
    screenshotDataUrl.value = url
    console.log('Store - screenshotDataUrl set, current length:', screenshotDataUrl.value?.length || 0)
  }

  function clearScreenshotData() {
    screenshotDataUrl.value = ''
  }

  function setCapturing(capturing: boolean) {
    isCapturing.value = capturing
  }

  return {
    activeDialog,
    notifications,
    isLoading,
    screenshotDataUrl,
    isCapturing,
    openDialog,
    closeDialog,
    showNotification,
    removeNotification,
    showSuccess,
    showError,
    showInfo,
    setLoading,
    setScreenshotDataUrl,
    clearScreenshotData,
    setCapturing
  }
})
