import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { UserSettings } from '@/types'

const SETTINGS_KEY = 'pwa_detector_settings'

const defaultSettings: UserSettings = {
  cacheEnabled: true,
  analyticsEnabled: true,
  errorReportingEnabled: true
}

export const useSettingsStore = defineStore('settings', () => {
  // State
  const settings = ref<UserSettings>({ ...defaultSettings })
  const visitCount = ref(0)

  // Load settings from localStorage
  function loadSettings() {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        settings.value = { ...defaultSettings, ...parsed }
      }

      // Load visit count
      const count = localStorage.getItem('pwa_detector_visits')
      if (count) {
        visitCount.value = parseInt(count, 10)
      }
    } catch (e) {
      console.error('Failed to load settings:', e)
    }
  }

  // Save settings to localStorage
  function saveSettings() {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings.value))
    } catch (e) {
      console.error('Failed to save settings:', e)
    }
  }

  // Increment visit count
  function incrementVisit() {
    visitCount.value++
    try {
      localStorage.setItem('pwa_detector_visits', visitCount.value.toString())
    } catch (e) {
      console.error('Failed to save visit count:', e)
    }
  }

  // Update individual settings
  function setCacheEnabled(enabled: boolean) {
    settings.value.cacheEnabled = enabled
    saveSettings()
  }

  function setAnalyticsEnabled(enabled: boolean) {
    settings.value.analyticsEnabled = enabled
    saveSettings()
  }

  function setErrorReportingEnabled(enabled: boolean) {
    settings.value.errorReportingEnabled = enabled
    saveSettings()
  }

  // Clear all data
  function clearAllData() {
    const keysToKeep = [SETTINGS_KEY]
    const keysToRemove: string[] = []

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && !keysToKeep.includes(key)) {
        keysToRemove.push(key)
      }
    }

    keysToRemove.forEach(key => {
      localStorage.removeItem(key)
    })

    visitCount.value = 0
  }

  // Export user data
  function exportData(): Record<string, unknown> {
    const data: Record<string, unknown> = {
      settings: settings.value,
      visitCount: visitCount.value,
      exportDate: new Date().toISOString()
    }

    // Add any cached results
    const cache = localStorage.getItem('pwa_detection_cache')
    if (cache) {
      data.cachedResult = JSON.parse(cache)
    }

    return data
  }

  // Watch for changes and auto-save
  watch(settings, saveSettings, { deep: true })

  // Initialize
  loadSettings()

  return {
    settings,
    visitCount,
    loadSettings,
    saveSettings,
    incrementVisit,
    setCacheEnabled,
    setAnalyticsEnabled,
    setErrorReportingEnabled,
    clearAllData,
    exportData
  }
})
